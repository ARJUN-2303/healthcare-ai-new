import smtplib
import os

from email.mime.text import MIMEText
from dotenv import load_dotenv


load_dotenv()


EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def send_otp_email(receiver_email: str, otp: str):

    subject = "Healthcare AI - Password Reset OTP"

    body = f"""
Hello,

Your OTP for password reset is:

{otp}

This OTP is valid for 10 minutes.

Do not share this OTP with anyone.

Healthcare AI Team
"""

    message = MIMEText(body)

    message["Subject"] = subject
    message["From"] = EMAIL_ADDRESS
    message["To"] = receiver_email


    with smtplib.SMTP_SSL(
        "smtp.gmail.com",
        465
    ) as server:

        server.login(
            EMAIL_ADDRESS,
            EMAIL_PASSWORD
        )

        server.sendmail(
            EMAIL_ADDRESS,
            receiver_email,
            message.as_string()
        )