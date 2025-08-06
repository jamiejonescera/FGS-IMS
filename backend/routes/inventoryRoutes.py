from flask import Blueprint, request, jsonify, make_response
from services.inventoryServices import get_inventory, get_notifications

# Create Blueprint for inventory
inventory_bp = Blueprint('inventory', __name__, url_prefix='/api/inventory')

# Route to get all inventory
@inventory_bp.route('/', methods=['GET'])
def fetch_inventory():
    return get_inventory() 

# Route to get notifications for low stock items
@inventory_bp.route('/notifications', methods=['GET'])
def fetch_notifications():
    notifications = get_notifications()
    return make_response(jsonify(notifications), 200)