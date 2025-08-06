from flask import Blueprint, request, jsonify, url_for, session
from flask_login import login_user, logout_user, login_required, current_user
from flask_bcrypt import Bcrypt
from app import User, db
from config.email_config import send_password_reset_email, send_password_changed_notification
import re

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    return True, "Password is valid"

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password are required'}), 400
        
        if not validate_email(email):
            return jsonify({'success': False, 'message': 'Invalid email format'}), 400
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'success': False, 'message': 'Account is deactivated'}), 401
        
        # Check password
        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
        
        # Login user with remember=True for persistence
        login_user(user, remember=True)
        
        # Session debugging
        print(f"🔍 LOGIN DEBUG:")
        print(f"  - User logged in: {user.email}")
        print(f"  - Session ID: {session.get('_id')}")
        print(f"  - User ID in session: {session.get('_user_id')}")
        print(f"  - Current user authenticated: {current_user.is_authenticated}")
        print(f"  - Session keys: {list(session.keys())}")
        print(f"  - Request cookies: {dict(request.cookies)}")
        
        # Make session permanent
        session.permanent = True
        
        response = jsonify({
            'success': True,
            'message': 'Login successful',
            'user': user.to_dict()
        })
        
        # Set additional headers for debugging
        response.headers['X-Session-Debug'] = f"User-{user.id}-Logged-In"
        
        return response, 200
        
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        return jsonify({'success': False, 'message': f'Login failed: {str(e)}'}), 500

@auth_bp.route('/api/auth/register', methods=['POST'])
@login_required
def register():
    """Admin can register new users"""
    try:
        if not current_user.is_admin:
            return jsonify({'success': False, 'message': 'Admin access required'}), 403
        
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        is_admin = data.get('is_admin', False)
        
        # Validate required fields
        if not all([email, password, first_name, last_name]):
            return jsonify({'success': False, 'message': 'All fields are required'}), 400
        
        if not validate_email(email):
            return jsonify({'success': False, 'message': 'Invalid email format'}), 400
        
        # Validate password strength
        is_valid, password_message = validate_password(password)
        if not is_valid:
            return jsonify({'success': False, 'message': password_message}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'success': False, 'message': 'Email already exists'}), 400
        
        # Create new user
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(
            email=email,
            password=hashed_password,
            first_name=first_name,
            last_name=last_name,
            is_admin=is_admin
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User created successfully',
            'user': new_user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    """Send password reset email"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        email = data.get('email', '').lower().strip()
        
        if not email:
            return jsonify({'success': False, 'message': 'Email is required'}), 400
        
        if not validate_email(email):
            return jsonify({'success': False, 'message': 'Invalid email format'}), 400
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        if not user:
            # Don't reveal if email exists or not for security
            return jsonify({
                'success': True,
                'message': 'If the email exists, a password reset link has been sent'
            }), 200
        
        if not user.is_active:
            return jsonify({
                'success': True,
                'message': 'If the email exists, a password reset link has been sent'
            }), 200
        
        # Generate reset token
        reset_token = user.generate_reset_token()
        
        # Create reset URL - Updated to use correct frontend port
        reset_url = f"http://localhost:3002/reset-password?token={reset_token}&email={email}"
        
        # Send email
        if send_password_reset_email(user, reset_url):
            return jsonify({
                'success': True,
                'message': 'Password reset link has been sent to your email'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to send reset email. Please try again later.'
            }), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': f'Request failed: {str(e)}'}), 500

@auth_bp.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    """Reset password using token"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        email = data.get('email', '').lower().strip()
        token = data.get('token', '').strip()
        new_password = data.get('password', '')
        
        if not all([email, token, new_password]):
            return jsonify({'success': False, 'message': 'Email, token, and new password are required'}), 400
        
        # Validate password strength
        is_valid, password_message = validate_password(new_password)
        if not is_valid:
            return jsonify({'success': False, 'message': password_message}), 400
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'success': False, 'message': 'Invalid reset token'}), 400
        
        # Verify reset token
        if not user.verify_reset_token(token):
            return jsonify({'success': False, 'message': 'Invalid or expired reset token'}), 400
        
        # Update password
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        user.password = hashed_password
        user.clear_reset_token()
        
        db.session.commit()
        
        # Send confirmation email
        send_password_changed_notification(user)
        
        return jsonify({
            'success': True,
            'message': 'Password has been reset successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Password reset failed: {str(e)}'}), 500

