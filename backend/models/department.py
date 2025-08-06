from app import db
from datetime import datetime
import pytz

# Set Manila timezone
MANILA_TZ = pytz.timezone("Asia/Manila")

class DepartmentFacility(db.Model):
    __tablename__ = 'department_facility'

    department_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    department_name = db.Column(db.String(100), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(MANILA_TZ))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(MANILA_TZ), onupdate=lambda: datetime.now(MANILA_TZ))

    def __repr__(self):
        return f"<DepartmentFacility {self.department_name}>"

    def to_dict(self):
        return {
            'department_id': self.department_id,
            'department_name': self.department_name,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
