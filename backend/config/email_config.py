import os
from flask_mail import Mail, Message
from flask import current_app

mail = Mail()

def init_mail(app):
    """Initialize Flask-Mail with the app"""
    # Email configuration
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', '587'))
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
    app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL', 'False').lower() == 'true'
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', os.getenv('MAIL_USERNAME'))
    
    mail.init_app(app)
    return mail

def send_password_reset_email(user, reset_url):
    """Send password reset email to user"""
    try:
        msg = Message(
            subject='Password Reset Request - Flordegrace System',
            recipients=[user.email],
            html=f'''
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
                    
                    <p>Hello {user.first_name},</p>
                    
                    <p>You have requested to reset your password for the Flordegrace System. Click the button below to reset your password:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{reset_url}" 
                           style="background-color: #007bff; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="word-break: break-all; color: #007bff;">{reset_url}</p>
                    
                    <p style="color: #666; font-size: 14px;">
                        This link will expire in 1 hour for security reasons.
                    </p>
                    
                    <p style="color: #666; font-size: 14px;">
                        If you did not request this password reset, please ignore this email.
                    </p>
                    
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">
                        Flordegrace Management System
                    </p>
                </div>
            </div>
            '''
        )
        
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

def send_password_changed_notification(user):
    """Send notification when password is changed"""
    try:
        msg = Message(
            subject='Password Changed - Flordegrace System',
            recipients=[user.email],
            html=f'''
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Password Changed Successfully</h2>
                    
                    <p>Hello {user.first_name},</p>
                    
                    <p>Your password for the Flordegrace System has been successfully changed.</p>
                    
                    <p style="color: #666; font-size: 14px;">
                        If you did not make this change, please contact your administrator immediately.
                    </p>
                    
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">
                        Flordegrace Management System
                    </p>
                </div>
            </div>
            '''
        )
        
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending notification: {str(e)}")
        return False