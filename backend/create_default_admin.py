#!/usr/bin/env python3
"""
FGS-IMS Default Admin Setup Script
Creates a default administrator account for first-time setup
"""

from app import app, db, User
from flask_bcrypt import Bcrypt
import sys

# Initialize bcrypt
bcrypt = Bcrypt(app)

def create_default_admin():
    """Creates a default admin account if none exists"""
    
    print("🚀 FGS-IMS Admin Setup")
    print("=" * 40)
    
    try:
        # Check if any admin already exists
        existing_admin = User.query.filter_by(is_admin=True).first()
        if existing_admin:
            print("✅ Admin account already exists!")
            print(f"📧 Email: {existing_admin.email}")
            print(f"👤 Name: {existing_admin.first_name} {existing_admin.last_name}")
            print("\n💡 If you forgot your credentials, you can:")
            print("   1. Use the 'Forgot Password' feature")
            print("   2. Or delete the database and run this script again")
            return
        
        # Create default admin
        print("🔧 Creating default administrator account...")
        
        hashed_password = bcrypt.generate_password_hash('admin123').decode('utf-8')
        admin_user = User(
            email='admin@localhost',
            password=hashed_password,
            first_name='System',
            last_name='Administrator',
            is_admin=True,
            is_active=True
        )
        
        db.session.add(admin_user)
        db.session.commit()
        
        print("🎉 Default admin created successfully!")
        print("=" * 40)
        print("📧 Email:    admin@localhost")
        print("🔑 Password: admin123")
        print("👤 Name:     System Administrator")
        print("=" * 40)
        print("⚠️  SECURITY WARNING:")
        print("   Please login and change these credentials immediately!")
        print("   Go to: Profile → Edit Profile")
        print("=" * 40)
        print("✨ You can now start your Flask app and login!")
        
    except Exception as e:
        print(f"❌ Error creating admin: {str(e)}")
        db.session.rollback()
        sys.exit(1)

def main():
    """Main function with application context"""
    with app.app_context():
        try:
            # Test database connection
            db.engine.execute('SELECT 1')
            print("✅ Database connection successful")
            
            # Create admin
            create_default_admin()
            
        except Exception as e:
            print(f"❌ Database connection failed: {str(e)}")
            print("💡 Make sure to:")
            print("   1. Set up your database")
            print("   2. Run 'flask db upgrade' first")
            print("   3. Check your DATABASE_URL in .env")
            sys.exit(1)

if __name__ == '__main__':
    main()