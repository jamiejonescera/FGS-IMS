from flask import jsonify, make_response
from models.purchase import PurchaseRequest, PurchaseRequestStatusEnum
from models.evaluate import Evaluation
from models.damage import DamagedItem, ReturnStatusEnum
from models.inventory import Inventory
from models.products import Product
from app import db

def evaluate_purchase_request(request_id, undamaged_quantity, damaged_quantity):
    try:
        # Fetch the purchase request by request_id
        purchase_request = PurchaseRequest.query.get(request_id)

        # Check if the purchase request exists
        if not purchase_request:
            return make_response(jsonify({'error': 'Purchase request not found'}), 404)

        unit_price = purchase_request.unit_price

        # Ensure that the sum of undamaged and damaged quantities matches the total request quantity
        total_quantity = undamaged_quantity + damaged_quantity
        if total_quantity != purchase_request.quantity:
            return make_response(jsonify({'error': 'Undamaged and damaged quantities must sum up to the total requested quantity'}), 400)

        # Evaluate based on damaged and undamaged quantities
        if damaged_quantity > 0:
            # Create an Evaluation entry (evaluating damaged and undamaged quantities)
            evaluation = Evaluation(
                request_id=request_id,
                undamaged_quantity=undamaged_quantity,
                damaged_quantity=damaged_quantity
            )
            db.session.add(evaluation)
            db.session.commit()  # Commit so evaluation_id is available

            # If there's damage, save the damaged products to DamagedItem
            damaged_item = DamagedItem(
                evaluation_id=evaluation.evaluation_id,
                product_id=purchase_request.product_id,
                quantity=damaged_quantity,
                return_status=ReturnStatusEnum.pending
            )
            db.session.add(damaged_item)

            # Update the PurchaseRequest status to "approved" (because some products are undamaged)
            purchase_request.status = PurchaseRequestStatusEnum.approved

        elif undamaged_quantity > 0:
            # If no damage, save only the undamaged quantity to Evaluation
            evaluation = Evaluation(
                request_id=request_id,
                undamaged_quantity=undamaged_quantity,
                damaged_quantity=0
            )
            db.session.add(evaluation)
            db.session.commit()
            
            # Update the PurchaseRequest status to "approved"
            purchase_request.status = PurchaseRequestStatusEnum.approved

        # Logic to add undamaged items to inventory
        if undamaged_quantity > 0:
            inventory_item = Inventory.query.filter_by(product_id=purchase_request.product_id).first()

            if inventory_item:
                # Update existing inventory item
                inventory_item.quantity += undamaged_quantity
                inventory_item.running_amount += undamaged_quantity * unit_price
            else:
                # Create a new inventory item
                inventory_item = Inventory(
                    product_id=purchase_request.product_id,
                    quantity=undamaged_quantity,
                    running_amount=undamaged_quantity * unit_price
                )
                db.session.add(inventory_item)

        # If all items are damaged, update the PurchaseRequest status to "rejected"
        if damaged_quantity == purchase_request.quantity:
            purchase_request.status = PurchaseRequestStatusEnum.rejected
            # Add logic to mark all damaged items as rejected or returned
            damaged_items = DamagedItem.query.filter_by(evaluation_id=evaluation.evaluation_id).all()
            for damaged_item in damaged_items:
                damaged_item.return_status = ReturnStatusEnum.rejected
                db.session.add(damaged_item)

        # Commit all changes to the database
        db.session.commit()

        # Prepare the response data
        response_data = {
            'evaluation_id': evaluation.evaluation_id if damaged_quantity > 0 or undamaged_quantity > 0 else None,
            'damaged_items': [{
                'damaged_item_id': damaged_item.damaged_item_id,
                'quantity': damaged_item.quantity,
                'return_status': damaged_item.return_status.value
            }] if damaged_quantity > 0 else [],
            'purchase_request_status': purchase_request.status.value
        }

        return make_response(jsonify({'message': 'Purchase request evaluated successfully', 'data': response_data}), 200)

    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({'error': str(e)}), 500)


    

# Service function to get all evaluations
def get_evaluations():
    evaluations = Evaluation.query.all() 
    evaluations_list = [evaluation.to_dict() for evaluation in evaluations]

    return make_response(jsonify(evaluations_list), 200)
