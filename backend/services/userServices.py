from flask import request, jsonify
from models.items import Item

# Get all items
def get_items():
    items = Item.query.all()
    return jsonify([item.to_dict() for item in items])
