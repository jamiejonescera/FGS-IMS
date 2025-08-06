from app import db
from datetime import datetime
import pytz
from enum import Enum
from sqlalchemy import event

# Set Manila timezone
MANILA_TZ = pytz.timezone("Asia/Manila")

class PurchaseRequestStatusEnum(Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class PurchaseRequest(db.Model):
    __tablename__ = 'purchase_requests'

    request_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.supplier_id'), nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Enum(PurchaseRequestStatusEnum), default=PurchaseRequestStatusEnum.pending, nullable=False)
    request_date = db.Column(db.DateTime, default=lambda: datetime.now(MANILA_TZ))
    total_amount = db.Column(db.Numeric(10, 2))

    # Relationships
    product = db.relationship('Product', backref='purchase_requests')
    supplier = db.relationship('Supplier', backref='purchase_requests')

    def __repr__(self):
        return f"<PurchaseRequest {self.request_id}>"

    def to_dict(self):
        return {
            'request_id': self.request_id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else None,
            'brand': self.product.brand if self.product else None,
            'model': self.product.model if self.product else None,
            'supplier_id': self.supplier_id,
            'supplier_name': self.supplier.supplier_name if self.supplier else None,
            'unit_price': str(self.unit_price) if self.unit_price else '0.00',
            'quantity': self.quantity,
            'status': self.status.value,
            'request_date': self.request_date.isoformat() if self.request_date else None,
            'total_amount': str(self.total_amount) if self.total_amount else '0.00'
        }

# Automatically calculate total_amount before insert or update
@event.listens_for(PurchaseRequest, "before_insert")
def calculate_total_amount_before_insert(mapper, connection, target):
    """
    Automatically calculate total_amount before inserting the record.
    """
    if target.unit_price is not None and target.quantity is not None:
        target.total_amount = target.unit_price * target.quantity
    else:
        target.total_amount = 0

@event.listens_for(PurchaseRequest, "before_update")
def calculate_total_amount_before_update(mapper, connection, target):
    """
    Automatically calculate total_amount before updating the record.
    """
    if target.unit_price is not None and target.quantity is not None:
        target.total_amount = target.unit_price * target.quantity
    else:
        target.total_amount = 0
