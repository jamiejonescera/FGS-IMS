from flask import Flask, send_from_directory, abort, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_mail import Mail
from dotenv import load_dotenv
import os
from flask_session import Session
from flask_login import LoginManager, current_user
from flask_bcrypt import Bcrypt
from datetime import timedelta
from flask_login import LoginManager, current_user, login_required
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

# ============================================
# FIXED SESSION CONFIGURATION
# ============================================
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_KEY_PREFIX'] = 'flordegrace_session:'
app.config['SESSION_COOKIE_NAME'] = 'flordegrace_session'
app.config['SESSION_COOKIE_SECURE'] = False  # Important for HTTP localhost
app.config['SESSION_COOKIE_HTTPONLY'] = False  # Allow JavaScript access for debugging
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Important for CORS
app.config['SESSION_COOKIE_DOMAIN'] = None  # Let Flask handle domain automatically
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

# ============================================
# FIXED FLASK-LOGIN CONFIGURATION
# ============================================
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = None  # Don't redirect for API, return 401 instead
login_manager.login_message = None  # No flash messages for API
login_manager.session_protection = None  # Disable aggressive session protection
login_manager.remember_cookie_name = 'flordegrace_remember_token'
login_manager.remember_cookie_duration = timedelta(days=7)
login_manager.remember_cookie_secure = False  # Set to True in production with HTTPS
login_manager.remember_cookie_httponly = True

# ============================================
# FIXED USER LOADER WITH DEBUGGING
# ============================================
@login_manager.user_loader
def load_user(user_id):
    """Load user from database by ID with enhanced debugging"""
    try:
        print(f"🔍 Loading user with ID: {user_id}")
        user = User.query.get(int(user_id))
        if user:
            print(f"✅ User loaded successfully: {user.email}")
            print(f"   - User ID: {user.id}")
            print(f"   - Is Active: {user.is_active}")
            print(f"   - Is Admin: {user.is_admin}")
            return user
        else:
            print(f"❌ No user found with ID: {user_id}")
            return None
    except Exception as e:
        print(f"❌ Error loading user {user_id}: {e}")
        return None

# ============================================
# UNAUTHORIZED HANDLER FOR API RESPONSES
# ============================================
@login_manager.unauthorized_handler
def unauthorized():
    """Return JSON response for unauthorized access instead of redirect"""
    print("🚫 Unauthorized access attempt")
    return jsonify({
        'success': False, 
        'message': 'Authentication required',
        'authenticated': False
    }), 401

# Initialize Flask-Mail
from config.email_config import init_mail
mail = init_mail(app)

# ============================================
# DEBUG ROUTES FOR TESTING AUTHENTICATION
# ============================================
# Add these debug routes to your app.py (after all your other routes)
@app.route('/debug/test-profile-put', methods=['PUT'])
@login_required
def debug_test_profile_put():
    return jsonify({
        'success': True,
        'message': 'PUT with @login_required works!',
        'user': current_user.email
    })

@app.route('/debug/detailed-auth', methods=['GET', 'PUT', 'POST'])
def debug_detailed_auth():
    """Detailed debug for all request types"""
    from flask_login import current_user
    import datetime
    
    debug_info = {
        'timestamp': datetime.datetime.now().isoformat(),
        'method': request.method,
        'endpoint': request.endpoint,
        'url': request.url,
        'headers': dict(request.headers),
        'cookies': dict(request.cookies),
        'session_data': dict(session),
        'current_user': {
            'exists': current_user is not None,
            'is_authenticated': current_user.is_authenticated if current_user else False,
            'is_active': getattr(current_user, 'is_active', None),
            'is_anonymous': getattr(current_user, 'is_anonymous', None),
            'get_id': getattr(current_user, 'get_id', lambda: None)(),
            'email': getattr(current_user, 'email', None),
        },
        'flask_login_info': {
            'session_protection': login_manager.session_protection,
            'login_view': login_manager.login_view,
            'remember_cookie_name': login_manager.remember_cookie_name,
        }
    }
    
    print(f"🔍 DETAILED DEBUG - {request.method} {request.url}")
    print(f"   Session: {dict(session)}")
    print(f"   Cookies: {dict(request.cookies)}")
    print(f"   User authenticated: {current_user.is_authenticated if current_user else False}")
    print(f"   User email: {getattr(current_user, 'email', 'N/A')}")
    
    return jsonify(debug_info)

