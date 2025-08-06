from flask import jsonify, make_response
from models.damage import DamagedItem
from models.inventory import Inventory
from app import db

# Service function to update a damaged item's status and inventory
def update_damage_status(damaged_item_id):
    try:
        # Fetch the damaged item by ID
        damaged_item = DamagedItem.query.get(damaged_item_id)
        if not damaged_item:
            return make_response(jsonify({"error": "Damaged item not found"}), 404)

        # Ensure the damaged item's status is not already replaced
        if damaged_item.return_status == "replaced":
            return make_response(jsonify({"error": "Damaged item already replaced"}), 400)

        # Fetch the related purchase request to get unit_price
        purchase_request = damaged_item.evaluation.purchase_request
        if not purchase_request:
            return make_response(jsonify({"error": "Purchase request not found"}), 404)

        unit_price = purchase_request.unit_price

        # Fetch the inventory record for the product
        inventory = Inventory.query.filter_by(product_id=damaged_item.product_id).first()
        if not inventory:
            return make_response(jsonify({"error": "Inventory record not found"}), 404)

        # Calculate the total amount for the damaged items
        total_amount = unit_price * damaged_item.quantity

        # Update inventory
        inventory.quantity += damaged_item.quantity
        inventory.running_amount += total_amount

        # Update the damaged item's status to replaced
        damaged_item.return_status = "replaced"

        # Commit the changes
        db.session.commit()

        return make_response(
            jsonify({
                "message": "Damaged item status updated and inventory adjusted",
                "updated_inventory": inventory.to_dict(),
                "updated_damage": damaged_item.to_dict(),
            }),
            200
        )
    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({"error": str(e)}), 500)


def get_damages():
    damaged_items = DamagedItem.query.all()
    damaged_items_list = [damaged_item.to_dict() for damaged_item in damaged_items]
    total_damages = len(damaged_items)

    pending_damages = DamagedItem.query.filter_by(return_status='pending').all()
    total_pending_damages = len(pending_damages)

    # Prepare the response data
    response_data = {
        "total_damages": total_damages,
        "total_pending_damages": total_pending_damages,
        "damaged_items": damaged_items_list
    }

    return make_response(jsonify(response_data), 200)