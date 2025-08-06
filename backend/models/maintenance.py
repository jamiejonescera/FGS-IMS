from app import db
from datetime import datetime
import pytz
from enum import Enum

MANILA_TZ = pytz.timezone("Asia/Manila")

class MaintenanceStatus(Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    condemned = "condemned"

class Maintenance(db.Model):
    __tablename__ = 'maintenance'

    maintenance_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    description = db.Column(db.Text)
    engineer_name = db.Column(db.String(100), nullable=False)
    scheduled_date = db.Column(db.DateTime(timezone=True))
    completed_date = db.Column(db.DateTime(timezone=True))
    status = db.Column(db.Enum(MaintenanceStatus), nullable=False, default=MaintenanceStatus.pending)
    # total_cost = db.Column(db.Numeric(10, 2))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(MANILA_TZ))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(MANILA_TZ), onupdate=lambda: datetime.now(MANILA_TZ))

    # Relationships
    product = db.relationship('Product', backref=db.backref('maintenance', lazy=True))

    def __repr__(self):
        return f"<Maintenance {self.maintenance_id} - {self.engineer_name}>"

    def to_dict(self):
        # Fetch product details from the related Product model
        product = self.product

        return {
            'maintenance_id': self.maintenance_id,
            'product_id': self.product_id,
            'product_name': product.name if product else None,
            'brand': product.brand if product else None,
            'model': product.model if product else None,
            'description': self.description,
            'engineer_name': self.engineer_name,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'completed_date': self.completed_date.isoformat() if self.completed_date else None,
            'status': self.status.value,
            # 'total_cost': str(self.total_cost) if self.total_cost else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
