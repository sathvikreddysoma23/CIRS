import logging
from typing import List
from app.config import settings

logger = logging.getLogger(__name__)

# Only import fastapi_mail if credentials are configured
_mail_enabled = bool(settings.MAIL_USERNAME and settings.MAIL_PASSWORD)

if _mail_enabled:
    from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType

    mail_config = ConnectionConfig(
        MAIL_USERNAME=settings.MAIL_USERNAME,
        MAIL_PASSWORD=settings.MAIL_PASSWORD,
        MAIL_FROM=settings.MAIL_FROM,
        MAIL_PORT=settings.MAIL_PORT,
        MAIL_SERVER=settings.MAIL_SERVER,
        MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
    )
    fast_mail = FastMail(mail_config)


async def send_email(subject: str, recipients: List[str], body: str):
    """Send an HTML email. Silently skips if mail is not configured."""
    if not _mail_enabled:
        logger.warning(f"[EMAIL SKIPPED] {subject} → {recipients}")
        return
    try:
        message = MessageSchema(
            subject=subject,
            recipients=recipients,
            body=body,
            subtype=MessageType.html,
        )
        await fast_mail.send_message(message)
        logger.info(f"Email sent to {recipients}: {subject}")
    except Exception as e:
        logger.error(f"Failed to send email: {e}")


async def send_complaint_submitted_email(to_email: str, name: str, complaint_title: str, complaint_id: str):
    subject = "✅ Complaint Submitted – CIRS"
    body = f"""
    <h2>Hello {name},</h2>
    <p>Your complaint <strong>"{complaint_title}"</strong> has been successfully submitted.</p>
    <p><strong>Complaint ID:</strong> {complaint_id}</p>
    <p>You will be notified once it is reviewed and assigned.</p>
    <br>
    <p>Regards,<br><strong>CIRS Platform</strong></p>
    """
    await send_email(subject, [to_email], body)


async def send_status_update_email(to_email: str, name: str, complaint_title: str, new_status: str, note: str):
    subject = f"🔔 Complaint Status Updated to '{new_status.upper()}' – CIRS"
    body = f"""
    <h2>Hello {name},</h2>
    <p>The status of your complaint <strong>"{complaint_title}"</strong> has been updated.</p>
    <p><strong>New Status:</strong> {new_status.upper()}</p>
    <p><strong>Note from department:</strong> {note or 'N/A'}</p>
    <br>
    <p>Regards,<br><strong>CIRS Platform</strong></p>
    """
    await send_email(subject, [to_email], body)


async def send_assignment_email(to_email: str, dept_name: str, complaint_title: str, complaint_id: str):
    subject = "📋 New Complaint Assigned – CIRS"
    body = f"""
    <h2>Hello {dept_name} Team,</h2>
    <p>A new complaint has been assigned to your department.</p>
    <p><strong>Title:</strong> {complaint_title}</p>
    <p><strong>Complaint ID:</strong> {complaint_id}</p>
    <p>Please login to the CIRS dashboard to review and resolve it.</p>
    <br>
    <p>Regards,<br><strong>CIRS Admin</strong></p>
    """
    await send_email(subject, [to_email], body)
