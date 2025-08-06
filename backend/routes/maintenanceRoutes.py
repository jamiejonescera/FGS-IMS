from flask import Blueprint, request
from services.maintenanceServices import create_maintenance, get_maintenance, take_action, take_action_completed, take_action_condemned

# Create Blueprint for maintenance
maintenance_bp = Blueprint('maintenance', __name__, url_prefix='/api/maintenance')

# Route to create a new maintenance record
@maintenance_bp.route('/create', methods=['POST'])
def create_maintenance_route():
    data = request.json 
    return create_maintenance(data) 

@maintenance_bp.route('/take_action/<int:maintenance_id>', methods=['PUT'])
def take_action_route(maintenance_id):
    return take_action(maintenance_id)

@maintenance_bp.route('/take_action_completed/<int:maintenance_id>', methods=['PUT'])
def take_action_completed_route(maintenance_id):
    data = request.json
    return take_action_completed(maintenance_id, data)

@maintenance_bp.route('/take_action_condemned/<int:maintenance_id>', methods=['PUT'])
def take_action_condemned_route(maintenance_id):
    data = request.json
    return take_action_condemned(maintenance_id, data)

@maintenance_bp.route('/', methods=['GET'])
def get_maintenance_route():
    return get_maintenance()    