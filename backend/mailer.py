from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import aiosmtplib
from config import settings


async def send_otp_email(to: str, otp: str) -> None:
    msg = MIMEMultipart("alternative")
    msg["From"] = settings.smtp_from
    msg["To"] = to
    msg["Subject"] = "Your StartupA2Z sign-in code"
    msg.attach(MIMEText(f"Your verification code is: {otp}\n\nThis code expires in 10 minutes.", "plain"))
    msg.attach(MIMEText(
        f"<p>Your StartupA2Z verification code is:</p><h2>{otp}</h2>"
        f"<p>This code expires in 10 minutes.</p>",
        "html",
    ))

    await aiosmtplib.send(
        msg,
        hostname=settings.smtp_host,
        port=settings.smtp_port,
        username=settings.smtp_user or None,
        password=settings.smtp_pass or None,
        use_tls=settings.smtp_port == 465,
        start_tls=settings.smtp_port == 587,
    )
