from app import app
from flask import Blueprint, request
from services.departmentServices import get_departments, get_department_by_id, create_department, update_department, delete_department

department_bp = Blueprint('department', __name__, url_prefix='/api/department')

# Route to get all departments
@department_bp.route('/', methods=['GET'])
def fetch_departments():
    return get_departments()

# Route to get a department by id
@department_bp.route('/<int:id>', methods=['GET'])
def fetch_department(id):
    return get_department_by_id(id) 

# Route to create a new department
@department_bp.route('/create', methods=['POST'])
def create_new_department():
    data = request.json 
    return create_department(data) 

# Route to update an existing department
@department_bp.route('/update/<int:id>', methods=['PUT'])
def update_existing_department(id):
    data = request.json
    return update_department(id, data)

# Route to delete a department by id
@department_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_existing_department(id):
    return delete_department(id)
