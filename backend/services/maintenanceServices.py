from flask import jsonify, make_response
from models.maintenance import Maintenance, MaintenanceStatus
from models.products import Product
from app import db
from datetime import datetime
import pytz

MANILA_TZ = pytz.timezone("Asia/Manila")

def create_maintenance(data):
    try:
        # Extract data from the input dictionary
        product_id = data.get('product_id')
        description = data.get('description')
        engineer_name = data.get('engineer_name')
        scheduled_date = data.get('scheduled_date')
        # total_cost = data.get('total_cost')

        if not product_id or not engineer_name:
            return make_response(jsonify({"error": "Product ID and Engineer Name are required"}), 400)

        product = Product.query.get(product_id)
        if not product:
            return make_response(jsonify({"error": f"Product with ID {product_id} not found"}), 404)

        maintenance = Maintenance(
            product_id=product_id,
            description=description,
            engineer_name=engineer_name,
            scheduled_date=scheduled_date,
            # total_cost=total_cost
        )

        db.session.add(maintenance)
        db.session.commit()

        # Return the created maintenance as a dictionary (or JSON)
        return make_response(jsonify(maintenance.to_dict()), 201)

    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({"error": "Internal Server Error", "message": str(e)}), 500)
    

def take_action(maintenance_id):
    try:
        # Find the maintenance record by ID
        maintenance = Maintenance.query.get(maintenance_id)

        if not maintenance:
            return make_response(jsonify({"error": f"Maintenance with ID {maintenance_id} not found"}), 404)

        if maintenance.status != MaintenanceStatus.pending:
            return make_response(jsonify({"error": "Action not allowed. Maintenance status must be 'pending' to take action."}), 400)

        maintenance.status = MaintenanceStatus.in_progress
        db.session.commit()

        return make_response(jsonify(maintenance.to_dict()), 200)

    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({"error": "Internal Server Error", "message": str(e)}), 500)
    
def take_action_completed(maintenance_id, data):
    try:
        # Find the maintenance record by ID
        maintenance = Maintenance.query.get(maintenance_id)

        if not maintenance:
            return make_response(jsonify({"error": f"Maintenance with ID {maintenance_id} not found"}), 404)

        if maintenance.status != MaintenanceStatus.in_progress:
            return make_response(jsonify({"error": "Action not allowed. Maintenance status must be 'in_progress' to complete."}), 400)

        maintenance.status = MaintenanceStatus.completed
        maintenance.completed_date = datetime.now(MANILA_TZ)
        maintenance.notes = data.get('notes')

        db.session.commit()

        return make_response(jsonify(maintenance.to_dict()), 200)

    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({"error": "Internal Server Error", "message": str(e)}), 500)
    
def take_action_condemned(maintenance_id, data):
    try:
        # Find the maintenance record by ID
        maintenance = Maintenance.query.get(maintenance_id)

        if not maintenance:
            return make_response(jsonify({"error": f"Maintenance with ID {maintenance_id} not found"}), 404)

        if maintenance.status != MaintenanceStatus.in_progress:
            return make_response(jsonify({"error": "Action not allowed. Maintenance status must be 'in_progress' to mark as condemned."}), 400)

        maintenance.status = MaintenanceStatus.condemned
        maintenance.completed_date = datetime.now(MANILA_TZ)
        # Extract the notes as a plain string
        maintenance.notes = data.get('notes', '')

        db.session.commit()

        return make_response(jsonify(maintenance.to_dict()), 200)

    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({"error": "Internal Server Error", "message": str(e)}), 500)

def get_maintenance():
    try:
        # Fetch all maintenance records and sort by maintenance_id in ascending order
        maintenances = Maintenance.query.order_by(Maintenance.maintenance_id.asc()).all()
        maintenance_list = [maintenance.to_dict() for maintenance in maintenances]

        # Count the total number of condemned maintenance records
        total_condemned = Maintenance.query.filter_by(status=MaintenanceStatus.condemned).count()

        total_maintenance = len(maintenances)

        response_data = {
            "total_maintenance": total_maintenance,
            "total_condemned": total_condemned,
            "maintenances": maintenance_list
        }

        return make_response(jsonify(response_data), 200)

    except Exception as e:
        return make_response(jsonify({"error": "Internal Server Error", "message": str(e)}), 500)
