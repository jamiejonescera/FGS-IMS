from flask import Blueprint, request
from services.evaluateServices import evaluate_purchase_request, get_evaluations

# Create Blueprint for evaluation
evaluate_bp = Blueprint('evaluate', __name__, url_prefix='/api/evaluate')

@evaluate_bp.route('/create/<int:request_id>', methods=['POST'])
def evaluate_request(request_id):
    # Extract the data from the request body (undamaged_quantity, damaged_quantity)
    data = request.get_json()
    undamaged_quantity = data.get('undamaged_quantity')
    damaged_quantity = data.get('damaged_quantity')
    
    # Call the service function to evaluate the purchase request
    return evaluate_purchase_request(request_id, undamaged_quantity, damaged_quantity)

# Route to get all products
@evaluate_bp.route('/', methods=['GET'])
def fetch_evaluations():
    return get_evaluations()