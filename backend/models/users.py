from flask_login import UserMixin
from datetime import datetime, timedelta
import secrets

def init_db(database):
    """Initialize User model with database instance"""
    
    class User(UserMixin, database.Model):
        __tablename__ = 'users'
        
        id = database.Column(database.Integer, primary_key=True)
        email = database.Column(database.String(100), unique=True, nullable=False)
        password = database.Column(database.String(255), nullable=False)
        first_name = database.Column(database.String(50), nullable=False)
        last_name = database.Column(database.String(50), nullable=False)
        is_admin = database.Column(database.Boolean, default=False, nullable=False)
        is_active = database.Column(database.Boolean, default=True, nullable=False)
        created_at = database.Column(database.DateTime, default=datetime.utcnow)
        updated_at = database.Column(database.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
        
        # Password reset functionality
        reset_token = database.Column(database.String(100), nullable=True)
        reset_token_expires = database.Column(database.DateTime, nullable=True)
        
        def __repr__(self):
            return f'<User {self.email}>'
        
        @property
        def full_name(self):
            return f"{self.first_name} {self.last_name}"
        
        def generate_reset_token(self):
            """Generate a password reset token that expires in 1 hour"""
            self.reset_token = secrets.token_urlsafe(32)
            self.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
            database.session.commit()
            return self.reset_token
        
        def verify_reset_token(self, token):
            """Verify if the reset token is valid and not expired"""
            if not self.reset_token or not self.reset_token_expires:
                return False
            if self.reset_token != token:
                return False
            if datetime.utcnow() > self.reset_token_expires:
                return False
            return True
        
        def clear_reset_token(self):
            """Clear the reset token after use"""
            self.reset_token = None
            self.reset_token_expires = None
            database.session.commit()
        
        def to_dict(self):
            """Convert user object to dictionary for JSON responses"""
            return {
                'id': self.id,
                'email': self.email,
                'first_name': self.first_name,
                'last_name': self.last_name,
                'full_name': self.full_name,
                'is_admin': self.is_admin,
                'is_active': self.is_active,
                'created_at': self.created_at.isoformat() if self.created_at else None,
                'updated_at': self.updated_at.isoformat() if self.updated_at else None
            }
    
    return User