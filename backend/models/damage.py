from app import db
from datetime import datetime
from enum import Enum

class ReturnStatusEnum(Enum):
    pending = "pending"
    replaced = "replaced"
    rejected = "rejected"

class DamagedItem(db.Model):
    __tablename__ = 'damaged_items'

    damaged_item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    evaluation_id = db.Column(db.Integer, db.ForeignKey('evaluation.evaluation_id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    return_status = db.Column(db.Enum(ReturnStatusEnum), nullable=False, default=ReturnStatusEnum.pending)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    # Relationships
    evaluation = db.relationship('Evaluation', backref='damaged_items', lazy=True)
    product = db.relationship('Product', backref='damaged_items', lazy=True)

    def __repr__(self):
        return f"<DamagedItem {self.damaged_item_id}>"

    def to_dict(self):
        return {
            'damaged_item_id': self.damaged_item_id,
            'evaluation_id': self.evaluation_id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else None,
            'product_model': self.product.model if self.product else None,
            'product_brand': self.product.brand if self.product else None,
            'quantity': self.quantity,
            'return_status': self.return_status.value,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