@auth_bp.route('/api/auth/change-password', methods=['POST'])
@login_required
def change_password():
    """Change user password (requires current password)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        current_password = data.get('current_password', '')
        new_password = data.get('new_password', '')
        
        if not all([current_password, new_password]):
            return jsonify({'success': False, 'message': 'Current and new password are required'}), 400
        
        # Verify current password
        if not bcrypt.check_password_hash(current_user.password, current_password):
            return jsonify({'success': False, 'message': 'Current password is incorrect'}), 400
        
        # Validate new password strength
        is_valid, password_message = validate_password(new_password)
        if not is_valid:
            return jsonify({'success': False, 'message': password_message}), 400
        
        # Update password
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        current_user.password = hashed_password
        
        db.session.commit()
        
        # Send confirmation email
        send_password_changed_notification(current_user)
        
        return jsonify({
            'success': True,
            'message': 'Password changed successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Password change failed: {str(e)}'}), 500

@auth_bp.route('/api/auth/admin/reset-user-password', methods=['POST'])
@login_required
def admin_reset_user_password():
    """Admin can reset any user's password and send email"""
    try:
        if not current_user.is_admin:
            return jsonify({'success': False, 'message': 'Admin access required'}), 403
        
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        user_email = data.get('email', '').lower().strip()
        
        if not user_email:
            return jsonify({'success': False, 'message': 'User email is required'}), 400
        
        # Find user
        user = User.query.filter_by(email=user_email).first()
        
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        # Generate reset token
        reset_token = user.generate_reset_token()
        
        # Create reset URL - Updated to use correct frontend port
        reset_url = f"http://localhost:3002/reset-password?token={reset_token}&email={user_email}"
        
        # Send email
        if send_password_reset_email(user, reset_url):
            return jsonify({
                'success': True,
                'message': f'Password reset link has been sent to {user.first_name} {user.last_name} ({user_email})'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to send reset email'
            }), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': f'Request failed: {str(e)}'}), 500

# ============================================
# FIXED PROFILE ROUTE WITH EMAIL SUPPORT
# ============================================
@auth_bp.route('/api/auth/profile', methods=['GET', 'PUT'])
@login_required
def profile():
    """Get or update user profile"""
    try:
        print(f"🔍 Profile route accessed by user: {current_user.email if current_user.is_authenticated else 'Anonymous'}")
        
        if request.method == 'GET':
            return jsonify({
                'success': True,
                'user': current_user.to_dict()
            }), 200
        
        elif request.method == 'PUT':
            data = request.get_json()
            print(f"🔍 Profile update data: {data}")
            
            if not data:
                return jsonify({'success': False, 'message': 'No data provided'}), 400
            
            first_name = data.get('first_name', '').strip()
            last_name = data.get('last_name', '').strip()
            email = data.get('email', '').strip().lower()  # ← ADDED EMAIL!
            
            # Validate required fields
            if not all([first_name, last_name, email]):  # ← UPDATED VALIDATION!
                return jsonify({'success': False, 'message': 'First name, last name, and email are required'}), 400
            
            # Validate email format
            if not validate_email(email):  # ← ADDED EMAIL VALIDATION!
                return jsonify({'success': False, 'message': 'Invalid email format'}), 400
            
            # Check if email already exists (for different user)
            existing_user = User.query.filter_by(email=email).first()
            if existing_user and existing_user.id != current_user.id:  # ← PREVENT EMAIL CONFLICTS!
                return jsonify({'success': False, 'message': 'Email address is already in use'}), 400
            
            # Update profile
            current_user.first_name = first_name
            current_user.last_name = last_name
            current_user.email = email  # ← ADDED EMAIL UPDATE!
            
            db.session.commit()
            print(f"✅ Profile updated successfully for {current_user.email}")
            
            return jsonify({
                'success': True,
                'message': 'Profile updated successfully',
                'user': current_user.to_dict()
            }), 200
            
    except Exception as e:
        print(f"❌ Profile route error: {str(e)}")
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Profile operation failed: {str(e)}'}), 500
    """Get or update user profile"""
    try:
        print(f"🔍 Profile route accessed by user: {current_user.email if current_user.is_authenticated else 'Anonymous'}")
        
        if request.method == 'GET':
            return jsonify({
                'success': True,
                'user': current_user.to_dict()
            }), 200
        
        elif request.method == 'PUT':
            data = request.get_json()
            print(f"🔍 Profile update data: {data}")
            
            if not data:
                return jsonify({'success': False, 'message': 'No data provided'}), 400
            
            first_name = data.get('first_name', '').strip()
            last_name = data.get('last_name', '').strip()
            
            if not all([first_name, last_name]):
                return jsonify({'success': False, 'message': 'First name and last name are required'}), 400
            
            # Update profile
            current_user.first_name = first_name
            current_user.last_name = last_name
            
            db.session.commit()
            print(f"✅ Profile updated successfully for {current_user.email}")
            
            return jsonify({
                'success': True,
                'message': 'Profile updated successfully',
                'user': current_user.to_dict()
            }), 200
            
    except Exception as e:
        print(f"❌ Profile route error: {str(e)}")
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Profile operation failed: {str(e)}'}), 500

