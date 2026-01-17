from flask import render_template, url_for
from itsdangerous import URLSafeSerializer, URLSafeTimedSerializer
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv
import random
from time import time

load_dotenv()  # load environment varaibles
mail = Mail()


def send_confirmation_email(user_email) -> None:
    """ sends confirmation email """
    confirm_serializer = URLSafeTimedSerializer(os.environ["SECRET_KEY"])
    confirm_url = url_for(
        'confirm_email',
        token=confirm_serializer.dumps(user_email,
                                       salt='email-confirmation-salt'),
        _external=True)
    html = render_template('email_confirmation.html', confirm_url=confirm_url)
    msg = Message(
        'Confirm Your Email Address',
        recipients=[user_email],
        sender=("Scan2Shop Email Confirmation", 'contact'),
        html=html,
    )
    mail.send(msg)


def generate_order_no():
    start_range = 10**8  # Minimum 9-digit number (100,000,000)
    end_range = (10**9) - 1  # Maximum 9-digit number (999,999,999)

    # Generate a random 9-digit number
    random_number = random.randint(start_range, end_range)
    return random_number


def read_user(token):
    try:
        serializer = URLSafeSerializer(os.environ['SECRET_KEY'])
        # Decrypt the token to get the concatenated string of user_id and timestamp
        concatenated_data = serializer.loads(token)

        # Extract user_id and timestamp from the concatenated data
        # Extract the user_id (assuming it's of fixed length)
        user_id = concatenated_data[:-10]
        # Extract the timestamp (assuming it's 10 characters long)
        timestamp = concatenated_data[-10:]

        # Now you have access to both user_id and timestamp
        return user_id

    except Exception as e:
        return e


def generate_token(user_id):
    serializer = URLSafeSerializer(os.environ['SECRET_KEY'])
    timestamp = str(int(time()))  # Include current timestamp
    return serializer.dumps(str(user_id) + timestamp)


# class FunctionalClass:

#     def search_product(product_id, database):
#         for product in database:
#             if product['ID'] == product_id:
#                 return product
#         return None

# def generate_random_number():
#     '''Generate 6 digit random number'''
#     return random.randint(100000, 999999)

# Example usage
# random_number = generate_six_digit_number()
# print("Random 6-digit number:", random_number)


# @app.route('/login', methods=['GET'])
# def login():
#     # Assuming user authentication is successful
#     user_id = 123  # Replace with actual user ID
#     # Create token (could be a JWT or any other format)
#     token = generate_token(user_id)
#     # Create response
#     response = make_response({'message': 'Login successful'})
#     # Set cookie with token
#     response.set_cookie('token', token)
#     return response

# @app.route('/protected')
# def protected():
#     # Retrieve token from cookie
#     token = request.cookies.get('token')
#     # Validate token (if necessary)
#     if validate_token(token):
#         return 'Access granted!'
#     else:
#         return 'Access denied. Invalid token.'
# def read_user(token):
#     try:
#         serializer = URLSafeSerializer(os.environ['SECRET_KEY'])
#         # Decrypt the token to get the user ID
#         user_id = serializer.loads(token)
#         return user_id
#     except Exception as e:
#         return e


# Helper functions for generating and validating tokens
# def generate_token(user_id):
#     serializer = URLSafeSerializer(os.environ['SECRET_KEY'])
#     return serializer.dumps(user_id)


# def validate_token(token):
#     from itsdangerous import URLSafeSerializer
#     serializer = URLSafeSerializer(os.environ['SECRET_KEY'])
#     try:
#         user_id = serializer.loads(token)
#         return True
#     except:
#         return False

if __name__ == "__main__":
    p = generate_order_no()
    print(p)
