from flask import request, jsonify, make_response
from models.purchase import PurchaseRequest, PurchaseRequestStatusEnum
from models.products import Product
from models.supplier import Supplier
from app import db
from sqlalchemy import func

# Service function to create a new purchase request
def create_purchase_request(data):
    try:
        product_id = data.get('product_id')
        supplier_id = data.get('supplier_id')
        unit_price = data.get('unit_price')
        quantity = data.get('quantity')

        # Validate input fields
        if not product_id:
            return make_response(jsonify({'error': 'Product ID is required'}), 400)

        if not supplier_id:
            return make_response(jsonify({'error': 'Supplier ID is required'}), 400)

        # Ensure unit_price and quantity are valid numbers
        try:
            unit_price = float(unit_price)  # Convert unit_price to float
        except ValueError:
            return make_response(jsonify({'error': 'Unit price must be a valid number'}), 400)

        try:
            quantity = int(quantity) 
        except ValueError:
            return make_response(jsonify({'error': 'Quantity must be a valid integer'}), 400)

        # Check if unit_price and quantity are greater than 0
        if unit_price <= 0:
            return make_response(jsonify({'error': 'Unit price must be greater than 0'}), 400)

        if quantity <= 0:
            return make_response(jsonify({'error': 'Quantity must be greater than 0'}), 400)

        # Check if product exists
        product = Product.query.filter_by(product_id=product_id).first()
        if not product:
            return make_response(jsonify({'error': 'Product not found'}), 404)

        # Check if supplier exists
        supplier = Supplier.query.filter_by(supplier_id=supplier_id).first()
        if not supplier:
            return make_response(jsonify({'error': 'Supplier not found'}), 404)

        # Create the purchase request
        new_request = PurchaseRequest(
            product_id=product_id,
            supplier_id=supplier_id,
            unit_price=unit_price,
            quantity=quantity
        )

        db.session.add(new_request)
        db.session.commit()

        # Response data
        request_response = {
            'request_id': new_request.request_id,
            'product_id': new_request.product_id,
            'product_name': product.name,
            'supplier_id': new_request.supplier_id,
            'supplier_name': supplier.supplier_name,
            'unit_price': str(new_request.unit_price),
            'quantity': new_request.quantity,
            'total_amount': str(new_request.total_amount),
            'status': new_request.status.value,
            'request_date': new_request.request_date.isoformat()
        }

        return make_response(jsonify({
            'message': 'Purchase request created successfully',
            'purchase_request': request_response
        }), 201)

    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({'error': str(e)}), 500)


# Service function to get all purchase requests
def get_purchase_requests():
    purchase_requests = PurchaseRequest.query.all()
    purchase_requests_list = [purchase_request.to_dict() for purchase_request in purchase_requests]

    return make_response(jsonify(purchase_requests_list), 200)


# # Service function to get 5 recent purchase requests
def get_recent_purchase_requests():
    recent_purchase_requests = PurchaseRequest.query.order_by(PurchaseRequest.request_id.desc()).limit(5).all()
    recent_purchase_requests_list = [purchase_request.to_dict() for purchase_request in recent_purchase_requests]

    return make_response(jsonify(recent_purchase_requests_list), 200)

    
# Delete an existing purchase request
def delete_purchase_request(request_id):
    try:
        purchase_request = PurchaseRequest.query.get(request_id)

        if not purchase_request:
            return jsonify({'error': 'Purchase request not found'}), 404

        db.session.delete(purchase_request)
        db.session.commit()

        return jsonify({'message': 'Purchase request cancelled successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Service function to get top 10 products based on the number of approved purchase requests
def get_top_10_products_by_approved_requests():
    try:
        # Query to get the top 10 products with the highest number of approved purchase requests
        top_10_products = db.session.query(
            PurchaseRequest.product_id,
            Product.name,
            func.count(PurchaseRequest.request_id).label('total_purchases')
        ).join(Product, PurchaseRequest.product_id == Product.product_id)\
        .filter(PurchaseRequest.status == PurchaseRequestStatusEnum.approved)\
        .group_by(PurchaseRequest.product_id, Product.name)\
        .order_by(func.count(PurchaseRequest.request_id).desc())\
        .limit(10).all()

        if not top_10_products:
            return make_response(jsonify({'message': 'No approved purchase requests found'}), 404)

        top_10_products_list = [
            {
                'product_id': product_id,
                'product_name': product_name,
                'total_purchases': total_purchases
            } for product_id, product_name, total_purchases in top_10_products
        ]

        return make_response(jsonify(top_10_products_list), 200)

    except Exception as e:
        return make_response(jsonify({'error': str(e)}), 500)