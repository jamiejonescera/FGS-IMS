import os  # Add this line to import the os module
from app import app  # Import the Flask app from your app.py file

# Set the SQLAlchemy database URI
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

if __name__ == "__main__":
    app.run()


