from flask import Flask, send_from_directory, abort, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_mail import Mail
from dotenv import load_dotenv
import os
from flask_session import Session
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from datetime import timedelta

# Load environment variables
load_dotenv()
database_url = os.getenv('DATABASE_URL')
if not database_url:
    raise RuntimeError("DATABASE_URL is not set in .env file!")

print("✅ DATABASE_URL Loaded:", database_url)

# Initialize Flask app
app = Flask(__name__)

# Enhanced CORS configuration - CRITICAL for session cookies
CORS(app, 
     supports_credentials=True,
     origins=[
         'http://localhost:3002', 
         'http://127.0.0.1:3002',
         'http://localhost:3000',
         'http://127.0.0.1:3000'
     ],
     allow_headers=['Content-Type', 'Authorization', 'Cookie'],
     expose_headers=['Set-Cookie'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# Secret Key - Make this stronger for production
app.secret_key = os.getenv('SECRET_KEY', 'your-super-secret-key-here-change-this')

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)

# Initialize User model with db instance
from models.users import init_db
User = init_db(db)

# Enhanced session configuration for better persistence
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_KEY_PREFIX'] = 'flordegrace_session:'
app.config['SESSION_COOKIE_NAME'] = 'flordegrace_session'
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = False  # Allow JS access for debugging
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_DOMAIN'] = None  # Allow all domains for development
app.config['SESSION_COOKIE_PATH'] = '/'
app.config['SESSION_FILE_DIR'] = os.path.join(os.getcwd(), 'flask_sessions')
app.config['SESSION_FILE_THRESHOLD'] = 500
app.config['SESSION_FILE_MODE'] = 0o600

# Set session lifetime to 24 hours
app.permanent_session_lifetime = timedelta(hours=24)

# Ensure session directory exists with proper permissions
session_dir = app.config['SESSION_FILE_DIR']
os.makedirs(session_dir, exist_ok=True)
print("✅ Session storage directory:", session_dir)

# Initialize session BEFORE Flask-Login
Session(app)

# Initialize Flask-Login with better configuration
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'
login_manager.login_message = 'Please log in to access this page.'
login_manager.session_protection = 'basic'  # Less aggressive session protection
login_manager.remember_cookie_name = 'flordegrace_remember_token'
login_manager.remember_cookie_duration = timedelta(days=7)
login_manager.remember_cookie_secure = False  # Set to True in production
login_manager.remember_cookie_httponly = True

# Initialize Flask-Mail
from config.email_config import init_mail
mail = init_mail(app)

@login_manager.user_loader
def load_user(user_id):
    try:
        return User.query.get(int(user_id))
    except Exception as e:
        print(f"❌ Error loading user {user_id}: {e}")
        return None

# Create an admin user if it doesn't exist
def create_admin():
    admin_email = "admin@gmail.com"
    admin_password = "Admin123!"
    existing_admin = User.query.filter_by(email=admin_email).first()

    if not existing_admin:
        print("✅ Creating admin user...")
        admin_user = User(
            email=admin_email,
            password=bcrypt.generate_password_hash(admin_password).decode('utf-8'),
            first_name="System",
            last_name="Administrator",
            is_admin=True
        )
        db.session.add(admin_user)
        db.session.commit()
        print(f"✅ Admin user created: {admin_email} / {admin_password}")
    else:
        print("✅ Admin user already exists.")

# Serve frontend files
frontend_folder = os.path.join(os.getcwd(), "..", "frontend", "dist")
@app.route("/", defaults={"filename": ""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html"
    try:
        return send_from_directory(frontend_folder, filename)
    except FileNotFoundError:
        abort(404)

# Import and register Blueprints
from routes.departmentRoutes import department_bp
from routes.supplierRoutes import supplier_bp
from routes.productsRoutes import product_bp
from routes.authRoutes import auth_bp
from routes.adminRoutes import admin_bp
from routes.purchaseRoutes import purchase_bp
from routes.evaluateRoutes import evaluate_bp
from routes.damageRoutes import damage_bp
from routes.inventoryRoutes import inventory_bp
from routes.productsupplierRoutes import product_supplier_bp
from routes.maintenanceRoutes import maintenance_bp
from routes.departmentrequestRoutes import departmentrequest_bp

app.register_blueprint(department_bp)
app.register_blueprint(supplier_bp)
app.register_blueprint(product_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(purchase_bp)
app.register_blueprint(evaluate_bp)
app.register_blueprint(damage_bp)
app.register_blueprint(inventory_bp)
app.register_blueprint(product_supplier_bp)
app.register_blueprint(maintenance_bp)
app.register_blueprint(departmentrequest_bp)

# Test database connection
@app.route("/test-db")
def test_db():
    try:
        result = db.session.execute("SELECT 1")
        return jsonify({"message": "Database connection successful", "result": [row[0] for row in result]}), 200
    except Exception as e:
        print("❌ Database connection failed:", str(e))
        return jsonify({"message": "Database connection failed", "error": str(e)}), 500

# Run Flask App
if __name__ == '__main__':
    with app.app_context():
        create_admin()
    print("✅ Flask App is running on http://127.0.0.1:5000")
    app.run(host='127.0.0.1', port=5000, debug=True)