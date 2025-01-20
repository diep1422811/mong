from fastapi_mail import FastMail, MessageSchema
from jinja2 import Environment, FileSystemLoader

from app.core.email_config import mail_config

env = Environment(loader=FileSystemLoader("app/templates"))


async def send_email(to_email: str, subject: str, html_content: str):
    message = MessageSchema(
        subject=subject, recipients=[to_email], body=html_content, subtype="html"
    )

    fm = FastMail(mail_config)
    await fm.send_message(message)
