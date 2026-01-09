import smtplib
from email.message import EmailMessage

import os
import base64

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from dotenv import load_dotenv

# EMAIL_ADDRESS = 'contact@scan2shop.io'  # Google Gmail Outdated
# EMAIL_PASSWORD = 'phqi vmux niqd hket '  # Google App Password Outdated

EMAIL_ADDRESS = os.environ["EMAIL"]
EMAIL_PASSWORD = os.environ["Password"]
load_dotenv()


def newUserPayload(name):
    NewUser = {
        "Subject": "Welcome to the Scan2Shop!",
        "Msg": "<p>Hello {}!<br>Get ready for an exciting shopping journey filled with amazing deals, personalized recommendations, and top-notch service.</p><hr><p >You are receiving this email as you signed up for our site.</p>".format(name)
    }

    return NewUser


def generate_order_confirmation_email(order):

    # Extracting data from the order object
    user_name = order['user_name']
    order_no = order['order_no']
    delivery_method = order['delivery_method']
    products_ordered = order['products_ordered']
    total_order_amount = order['total_order_amount']
    shipping_address = order['shipping_address']

    # Generating the HTML message
    html_message = f"""<p>Dear {user_name},</p>

        <p>We wanted to take a moment to express our sincere gratitude for choosing to shop with us. Your order has been received and is currently being processed. We appreciate your trust in our products and services.</p>

        <p>Here are the details of your order:</p>

        <p><strong>Order No: </strong>{order_no}</p>

        <p><strong>Payment Method:</strong> Stripe</p>
        <p><strong>Delivery Method:</strong> {delivery_method}</p>

        <p><strong>Products Ordered:</strong></p>"""

    # Adding details of each product ordered
    for i, product in enumerate(products_ordered, start=1):
        product_name = product['name']
        quantity = product['quantity']
        price_per_unit = product['price_per_unit']
        total_price = quantity * price_per_unit
        html_message += f"<p>{i}. <strong>Product Name:</strong> {product_name}</p>"
        html_message += f"<p>Quantity: {quantity}</p>"
        html_message += f"<p>Price per Unit: {price_per_unit}</p>"
        html_message += f"<p>Total Price: {total_price}</p>"

    # Adding total order amount
    html_message += f"<p><strong>Total Order Amount:</strong> {
        total_order_amount}</p>"

    # Adding shipping details
    html_message += f"<p><strong>Shipping Details:</strong></p>"
    html_message += f"<p>Address: {shipping_address}</p>"

    # Adding contact information
    html_message += """<p>If you have any questions or concerns regarding your order, please don't hesitate to contact us at <a href="mailto:contact@scan2shop.io">contact@scan2shop.io</a>. Our customer service team is here to assist you in any way possible.</p>"""

    # Adding closing message
    html_message += """<p>Best Regards,<br>Scan2Shop<br><a href="mailto:contact@scan2shop.io">contact@scan2shop.io</a></p>"""

    return html_message


# NEW
def sendEmail(subject, message, to):
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = to

    msg.set_content(message, subtype='html')
    with smtplib.SMTP_SSL('smtp.hostinger.com', 465) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)
        print(f"Email Sucessfully Sent to {to}")


# ---------------------------------- USED for Gmail SMTP ----------------------------------
# class EmailMailer:
#     def __init__(self) -> None:
#         try:
#             os.chdir(os.path.dirname(os.path.abspath(__file__)))

#             client_secrets_file = "credentials.json"
#             if os.path.exists(client_secrets_file):
#                 with open(client_secrets_file, "r") as json_file:
#                     # Process the file here
#                     print("File opened successfully!")
#             else:
#                 print(f"File not found: {client_secrets_file}")

#             self.cred_file_path = "credentials.json"

#             self.scopes = [
#                 'https://www.googleapis.com/auth/gmail.readonly',
#                 'https://www.googleapis.com/auth/gmail.compose'
#             ]
#         except Exception as e:
#             print(f"Error while Email Config: {e}")

