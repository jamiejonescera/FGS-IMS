from flask import Blueprint, request
from services.damageServices import get_damages, update_damage_status

damage_bp = Blueprint('damages', __name__, url_prefix='/api/damages')

# Route to get all damages
@damage_bp.route('/', methods=['GET'])
def fetch_damages():
    return get_damages()

# Route to update damage item status to replaced
@damage_bp.route('/update/<int:damaged_item_id>', methods=['PUT'])
def update_status(damaged_item_id):
    try:
        if not damaged_item_id:
            return {"error": "Damaged item ID is required in the URL"}, 400

        return update_damage_status(damaged_item_id)
    except Exception as e:
        return {"error": f"An unexpected error occurred: {str(e)}"}, 500
