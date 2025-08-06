from flask import jsonify, make_response
from models.inventory import Inventory
from app import db

# Service function to get all inventory
def get_inventory():
    # Add ordering to ensure the inventory is fetched in the correct order
    inventory_items = Inventory.query.order_by(Inventory.inventory_id).all()
    
    inventory_list = []
    total_quantity = 0  # Initialize total quantity

    for inventory in inventory_items:
        product = inventory.product
        
        # Get the inventory details and add product details
        inventory_dict = inventory.to_dict()

        # Include all relevant product details
        inventory_dict['product_name'] = product.name if product else "Unknown"
        inventory_dict['product_model'] = product.model if product else "Unknown"
        inventory_dict['product_brand'] = product.brand if product else "Unknown"
        inventory_dict['product_category'] = product.category if product else "Unknown"
        inventory_dict['product_type'] = product.product_type.name if product and product.product_type else None

        # Add the inventory's quantity to the total
        total_quantity += inventory.quantity

        inventory_list.append(inventory_dict)

    # Include total quantity in the response
    response_data = {
        "total_quantity": total_quantity,
        "inventory": inventory_list
    }

    return make_response(jsonify(response_data), 200)

# Service function to get notifications for low stock items
def get_notifications():
    inventory_items = Inventory.query.all()
    low_stock_items = []

    for inventory in inventory_items:
        product = inventory.product
        product_name = product.name if product else "Unknown"
        
        # Check for low stock or out-of-stock items
        if inventory.quantity == 0 or inventory.quantity < 20:
            low_stock_items.append({
                "product_name": product_name,
                "quantity": inventory.quantity,
                "status": "Out of Stock" if inventory.quantity == 0 else "Low Stock"
            })

    return low_stock_items