@auth_bp.route('/api/auth/logout', methods=['POST'])
def logout():
    """User logout - No login_required to avoid redirect issues"""
    try:
        from flask import make_response
        
        user_email = current_user.email if current_user.is_authenticated else 'Anonymous'
        print(f"🔍 LOGOUT DEBUG:")
        print(f"  - User logging out: {user_email}")
        print(f"  - Session before logout: {dict(session)}")
        print(f"  - Cookies before logout: {dict(request.cookies)}")
        
        # Logout user if authenticated
        if current_user.is_authenticated:
            logout_user()
        
        # Clear session completely
        session.clear()
        session.permanent = False
        
        print(f"  - Session after logout: {dict(session)}")
        
        # Create response
        response = make_response(jsonify({
            'success': True,
            'message': 'Logged out successfully'
        }))
        
        # Nuclear cookie clearing - all possible cookie names and domains
        cookies_to_clear = [
            'flordegrace_session',
            'remember_token', 
            'flordegrace_remember_token',
            'my_session',
            'session'
        ]
        
        for cookie_name in cookies_to_clear:
            # Clear for different path and domain combinations
            response.set_cookie(cookie_name, '', expires=0, path='/', domain=None)
            response.set_cookie(cookie_name, '', expires=0, path='/', domain='localhost')
            response.set_cookie(cookie_name, '', expires=0, path='/', domain='.localhost')
            # Also try with max_age=0 for stubborn browsers
            response.set_cookie(cookie_name, '', max_age=0, path='/')
        
        print("🧨 All cookies nuked!")
        
        return response, 200
    except Exception as e:
        print(f"❌ Logout error: {str(e)}")
        return jsonify({'success': False, 'message': f'Logout failed: {str(e)}'}), 500

@auth_bp.route('/api/auth/check', methods=['GET'])
def check_auth():
    """Check if user is authenticated"""
    try:
        print(f"🔍 CHECK AUTH DEBUG:")
        print(f"  - Session ID: {session.get('_id')}")
        print(f"  - User ID in session: {session.get('_user_id')}")
        print(f"  - Session keys: {list(session.keys())}")
        print(f"  - Current user: {current_user}")
        print(f"  - Is authenticated: {current_user.is_authenticated}")
        print(f"  - Request cookies: {dict(request.cookies)}")
        
        if current_user.is_authenticated:
            print(f"✅ User IS authenticated: {current_user.email}")
            return jsonify({
                'success': True,
                'authenticated': True,
                'user': current_user.to_dict()
            }), 200
        else:
            print(f"❌ User NOT authenticated")
            return jsonify({
                'success': False,
                'authenticated': False,
                'message': 'Not authenticated'
            }), 401
    except Exception as e:
        print(f"💥 ERROR in check_auth: {str(e)}")
        return jsonify({'success': False, 'authenticated': False, 'message': str(e)}), 401