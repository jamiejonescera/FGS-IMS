from app import app
from flask import Blueprint, request
from services.supplierServices import get_suppliers, get_supplier_by_id, create_supplier, update_supplier, delete_supplier

# Create Blueprint for suppliers
supplier_bp = Blueprint('supplier', __name__, url_prefix='/api/supplier')

# Route to get all suppliers
@supplier_bp.route('/', methods=['GET'])
def fetch_suppliers():
    return get_suppliers()

# Route to get a supplier by id
@supplier_bp.route('/<int:supplier_id>', methods=['GET'])
def fetch_supplier(supplier_id):
    return get_supplier_by_id(supplier_id)

# Route to create a new supplier
@supplier_bp.route('/create', methods=['POST'])
def create_new_supplier():
    data = request.json
    return create_supplier(data)

# Route to update supplier
@supplier_bp.route('/update/<int:supplier_id>', methods=['PUT'])
def update_existing_supplier(supplier_id):
    data = request.json
    return update_supplier(supplier_id, data)

# Route to delete a supplier
@supplier_bp.route('/delete/<int:supplier_id>', methods=['DELETE'])
def delete_existing_supplier(supplier_id):
    return delete_supplier(supplier_id)