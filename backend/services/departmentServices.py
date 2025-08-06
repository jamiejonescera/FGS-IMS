from flask import request, jsonify, make_response
from models.department import DepartmentFacility
from app import db

# Get all departments
def get_departments():
    departments = DepartmentFacility.query.all()
    department_list = [department.to_dict() for department in departments]
    
    return make_response(jsonify(department_list), 200)

# Service function to get a single department by ID
def get_department_by_id(department_id):
    department = DepartmentFacility.query.get(department_id)
    
    if department:
        return make_response(jsonify(department.to_dict()), 200)
    
    return make_response(jsonify({'message': 'Department not found'}), 404)


 # Create a new department with error handling
def create_department(data):
    try:
        name = data.get('department_name')
        
        if not name:
            return jsonify({'error': 'Department name is required'}), 400

        existing_department = DepartmentFacility.query.filter_by(department_name=name).first()
        if existing_department:
            return jsonify({'error': 'Department already exists'}), 400
        
        new_department = DepartmentFacility(department_name=name)
        db.session.add(new_department)
        db.session.commit()
        
        department_response = {
            'department_id': new_department.department_id,
            'department_name': new_department.department_name,
            'created_at': new_department.created_at,
            'updated_at': new_department.updated_at
        }
        
        return jsonify({'message': 'Department created successfully', 'department': department_response}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    

# Update an existing department
def update_department(department_id, data):
    try:
        department = DepartmentFacility.query.get(department_id)
        
        if not department:
            return jsonify({'error': 'Department not found'}), 404

        name = data.get('department_name')
        
        if not name:
            return jsonify({'error': 'Department name is required'}), 400
        
        if department.department_name == name:
            return jsonify({'message': 'No changes made to the department.'}), 200
        
        existing_department = DepartmentFacility.query.filter_by(department_name=name).first()
        if existing_department and existing_department.department_id != department_id:
            return jsonify({'error': 'Department with this name already exists'}), 400
        
        department.department_name = name
        db.session.commit()
        
        department_response = {
            'department_id': department.department_id,
            'department_name': department.department_name,
            'created_at': department.created_at,
            'updated_at': department.updated_at
        }

        return jsonify({'message': 'Department updated successfully', 'department': department_response}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Delete an existing department
def delete_department(department_id):
    try:
        department = DepartmentFacility.query.get(department_id)
        
        if not department:
            return jsonify({'error': 'Department not found'}), 404
        
        db.session.delete(department)
        db.session.commit()

        return jsonify({'message': 'Department deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500