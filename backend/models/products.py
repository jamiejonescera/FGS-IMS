from app import db
from datetime import datetime
import pytz
from enum import Enum

MANILA_TZ = pytz.timezone("Asia/Manila")

class ProductType(Enum):
    item = "item"
    asset = "asset"

class Product(db.Model):
    __tablename__ = 'products'

    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    product_type = db.Column(db.Enum(ProductType), nullable=False)
    brand = db.Column(db.String(100))
    model = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(MANILA_TZ))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(MANILA_TZ), onupdate=lambda: datetime.now(MANILA_TZ))

    # Add composite unique constraint
    __table_args__ = (
        db.UniqueConstraint('name', name='products_name_unique'),
    )

    def __repr__(self):
        return f"<Product {self.name}>"

    def to_dict(self):
        return {
            'product_id': self.product_id,
            'name': self.name,
            'category': self.category,
            'product_type': self.product_type.value,
            'brand': self.brand,
            'model': self.model,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
