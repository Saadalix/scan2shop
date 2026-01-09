from flask import Flask, render_template, request, make_response, jsonify, redirect, url_for, flash, abort, session
from flask_cors import CORS
import json
import re
from flask_pymongo import PyMongo
from flask_login import LoginManager, login_user, current_user, login_required, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
# from flask_session import Session
# from flask_caching import Cache
from itsdangerous import URLSafeSerializer, URLSafeTimedSerializer

from datetime import timedelta
import os
import stripe
import copy

import socket

# Custom
import functions
from Common import Email
# from forms import LoginForm, RegisterForm
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes
# Allows only specific origins
# cors = CORS(app, resources={
#     r"/readProductBySKU": {"origins": "*"},
#     r"/readProductList": {"origins": "*"}
# })

# It will store in the hard drive (these files are stored under a /flask_session folder in your config directory.)
app.config["SESSION_TYPE"] = "filesystem"
stripe.api_key = os.environ["STRIPE_API"]
# Connecting MongoDB
app.config["MONGO_URI"] = "mongodb://localhost:27017/scan2shop"
db = PyMongo(app).db
PORT = 8000
load_dotenv()

# Set the static URL path and folder
app.static_url_path = '/static'
app.static_folder = 'static'


def get_server_url():
    try:
        # Attempt to connect to an Internet host in order to determine the local network IP
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            # Use Google's public DNS server to find the network IP
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"  # Default to localhost if network is unreachable
    return f'http://{ip}:{PORT}'


@app.route('/')
def home():
    token = request.cookies.get('token')
    if token:
        user_id = functions.read_user(token)
        user = db.users.find_one({'ID': int(user_id)})  # Fetch User From DB
        return render_template('base.html', name=user['name'])
    else:
        return render_template('base.html')


@app.route('/shop')
def shop():

    # Fetch product data from MongoDB collection
    productDetails = db.products.find()

    # Convert cursor object to list of dictionaries
    products = list(productDetails)

    token = request.cookies.get('token')
    if token:
        user_id = functions.read_user(token)
        user = db.users.find_one({'ID': int(user_id)})  # Fetch User From DB
        return render_template('shop.html', products=products, name=user['name'])
    else:
        return render_template('shop.html', products=products)


@app.route('/category/<category>')
def category(category):
    category_data = db.category.find_one({"path": category})
    if category_data:
        if isinstance(category, str):
            category_id = category_data["ID"]  # Extract the ID of the category
            # Extract the Title of the category
            category_title = category_data["Title"]
            products = db.products.find({"Categories": category_id})
            products = list(products)

            token = request.cookies.get('token')
            if token:
                user_id = functions.read_user(token)
                user = db.users.find_one(
                    {'ID': int(user_id)})  # Fetch User From DB
                return render_template('shop.html', products=products, categoryName=category_title, name=user['name'])

            else:
                return render_template('shop.html', products=products, categoryName=category_title)
        else:
            return render_template('<h1>Invalid Category!</h1>')
    else:
        return render_template('<h1>Invalid Category!</h1>')


@app.route('/search', methods=['GET'])
def search():
    # Get search query from the POST request
    search_query = request.args.get('q')

    # Perform the search query in MongoDB
    matched_products = db.products.find(
        {'Title': {'$regex': search_query, '$options': 'i'}})

    # Convert the cursor object to a list of dictionaries
    matched_products_list = list(matched_products)

    token = request.cookies.get('token')
    if token:
        user_id = functions.read_user(token)
        user = db.users.find_one({'ID': int(user_id)})  # Fetch User From DB
        return render_template('shop.html', products=matched_products_list, search=search_query, name=user['name'])
    else:
        # Render template with the fetched products
        return render_template('shop.html', products=matched_products_list, search=search_query)


@app.route('/scan2shop')
def scan2shop():
    token = request.cookies.get('token')
    # get server url
    server_url = get_server_url()
    if token:
        user_id = functions.read_user(token)
        user = db.users.find_one({'ID': int(user_id)})  # Fetch User From DB
        return render_template('scan2shop.html', name=user['name'], server_url=server_url)
    else:
        return render_template('scan2shop.html', server_url=server_url)


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        user = db.users.find_one({'email': data['Email']})  # Check User in DB
        if user is None:
            return False
        else:
            if user['password'] == data['Password']:
                token = functions.generate_token(user['ID'])
                # Create response
                response = make_response(
                    {'message': 'Login successful', 'token': token})
                # Set cookie with token
                # response.set_cookie('token', token, httponly=True, max_age=60*60*24) #1 day expiry
                return response
            else:
                # wrong password
                return jsonify({"message": e, "status": False})
    except Exception as e:
        return jsonify({"message": e, "status": False})


