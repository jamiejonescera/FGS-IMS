from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from extensions import db
from models.users import User
from sqlalchemy import or_

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/api/admin/users', methods=['GET'])
@login_required
def get_all_users():
    """Get all users (admin only)"""
    try:
        if not current_user.is_admin:
            return jsonify({'success': False, 'message': 'Admin access required'}), 403
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '', type=str)
        
        # Build query
        query = User.query
        
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    User.email.ilike(search_filter),
                    User.first_name.ilike(search_filter),
                    User.last_name.ilike(search_filter)
                )
            )
        
        # Paginate results
        users = query.order_by(User.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'users': [user.to_dict() for user in users.items],
            'pagination': {
                'page': users.page,
                'pages': users.pages,
                'per_page': users.per_page,
                'total': users.total,
                'has_next': users.has_next,
                'has_prev': users.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Failed to fetch users: {str(e)}'}), 500

@admin_bp.route('/api/admin/users/<int:user_id>', methods=['GET'])
@login_required
def get_user(user_id):
    """Get specific user by ID (admin only)"""
    try:
        if not current_user.is_admin:
            return jsonify({'success': False, 'message': 'Admin access required'}), 403
        
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        return jsonify({
            'success': True,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Failed to fetch user: {str(e)}'}), 500

@admin_bp.route('/api/admin/users/<int:user_id>', methods=['PUT'])
@login_required
def update_user(user_id):
    """Update user details (admin only)"""
    try:
        if not current_user.is_admin:
            return jsonify({'success': False, 'message': 'Admin access required'}), 403
        
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        # Update allowed fields
        if 'first_name' in data:
            user.first_name = data['first_name'].strip()
        
        if 'last_name' in data:
            user.last_name = data['last_name'].strip()
        
        if 'is_admin' in data:
            # Prevent removing admin status from yourself
            if user.id == current_user.id and not data['is_admin']:
                return jsonify({'success': False, 'message': 'Cannot remove admin status from yourself'}), 400
            user.is_admin = data['is_admin']
        
        if 'is_active' in data:
            # Prevent deactivating yourself
            if user.id == current_user.id and not data['is_active']:
                return jsonify({'success': False, 'message': 'Cannot deactivate yourself'}), 400
            user.is_active = data['is_active']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Failed to update user: {str(e)}'}), 500

@admin_bp.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    """Delete user (admin only)"""
    try:
        if not current_user.is_admin:
            return jsonify({'success': False, 'message': 'Admin access required'}), 403
        
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        # Prevent deleting yourself
        if user.id == current_user.id:
            return jsonify({'success': False, 'message': 'Cannot delete yourself'}), 400
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'User {user.full_name} deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Failed to delete user: {str(e)}'}), 500

@admin_bp.route('/api/admin/dashboard-stats', methods=['GET'])
@login_required
def dashboard_stats():
    """Get dashboard statistics (admin only)"""
    try:
        if not current_user.is_admin:
            return jsonify({'success': False, 'message': 'Admin access required'}), 403
        
        total_users = User.query.count()
        active_users = User.query.filter_by(is_active=True).count()
        admin_users = User.query.filter_by(is_admin=True).count()
        inactive_users = total_users - active_users
        
        return jsonify({
            'success': True,
            'stats': {
                'total_users': total_users,
                'active_users': active_users,
                'inactive_users': inactive_users,
                'admin_users': admin_users
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Failed to fetch stats: {str(e)}'}), 500
