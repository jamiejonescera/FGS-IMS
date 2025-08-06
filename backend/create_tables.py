from app import app, db
from sqlalchemy import text
from models.users import User
from models.supplier import Supplier
from models.department import DepartmentFacility
from models.products import Product
from models.productsupplier import ProductSupplier
from models.purchase import PurchaseRequest
from models.evaluate import Evaluation
from models.damage import DamagedItem
from models.inventory import Inventory
from models.maintenance import Maintenance
from models.departmentrequest import DepartmentRequest
import os

# # Create the tables and define triggers
# with app.app_context():
#     try:
#         db.drop_all()
#         db.create_all()

#         print("Tables successfully.")
#     except Exception as e:
#         print(f"An error occurred while setting up the database: {e}")


# Create the tables and define triggers
with app.app_context():
    try:
        # Drop and recreate tables
        db.drop_all()
        db.create_all()

        print("Tables created successfully.")
    except Exception as e:
        print(f"An error occurred while setting up the database: {e}")