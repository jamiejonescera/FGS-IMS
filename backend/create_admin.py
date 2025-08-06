from app import app, db, User, bcrypt

with app.app_context():
    # Check if admin already exists
    existing_admin = User.query.filter_by(email='admin@gmail.com').first()
    
    if existing_admin:
        print("❌ Admin user already exists!")
        print(f"Email: {existing_admin.email}")
        print(f"Name: {existing_admin.full_name}")
        print(f"Admin: {existing_admin.is_admin}")
    else:
        # Create admin user
        admin_user = User(
            email='admin@gmail.com',
            password=bcrypt.generate_password_hash('Admin123!').decode('utf-8'),
            first_name='System',
            last_name='Administrator',
            is_admin=True,
            is_active=True
        )
        
        db.session.add(admin_user)
        db.session.commit()
        print("✅ Admin user created successfully!")
        print("Email: admin@gmail.com")
        print("Password: Admin123!")
        print("You can now login to your app!")