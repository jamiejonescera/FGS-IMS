from flask import jsonify, make_response
from models.products import Product, ProductType
from models.supplier import Supplier
from app import db
from psycopg2.errors import NumericValueOutOfRange
from sqlalchemy.exc import IntegrityError

# Service function to create a new product
def create_product(data):
    try:
        # Extract the necessary data
        name = data.get('name')
        if not name:
            return make_response(jsonify({'error': 'Product name is required'}), 400)

        category = data.get('category')
        if not category:
            return make_response(jsonify({'error': 'Product category is required'}), 400)

        product_type = data.get('product_type')
        if not product_type or product_type not in [item.value for item in ProductType]:
            return make_response(jsonify({'error': 'Invalid or missing product type'}), 400)

        # Check if the product already exists based on the unique name constraint
        existing_product = Product.query.filter_by(name=name).first()
        if existing_product:
            return make_response(jsonify({'error': 'Product with this name already exists'}), 400)

        # Optional: Get the optional brand and model values
        brand = data.get('brand')
        model = data.get('model')
        
        # Create a new product instance
        new_product = Product(
            name=name,
            category=category,
            product_type=product_type,
            brand=brand,
            model=model
        )

        # Save the new product to the database
        db.session.add(new_product)
        db.session.commit()

        # Prepare the response to return
        product_response = {
            'product_id': new_product.product_id,
            'name': new_product.name,
            'category': new_product.category,
            'product_type': new_product.product_type.value,
            'brand': new_product.brand,
            'model': new_product.model,
            'created_at': new_product.created_at.isoformat() if new_product.created_at else None,
            'updated_at': new_product.updated_at.isoformat() if new_product.updated_at else None
        }

        return make_response(jsonify({'message': 'Product created successfully', 'product': product_response}), 201)

    except IntegrityError as e:
        db.session.rollback()
        return make_response(jsonify({'error': 'Database integrity error. Please check the data provided.'}), 400)

    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({'error': str(e)}), 500)
    

# Service function to update product
def update_product(product_id, data):
    try:
        # Fetch the product by its ID
        product = Product.query.get(product_id)
        if not product:
            return make_response(jsonify({'error': 'Product not found'}), 404)

        # Extract fields from the input data
        name = data.get('name')
        category = data.get('category')
        product_type = data.get('product_type')
        brand = data.get('brand')
        model = data.get('model')

        # Check if no changes were made
        if (
            (name is None or product.name == name) and
            (category is None or product.category == category) and
            (product_type is None or product.product_type.value == product_type) and
            (brand is None or product.brand == brand) and
            (model is None or product.model == model)
        ):
            return make_response(jsonify({'message': 'No changes made to the product'}), 200)

        # Validate product type
        if product_type and product_type not in [item.value for item in ProductType]:
            return make_response(jsonify({'error': 'Invalid product type'}), 400)

        # Check if product with the same name already exists, excluding the current product
        if name:
            existing_product = Product.query.filter_by(name=name).first()
            if existing_product and existing_product.product_id != product_id:
                return make_response(jsonify({'error': 'Product with the same name already exists'}), 400)

        # Update fields based on provided data
        if name:
            product.name = name
        if category:
            product.category = category
        if product_type:
            product.product_type = ProductType(product_type)
        if brand:
            product.brand = brand
        if model:
            product.model = model

        # Commit the changes to the database
        db.session.commit()

        # Prepare the updated product response
        product_response = {
            'product_id': product.product_id,
            'name': product.name,
            'category': product.category,
            'product_type': product.product_type.value,
            'brand': product.brand,
            'model': product.model,
            'created_at': product.created_at.isoformat() if product.created_at else None,
            'updated_at': product.updated_at.isoformat() if product.updated_at else None
        }

        return make_response(jsonify({'message': 'Product updated successfully', 'product': product_response}), 200)

    except IntegrityError as e:
        db.session.rollback()
        return make_response(jsonify({'error': 'Database integrity error. Please check the data provided.'}), 400)

    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({'error': str(e)}), 500)

  
# Service function to delete a product by ID
def delete_product(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return make_response(jsonify({'error': 'Product not found'}), 404)

        db.session.delete(product)
        db.session.commit()

        return make_response(jsonify({'message': 'Product deleted successfully'}), 200)

    except IntegrityError as e:
        db.session.rollback()

        # Check if the exception is related to a foreign key constraint
        if "foreign key constraint" in str(e.orig).lower():
            return make_response(jsonify({'error': 'Cannot delete product: This product is associated with existing purchases.'}), 400)

        # Generic IntegrityError message
        return make_response(jsonify({'error': 'Failed to delete product due to related data purchase.'}), 400)

    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500)
    
    # Service function to get all products
def get_products():
    # Query all products and order them by product_id in ascending order
    products = Product.query.order_by(Product.product_id.asc()).all()
    products_list = []

    for product in products:
        product_dict = product.to_dict()
        products_list.append(product_dict)

    return make_response(jsonify(products_list), 200)


# Service function to get a single product by ID
def get_product_by_id(product_id):
    product = Product.query.get(product_id)

    if product:
        return make_response(jsonify(product.to_dict()), 200)

    return make_response(jsonify({'message': 'Product not found'}), 404)