@app.route('/createUser', methods=['POST'])
def create_user():
    data = request.json

    # Check if Users already available by email
    user_document = db.users.find_one({'email': data['Email']})
    if user_document:
        user_document['_id'] = str(user_document['_id'])
        response = {
            "status": False,
            "message": "User already exist"
        }
    else:
        # Find the last document in the collection
        last_document = db.users.find_one(sort=[('_id', -1)])

        payload = {
            "ID": last_document['ID'] + 1,
            "name": data['Name'],
            "email": data['Email'],
            "password": data['Password'],
            "admin": 0,
            "email_confirmed": 0
        }

        # Insert the data into the user collection
        inserted_user = db.users.insert_one(payload)

        # Convert ObjectId to string before jsonify
        payload['_id'] = str(payload['_id'])

        # Prepare the response
        response = {"status": True, "message": "User created successfully"}

        # Send Email Noti
        payload = Email.newUserPayload(data['Name'])
        # server_url = get_server_url()

        # email_obj = Email.EmailMailer()
        # email_obj.sendEmailToNewCustomer(data['Name'], data['Email'], server_url)
        Email.sendEmail(payload['Subject'], payload['Msg'], data['Email'])

    return jsonify(response), 200


@app.route('/readProductBySKU', methods=['POST'])
def readProductBySKU():
    try:
        data = request.json
        matched_product = db.products.find_one({'SKU': data['SKU']})

        # Delete Sensitive Product Details before sending
        del matched_product['_id']
        del matched_product['Categories']
        del matched_product['stripe_price_id']

        return jsonify(matched_product)
    except Exception as e:
        return e

# Return Product Details to Load Product in Cart - Called from base script


@app.route('/readProductList', methods=['POST'])
def read_product_list():
    try:
        data = request.json
        CartData = data['Cart']
        productList = []
        total = 0
        for sku, quan in CartData.items():
            matched_product = db.products.find_one({'SKU': sku})
            matched_product['_id'] = str(matched_product['_id'])
            matched_product['TotalPrice'] = float(
                matched_product['Price']) * quan
            matched_product['Quantity'] = quan
            total += matched_product['TotalPrice']
            productList.append(matched_product)

        productList.append({"Total": round(total, 2)})
        return jsonify(productList)
    except Exception as e:
        return e


@app.route('/shop/<product_name>', methods=['GET'])
def get_product_by_name(product_name):
    product = db.products.find_one({'slug': product_name})
    if product:
        # Accessing cookies from the request
        # Default value '{}' if the cookie is not present
        cart_cookie = request.cookies.get('cart', '{}')
        cart_dict = json.loads(cart_cookie)
        if cart_dict:
            if product['SKU'] in cart_dict.keys():
                # Forcefullt 2 digit number
                quantity = str('{:02d}'.format(cart_dict[product['SKU']]))
            else:
                quantity = '01'
        else:
            quantity = '01'

        token = request.cookies.get('token')
        if token:
            user_id = functions.read_user(token)
            user = db.users.find_one(
                {'ID': int(user_id)})  # Fetch User From DB
            return render_template('product_view.html', product=product, quantity=quantity, name=user['name'])
        else:
            return render_template('product_view.html', product=product, quantity=quantity)
    else:
        return jsonify({'message': 'Product not found'}), 404


@app.route('/checkout')
def checkout():
    user = ''
    # Default value '{}' if the cookie is not present
    cart_cookie = request.cookies.get('cart', '{}')
    cart_dict = json.loads(cart_cookie)

    token = request.cookies.get('token', '')
    if token == '':
        user = 'Guest '

    # Check if 'cart' cookie is available in the request cookies
    if cart_dict:
        productList = []
        total = 0
        for sku, quan in cart_dict.items():
            matched_product = db.products.find_one({'SKU': sku})
            matched_product['_id'] = str(matched_product['_id'])
            matched_product['TotalPrice'] = float(
                matched_product['Price']) * quan
            matched_product['Quantity'] = quan
            total += matched_product['TotalPrice']
            productList.append(matched_product)

        Total = round(total, 2)

        token = request.cookies.get('token')
        if token:
            user_id = functions.read_user(token)
            user_ = db.users.find_one(
                {'ID': int(user_id)})  # Fetch User From DB
            return render_template('checkout.html', Products=productList, Total=Total, User=user, Items=len(productList), name=user_['name'], email=user_['email'])
        else:
            # If 'cart' cookie is available, render 'checkout.html' template
            return render_template('checkout.html', Products=productList, Total=Total, User=user, Items=len(productList))
    else:
        # If 'cart' cookie is not available, return an error message
        return render_template('<h1>Cart cookie not found</h1>')


