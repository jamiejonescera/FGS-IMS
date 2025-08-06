from flask import request, jsonify, make_response
from models.departmentrequest import DepartmentRequest
from models.inventory import Inventory
from models.department import DepartmentFacility
from models.products import Product
from app import db
from datetime import datetime
from sqlalchemy import func

def create_department_request():
    try:
        # Parse the incoming data
        data = request.get_json()
        department_id = data.get('department_id')
        product_id = data.get('product_id')
        quantity = data.get('quantity')

        if not (department_id and product_id and quantity):
            return make_response(jsonify({"error": "Missing required fields"}), 400)

        # Fetch the inventory record
        inventory = Inventory.query.filter_by(product_id=product_id).first()

        if not inventory:
            return make_response(jsonify({"error": f"No inventory record found for product_id {product_id}"}), 404)

        if inventory.quantity < quantity:
            return make_response(jsonify({"error": "Insufficient inventory"}), 400)

        # Create the new department request
        new_request = DepartmentRequest(
            department_id=department_id,
            product_id=product_id,
            quantity=quantity,
            request_date=datetime.now()
        )

        # Decrease the inventory
        inventory.quantity -= quantity
        inventory.updated_at = datetime.now()

        # Add the new request and update the inventory in the database
        db.session.add(new_request)
        db.session.add(inventory)
        db.session.commit()

        return make_response(jsonify(new_request.to_dict()), 201)

    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({"error": str(e)}), 500)

    finally:
        db.session.remove()

# Get all department requests
def get_department_requests():
    # Fetch all department requests from the database
    department_requests = DepartmentRequest.query.all()
    department_request_list = [request.to_dict() for request in department_requests]
    return make_response(jsonify(department_request_list), 200)

def get_top_purchases_per_department():
    try:
        # Query to aggregate and fetch top 10 purchases per department
        top_purchases = db.session.query(
            DepartmentFacility.department_name,
            Product.name.label('product_name'),
            func.sum(DepartmentRequest.quantity).label('total_purchases')
        ).join(DepartmentRequest, DepartmentFacility.department_id == DepartmentRequest.department_id
        ).join(Product, DepartmentRequest.product_id == Product.product_id
        ).group_by(DepartmentFacility.department_name, Product.name
        ).order_by(DepartmentFacility.department_name, func.sum(DepartmentRequest.quantity).desc()
        ).limit(5).all()  # Limit the results to top 10

        # Convert the query result to a list of dictionaries
        top_purchases_list = [
            {
                'department_name': purchase.department_name,
                'product_name': purchase.product_name,
                'total_purchases': purchase.total_purchases
            }
            for purchase in top_purchases
        ]

        return make_response(jsonify(top_purchases_list), 200)

    except Exception as e:
        return make_response(jsonify({"error": str(e)}), 500)

# Function to undo the creation of a department request
# def undo_create_department_request(request_id):
#     try:
#         # Find the request to be undone
#         department_request = DepartmentRequest.query.get(request_id)

#         if not department_request:
#             return make_response(jsonify({"error": f"Department request with id {request_id} not found"}), 404)

#         # Fetch the inventory record
#         inventory = Inventory.query.filter_by(product_id=department_request.product_id).first()

#         if inventory:
#             # Restore the inventory quantity
#             inventory.quantity += department_request.quantity
#             inventory.updated_at = datetime.now()

#             # Remove the department request
#             db.session.delete(department_request)
#             db.session.add(inventory)  # Ensure inventory change is added to the session
#             db.session.commit()

#             return make_response(jsonify({"message": f"Department request with id {request_id} has been undone"}), 200)
#         else:
#             return make_response(jsonify({"error": f"No inventory record found for product_id {department_request.product_id}"}), 404)

#     except Exception as e:
#         db.session.rollback()
#         return make_response(jsonify({"error": str(e)}), 500)

#     finally:
#         db.session.remove()
