from app import db
from datetime import datetime
import pytz
import enum

MANILA_TZ = pytz.timezone("Asia/Manila")

# Define an Enum for status
class SupplierStatus(enum.Enum):
    active = "active"
    inactive = "inactive"

class Supplier(db.Model):
    __tablename__ = 'suppliers'

    supplier_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    supplier_name = db.Column(db.String(100), nullable=False, unique=True)
    address = db.Column(db.Text)
    contact_number = db.Column(db.String(11))
    status = db.Column(db.Enum(SupplierStatus), default=SupplierStatus.active, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(MANILA_TZ))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(MANILA_TZ), onupdate=lambda: datetime.now(MANILA_TZ))

    def __repr__(self):
        return f"<Supplier {self.supplier_name}, Status: {self.status.name}>"

    def to_dict(self):
        return {
            'supplier_id': self.supplier_id,
            'supplier_name': self.supplier_name,
            'address': self.address,
            'contact_number': self.contact_number,
            'status': self.status.value,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
