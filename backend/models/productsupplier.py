from app import db
from datetime import datetime
import pytz
from enum import Enum

MANILA_TZ = pytz.timezone("Asia/Manila")

# Enum for Status
class Status(Enum):
    active = "active"
    inactive = "inactive"

class ProductSupplier(db.Model):
    __tablename__ = 'product_suppliers'

    product_supplier_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.supplier_id'), nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.Enum(Status), default=Status.active, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(MANILA_TZ))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(MANILA_TZ), onupdate=lambda: datetime.now(MANILA_TZ))

    # Relationships
    product = db.relationship('Product', backref='product_suppliers')
    supplier = db.relationship('Supplier', backref='product_suppliers')

    # Unique Constraint (product_id and supplier_id must be unique together)
    __table_args__ = (
        db.UniqueConstraint('product_id', 'supplier_id', name='product_supplier_unique'),
    )

    def __repr__(self):
        return f"<ProductSupplier Product: {self.product_id}, Supplier: {self.supplier_id}, Price: {self.unit_price}>"

    # Correctly indented to be a method of ProductSupplier class
    def to_dict(self):
        return {
            'product_supplier_id': self.product_supplier_id,
            'product_id': self.product_id,
            'supplier_id': self.supplier_id,
            'unit_price': str(self.unit_price),
            'status': self.status.value,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'product': {
                'product_id': self.product.product_id if self.product else None,
                'name': self.product.name if self.product else None,
                'category': self.product.category if self.product else None,
                'product_type': self.product.product_type.value if self.product and self.product.product_type else None,
                'brand': self.product.brand if self.product else None,
                'model': self.product.model if self.product else None
            },
            'supplier': {
                'supplier_id': self.supplier.supplier_id if self.supplier else None,
                'supplier_name': self.supplier.supplier_name if self.supplier else None
            }
        }
