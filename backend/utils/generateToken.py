import jwt
import os
from datetime import datetime, timedelta

def generate_token(user_id):
    expiration_time = timedelta(hours=1) 
    expiration = datetime.utcnow() + expiration_time

    token = jwt.encode(
        {'user_id': user_id, 'exp': expiration},
        os.getenv('SECRET_KEY'),
        algorithm='HS256'
    )
    return token

def set_jwt_cookie(response, token):
    response.set_cookie(
        'jwt_token',
        token, 
        max_age=3600,
        httponly=True,
        secure=True,
        samesite='Strict'  
    )
    return response
