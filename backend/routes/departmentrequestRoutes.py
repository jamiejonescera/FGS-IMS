from flask import Blueprint, request
from services.departmentrequestServices import create_department_request, get_department_requests, get_top_purchases_per_department

# Define the Blueprint
departmentrequest_bp = Blueprint('departmentrequest', __name__, url_prefix='/api/department-request')

# Define the route for creating a new department request
@departmentrequest_bp.route('/create', methods=['POST'])
def handle_create_department_request():
    return create_department_request()

# Define the route for getting all department requests
@departmentrequest_bp.route('/', methods=['GET'])
def handle_get_department_requests():
    return get_department_requests()

# Define the route for getting top purchases per department
@departmentrequest_bp.route('/top-purchases', methods=['GET'])
def handle_get_top_purchases_per_department():
    return get_top_purchases_per_department()


# Define the route for undoing the creation of a department request
# @departmentrequest_bp.route('/undo/<int:request_id>', methods=['POST'])
# def handle_undo_create_department_request(request_id):
#     return undo_create_department_request(request_id)