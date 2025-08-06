from app import app
from flask import Blueprint, request
from services.productsupplierServices import create_product_supplier, update_product_supplier, get_product_suppliers, toggle_product_supplier_status, delete_product_supplier

product_supplier_bp = Blueprint('product-suppliers', __name__, url_prefix='/api/product-suppliers')

# Route to get all product supplier
@product_supplier_bp.route('/', methods=['GET'])
def fetch_products_supplier():
    return get_product_suppliers()


# Route to create a new product supplier
@product_supplier_bp.route('/create', methods=['POST'])
def create_new_product_supplier():
    data = request.json 
    return create_product_supplier(data)


# Route to update an existing product supplier
@product_supplier_bp.route('/update/<int:product_supplier_id>', methods=['PUT'])
def update_existing_product_supplier(product_supplier_id):
    data = request.json
    return update_product_supplier(product_supplier_id, data)


# Route to toggle the status of an existing product supplier
@product_supplier_bp.route('/toggle-status/<int:product_supplier_id>', methods=['PUT'])
def toggle_status_product_supplier(product_supplier_id):
    return toggle_product_supplier_status(product_supplier_id)

# Route to delete an existing product supplier
@product_supplier_bp.route('/delete/<int:product_supplier_id>', methods=['DELETE'])
def delete_product_supplier_route(product_supplier_id):
    return delete_product_supplier(product_supplier_id)
