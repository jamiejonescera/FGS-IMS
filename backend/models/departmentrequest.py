from app import db
from datetime import datetime

class DepartmentRequest(db.Model):
    __tablename__ = 'department_requests'

    department_request_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    department_id = db.Column(db.Integer, db.ForeignKey('department_facility.department_id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    request_date = db.Column(db.DateTime, default=datetime.now)

    # Relationships
    department = db.relationship('DepartmentFacility', backref='department_requests', lazy=True)
    product = db.relationship('Product', backref='department_requests', lazy=True)

    def __repr__(self):
        return f"<DepartmentRequest {self.department_request_id}>"

    def to_dict(self):
        return {
            'department_request_id': self.department_request_id,
            'department_id': self.department_id,
            'department_name': self.department.department_name if self.department else None,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else None,
            'product_model': self.product.model if self.product else None,
            'product_brand': self.product.brand if self.product else None,
            'quantity': self.quantity,
            'request_date': self.request_date,
        }