# def get_token(self, path, scopes):
#     """
#     This function returns token for google APIs and Services.

#     1. To create creds for our script, pass the path of credentials.json
#     file. Which is downloaded from google cloud console.

#     2. Pass scopes of your service to the scopes parameter as python list
#     object.

#     *** If you changes scopes and credentials and you recieve any
#         error than delete the existing token.js file and Re-run the code. So
#         it can create a fresh token.json file.

#     3. The file token.json stores the user's access and refresh tokens, and
#         is created automatically when the authorization flow completes for
#         the first time.

#     """

#     # PATH = path
#     SCOPES = scopes
#     token = None

#     # Checks for existing tokens.
#     if os.path.exists('token.json'):
#         token = Credentials.from_authorized_user_file('token.json', SCOPES)

#     # If there are no (valid) tokens available, let it retrieve new tokens.
#     if not token or not token.valid:
#         if token and token.expired and token.refresh_token:
#             token.refresh(Request())
#         else:
#             flow = InstalledAppFlow.from_client_secrets_file(path, scopes)
#             token = flow.run_local_server(port=0)

#         # Saves the credentials for later use.
#         with open('token.json', 'w') as token_file:
#             token_file.write(token.to_json())

#     return token

# def get_service(self, token_creds):
#     try:
#         # Calls the Gmail API
#         service = build('gmail', 'v1', credentials=token_creds)
#         return service

#     except HttpError as error:
#         # Prints error if any
#         print(f'An error occurred: {error}')

# def send_gmail_message(self, recipient, subject, content, sender="kamil.alix1997@gmail.com"):
#    try:
#        token_creds = self.get_token(self.cred_file_path, self.scopes)
#        service = self.get_service(token_creds)

# Sets up message parameters.
#        message = EmailMessage()
#        message.add_alternative(
#            content, subtype='html')  # Set HTML content

#        message['To'] = recipient
#        message['From'] = sender
#        message['Subject'] = subject

# Encodes the message
#        encoded_message = base64.urlsafe_b64encode(
#            message.as_bytes()).decode()

# Creating message
#        create_message = {'raw': encoded_message}

# Sending message
#        send_message = (service.users().messages().send(
#            userId="me", body=create_message).execute())
#       # print(f'Message Id: {send_message["id"]}')
#       print(f"Email Sucessfully Sent to {recipient}")

#    except HttpError as error:
#        print(f'An error occurred: {error}')
#        send_message = None

#    return send_message
# ---------------------------------- USED for Gmail SMTP ----------------------------------

# def sendEmailToNewCustomer(self, name, receiver, server_url):
#     try:
#         # Load HTML template
#         with open('welcome.html', 'r', encoding='utf-8') as file:
#             html_content = file.read()

#         data_dict = {
#             'name': name,
#             'server_url': server_url
#         }

#         # Replace placeholders with actual data
#         for key, value in data_dict.items():
#             new_key = '{{' + key + '}}'
#             html_content = html_content.replace(new_key, str(value))

#         # Assuming 'token_creds' and 'get_service' are defined as before
#         self.send_gmail_message(
#             receiver, 'Welcome to the Scan2Shop!', html_content)
#     except Exception as e:
#         print(f'Unable to Email: {e}')


# OLD
# def sendEmail(subject, message, to):
#     msg = EmailMessage()
#     msg['Subject'] = subject
#     msg['From'] = EMAIL_ADDRESS
#     msg['To'] = to

#     msg.set_content(message, subtype='html')
#     with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
#         smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
#         smtp.send_message(msg)
#         print(f"Email Sucessfully Sent to {to}")


# if __name__ == "__main__":

    # sendEmail("My Subject", '<p>Hello <h1>Rizwan!</h1><br>Welcome to the Scan2Shop</p>',
        # 'ahmed@yopmail.com')
    # sendEmail_2('Scan2Shop Final Test', 'Saad Ali', '<p>Hello <h1>Saad!</h1><br>Welcome to the Scan2Shop</p>','saad.alix99@gmail.com')