@app.route('/stripeCheckout', methods=['POST'])
def stripeCheckout():
    try:
        order_payload = {}
        user_ref_id = 0

        token = request.cookies.get('token')
        if token:
            # When User is loggedIn
            user_id = functions.read_user(token)
            user = db.users.find_one(
                {'ID': int(user_id)})  # Fetch User From DB
            order_payload['UserId'] = user['ID']
            user_ref_id = user['ID']
        else:
            order_payload['UserId'] = None

        data = request.json
        user = db.users.find_one({'email': data['email']})  # Check User in DB

        if user is None:  # New Email
            order_payload['UserType'] = 'Guest'
        else:
            # Existing User
            order_payload['UserType'] = 'Registered'

        order_payload['Name'] = data['name']
        order_payload['Email'] = data['email']
        order_payload['Phone'] = data['phone']
        order_payload['Address'] = data['address'] if data.get(
            'address') != '' else None
        order_payload['Address2'] = data['address2'] if data.get(
            'address2') != '' else None
        order_payload['Country'] = data['country'] if data.get(
            'country') != '' else None
        order_payload['ShoppingMethod'] = data['shoppingMethod']

        # Fetch Cart Data
        # cart_cookie = request.cookies.get('cart', '{}')  # Default value '{}' if the cookie is not present
        # Default value '{}' if the cookie is not present
        cart_dict = data['cart']
        # cart_dict = json.loads(cart_cookie)

        # Fetch All cart Product from DB
        productList = []
        orderProductList = []
        payload = {}
        order_pro_payload = {}
        for sku, quan in cart_dict.items():
            # print(f"Key: {sku}, Value: {quan}")
            matched_product = db.products.find_one({'SKU': sku})
            payload['price'] = matched_product['stripe_price_id']
            payload['quantity'] = quan

            order_pro_payload['sku'] = matched_product['SKU']
            order_pro_payload['title'] = matched_product['Title']
            order_pro_payload['price'] = matched_product['Price']
            order_pro_payload['quantity'] = quan

            copied_dict = copy.deepcopy(
                order_pro_payload)  # copy of the dictionary
            orderProductList.append(copied_dict)

            copied_dict = copy.deepcopy(payload)  # copy of the dictionary
            productList.append(copied_dict)

        # if data['shoppingMethod'] == 'homeDelivery':
        #     cart_dict = json.loads(cart_cookie)
        # if data['shoppingMethod'] == 'collectNow':
        #     pass

        # Add ProductList into Order
        order_payload['Products'] = orderProductList

        order_no = functions.generate_order_no()
        order_payload['OrderNo'] = str(order_no)

        order_payload['EmailSent'] = 0

        checkout_session = stripe.checkout.Session.create(
            client_reference_id=user_ref_id,
            line_items=productList,
            payment_method_types=[
                'card',
            ],
            mode='payment',
            success_url=url_for('payment_success',
                                _external=True) + f'?order={order_no}',
            cancel_url=url_for('payment_failure', _external=True),
        )

        # insert oder payload into db
        inserted_user = db.orders.insert_one(order_payload)

        # Send URL
        return jsonify({'url': checkout_session.url}), 200
    except Exception as e:
        return str(e)


@app.route('/payment_success')
def payment_success():
    order_number = request.args.get('order')
    server_url = get_server_url()
    # server_url = 'http://localhost:5000'  Used to Debug
    # Render the failure template
    response = make_response(render_template(
        'success.html', order_number=order_number, server_url=server_url))
    # Delete the cookie by setting its value to an empty string
    response.delete_cookie('cart')
    return response


@app.route('/payment_failure')
def payment_failure():
    return render_template('failure.html')


@app.route('/confirm_payment', methods=['POST'])
def confirm_payment():
    try:
        print('/confirm_payment called')
        data = request.json
        order_number = data['order']
        # Search by Order Number
        order = db.orders.find_one(
            {'OrderNo': order_number})  # Check User in DB
        if order:
            if order['EmailSent'] == 0:
                email_payload = {}

                email_payload['user_name'] = order['Name']
                email_payload['delivery_method'] = order['ShoppingMethod']
                email_payload['order_no'] = order_number

                products_ordered = []
                payload = {}
                total = 0
                for prod in order['Products']:
                    payload['name'] = prod['title']
                    payload['quantity'] = prod['quantity']
                    payload['price_per_unit'] = float(prod['price'])

                    total = +  int(prod['quantity']) * float(prod['price'])

                    copied_dict = copy.deepcopy(
                        payload)  # copy of the dictionary
                    products_ordered.append(copied_dict)

                email_payload['products_ordered'] = products_ordered
                email_payload['total_order_amount'] = total
                email_payload['shipping_address'] = order['Address']

                if order['Address2']:
                    email_payload['shipping_address2'] = order['Address2']

                msg = Email.generate_order_confirmation_email(email_payload)

                # Send Email by Google
                # email_obj = Email.EmailMailer()
                # email_obj.send_gmail_message( order['Email'], "Scan2Shop - Thank You for Your Order!", msg)

                Email.sendEmail(
                    "Scan2Shop - Thank You for Your Order!", msg, order['Email'])

                return jsonify({'success': True, 'message': 'Payment confirmed successfully.'}), 200
            else:
                return jsonify({'success': True, 'message': 'Payment confirmed successfully.'}), 200
        else:
            return jsonify({'success': False, 'message': 'Payment confirmation failed. Order not found.'}), 200
    except Exception as e:
        return jsonify(e)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)