@app.route('/debug/session-comparison')
def debug_session_comparison():
    """Compare session data between different request types"""
    return jsonify({
        'message': 'Test this endpoint with different methods to compare sessions',
        'instructions': [
            'Call GET /debug/detailed-auth',
            'Call PUT /debug/detailed-auth', 
            'Call PUT /api/auth/profile with credentials',
            'Compare the session data between calls'
        ]
    })

@app.route('/debug/test-login-required', methods=['GET', 'PUT', 'POST'])
@login_required
def debug_test_login_required():
    """Test login_required decorator on different methods"""
    return jsonify({
        'success': True,
        'method': request.method,
        'message': f'{request.method} request successful with @login_required',
        'user': current_user.email if current_user.is_authenticated else 'Not authenticated'
    })

@app.route('/debug/manual-auth-check', methods=['GET', 'PUT', 'POST'])
def debug_manual_auth_check():
    """Manual authentication check without decorator"""
    from flask_login import current_user
    
    result = {
        'method': request.method,
        'manual_check': {
            'current_user_exists': current_user is not None,
            'is_authenticated': current_user.is_authenticated if current_user else False,
            'user_id': getattr(current_user, 'id', None),
            'email': getattr(current_user, 'email', None),
        },
        'session_info': {
            'has_user_id': '_user_id' in session,
            'user_id_in_session': session.get('_user_id'),
            'session_keys': list(session.keys()),
        },
        'cookies_info': {
            'has_session_cookie': 'flordegrace_session' in request.cookies,
            'has_remember_token': 'remember_token' in request.cookies,
            'session_cookie_value': request.cookies.get('flordegrace_session', 'Not found')[:50] + '...',
        }
    }
    
    if current_user.is_authenticated:
        result['status'] = 'AUTHENTICATED'
        result['message'] = f'User {current_user.email} is authenticated'
    else:
        result['status'] = 'NOT AUTHENTICATED'
        result['message'] = 'User is not authenticated'
    
    print(f"🔍 MANUAL AUTH CHECK - {request.method}")
    print(f"   Result: {result['status']}")
    print(f"   Session has _user_id: {'_user_id' in session}")
    print(f"   Current user: {getattr(current_user, 'email', 'None')}")
    
    return jsonify(result)

# Add this route to test if the issue is with your specific profile route
@app.route('/debug/profile-test', methods=['PUT'])
@login_required
def debug_profile_test():
    """Test PUT request with login_required (simplified profile)"""
    return jsonify({
        'success': True,
        'message': 'PUT request with @login_required works!',
        'user': current_user.email,
        'method': request.method
    })

@app.route('/debug/user')
def debug_user():
    """Debug route to check current user and session"""
    try:
        return jsonify({
            'authenticated': current_user.is_authenticated,
            'user': current_user.to_dict() if current_user.is_authenticated else None,
            'session_keys': list(session.keys()),
            'session_id': session.get('_id'),
            'user_id_in_session': session.get('_user_id'),
            'cookies': dict(request.cookies)
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'authenticated': False,
            'session_keys': list(session.keys())
        })

@app.route('/debug/session')
def debug_session():
    """Debug route to check session details"""
    return jsonify({
        'session_data': dict(session),
        'has_session_cookie': 'flordegrace_session' in request.cookies,
        'has_remember_token': 'flordegrace_remember_token' in request.cookies,
        'all_cookies': dict(request.cookies)
    })

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
        return jsonify({
            "message": "Database connection successful", 
            "result": [row[0] for row in result]
        }), 200
    except Exception as e:
        print("❌ Database connection failed:", str(e))
        return jsonify({
            "message": "Database connection failed", 
            "error": str(e)
        }), 500

# Run Flask App
if __name__ == '__main__':
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
    
    print("🚀 Application startup complete!")
    print(f"📁 Session directory: {session_dir}")
    print(f"🔐 Secret key configured: {'Yes' if app.secret_key else 'No'}")
    print(f"🍪 Session cookie name: {app.config['SESSION_COOKIE_NAME']}")
    print("✅ Flask App is running on http://127.0.0.1:5000")
    print("🔍 Debug URLs:")
    print("   - http://127.0.0.1:5000/debug/user")
    print("   - http://127.0.0.1:5000/debug/session")
    print("   - http://127.0.0.1:5000/api/auth/check")
    
    app.run(host='127.0.0.1', port=5000, debug=True)