from flask import jsonify, make_response
from models.productsupplier import ProductSupplier, Status
from models.supplier import Supplier
from models.products import Product
from app import db
from psycopg2.errors import NumericValueOutOfRange


def get_product_suppliers():
   product_suppliers = ProductSupplier.query.all()
   product_suppliers_list = [product_supplier.to_dict() for product_supplier in product_suppliers]
   return make_response(jsonify(product_suppliers_list), 200)


def create_product_supplier(data):
    try:
        # Extract data from the request
        product_id = data.get('product_id')
        supplier_id = data.get('supplier_id')
        unit_price = data.get('unit_price')
        status = data.get('status', Status.active.value)

        # Validate input data
        if not product_id:
            return make_response(jsonify({'error': 'Product is required'}), 400)
        
        if not supplier_id:
            return make_response(jsonify({'error': 'Supplier is required'}), 400)

        if unit_price is None or unit_price <= 0:
            return make_response(jsonify({'error': 'Unit price must be greater than 0'}), 400)

        # Check if product exists
        product = Product.query.get(product_id)
        if not product:
            return make_response(jsonify({'error': 'Product not found'}), 404)

        # Check if the supplier exists by ID
        supplier = Supplier.query.get(supplier_id)
        if not supplier:
            return make_response(jsonify({'error': 'Supplier not found'}), 404)

        # Check if the same product-supplier pair already exists
        existing_product_supplier = ProductSupplier.query.filter_by(product_id=product_id, supplier_id=supplier_id).first()
        if existing_product_supplier:
            return make_response(jsonify({'error': 'This product is already associated with this supplier'}), 400)

        # Create a new ProductSupplier entry
        new_product_supplier = ProductSupplier(
            product_id=product_id,
            supplier_id=supplier_id,
            unit_price=unit_price,
            status=Status(status)
        )

        db.session.add(new_product_supplier)
        db.session.commit()

        # Prepare response data
        product_supplier_response = new_product_supplier.to_dict()

        return make_response(jsonify({'message': 'Product Supplier created successfully', 'product_supplier': product_supplier_response}), 201)

    except NumericValueOutOfRange as e:
        db.session.rollback()
        return make_response(jsonify({'error': 'Unit price is out of range. Ensure it is within the allowed limits.'}), 400)

    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({'error': str(e)}), 500)


def update_product_supplier(product_supplier_id, data):
    try:
        # Extract data from the request
        product_id = data.get('product_id')
        supplier_id = data.get('supplier_id')
        unit_price = data.get('unit_price')
        status = data.get('status', Status.active.value)

        # Convert unit_price to Decimal for consistent comparison
        import decimal
        if unit_price is not None:
            unit_price = decimal.Decimal(str(unit_price))

        # Validate input data
        if not product_id:
            return make_response(jsonify({'error': 'Product ID is required'}), 400)
        
        if not supplier_id:
            return make_response(jsonify({'error': 'Supplier ID is required'}), 400)
        
        if unit_price is None or unit_price <= 0:
            return make_response(jsonify({'error': 'Unit price must be greater than 0'}), 400)

        # Check if the product-supplier entry exists
        product_supplier = ProductSupplier.query.get(product_supplier_id)
        if not product_supplier:
            return make_response(jsonify({'error': 'Product Supplier not found'}), 404)

        # Check if the supplier exists by ID
        supplier = Supplier.query.get(supplier_id)
        if not supplier:
            return make_response(jsonify({'error': 'Supplier not found'}), 404)

        # Detect if any changes are being made
        changes_made = (
            product_supplier.product_id != product_id or
            product_supplier.supplier_id != supplier_id or
            product_supplier.unit_price != unit_price or
            product_supplier.status.value != status
        )

        # If no changes, return early
        if not changes_made:
            return make_response(jsonify({'message': 'No changes made to the Product Supplier'}), 200)

        # Check if the same product-supplier pair already exists (no need to insert duplicate data)
        existing_product_supplier = ProductSupplier.query.filter_by(
            product_id=product_id, 
            supplier_id=supplier_id
        ).first()
        if existing_product_supplier and existing_product_supplier.product_supplier_id != product_supplier_id:
            return make_response(jsonify({'error': 'This product is already associated with this supplier'}), 400)

        # Update the product supplier details
        product_supplier.product_id = product_id
        product_supplier.supplier_id = supplier_id
        product_supplier.unit_price = unit_price
        product_supplier.status = Status(status)

        # Commit the changes to the database
        db.session.commit()

        # Prepare response data
        product_supplier_response = product_supplier.to_dict()

        return make_response(jsonify({
            'message': 'Product Supplier updated successfully', 
            'product_supplier': product_supplier_response
        }), 200)

    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({'error': str(e)}), 500)
    
def toggle_product_supplier_status(product_supplier_id):
    try:
        product_supplier = ProductSupplier.query.get(product_supplier_id)
        if not product_supplier:
            return make_response(jsonify({'error': 'Product Supplier not found'}), 404)

        product_supplier.status = Status.inactive if product_supplier.status == Status.active else Status.active

        db.session.commit()

        product_supplier_response = product_supplier.to_dict()

        return make_response(jsonify({
            'message': 'Product Supplier status updated successfully', 
            'product_supplier': product_supplier_response
        }), 200)

    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({'error': str(e)}), 500)
    
def delete_product_supplier(product_supplier_id):
    try:
        product_supplier = ProductSupplier.query.get(product_supplier_id)
        if not product_supplier:
            return make_response(jsonify({'error': 'Product Supplier not found'}), 404)
        db.session.delete(product_supplier)
        db.session.commit()

        return make_response(jsonify({'message': 'Product Supplier deleted successfully'}), 200)

    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({'error': str(e)}), 500)
