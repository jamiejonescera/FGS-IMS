from app import app
from extensions import db
from sqlalchemy import text
import os

# Don't call db.init_app(app) here - app.py already did it!

# Create the tables and define triggers
with app.app_context():
    try:
        # Import User model (now using standard import since we fixed the model)
        from models.users import User
        
        # Import other models
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

        # Force drop everything with CASCADE to handle dependent objects
        print("🗑️ Force dropping all tables and dependent objects...")
        with db.engine.connect() as conn:
            conn.execute(text("DROP SCHEMA public CASCADE"))
            conn.execute(text("CREATE SCHEMA public"))
            conn.execute(text("GRANT ALL ON SCHEMA public TO postgres"))
            conn.execute(text("GRANT ALL ON SCHEMA public TO public"))
            conn.commit()
        
        print("🔨 Creating new tables...")
        db.create_all()

        print("✅ Tables created successfully!")
        print("📋 Created tables for:")
        print("   - Users")
        print("   - Suppliers") 
        print("   - Departments")
        print("   - Products")
        print("   - Product Suppliers")
        print("   - Purchase Requests")
        print("   - Evaluations")
        print("   - Damaged Items")
        print("   - Inventory")
        print("   - Maintenance")
        print("   - Department Requests")
        
    except Exception as e:
        print(f"❌ An error occurred while setting up the database: {e}")
        import traceback
        traceback.print_exc()