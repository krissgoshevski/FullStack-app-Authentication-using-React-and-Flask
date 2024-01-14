import json
from flask import Flask, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from datetime import datetime, timedelta, timezone
from models import db, User
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS

api = Flask(__name__)

api.config['SECRET_KEY'] = 'secret-key'
api.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://'
api.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(api)
SQLALCHEMY_TRACT_MODIFICATION = False
SQLALCHEMY_ECHO = True

bcrypt = Bcrypt(api)
db.init_app(api)
migrate = Migrate(api, db)
CORS(api, supports_credentials=True)

with api.app_context():
    db.create_all()

@api.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        desc = data.get('description')

        if not name or not email or not password:
            return jsonify({'error': 'Name, email, and password are required'}), 400

        # Basic email format validation
        if '@' not in email or '.' not in email.split('@')[1]:
            return jsonify({'error': 'Invalid email format'}), 400

        user_exists = User.query.filter_by(email=email).first() is not None

        if user_exists:
            return jsonify({'error': 'Email already exists'}), 409



        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        new_user = User(name=name, email=email, password=hashed_password, description=desc)
        db.session.add(new_user)
        db.session.commit()

        token = create_access_token(identity=email)

        return jsonify({
                      'status': 'success',
                      'message': 'User registered successfully',
                      'user': {
                          'id': new_user.id,
                          'name': new_user.name,
                          'email': new_user.email},
                      'token': token
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500





@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', None)
    password = data.get('password', None)

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    # Check if the user exists
    user = User.query.filter_by(email=email).first()

    print(request.headers)

    if user:
        if bcrypt.check_password_hash(user.password, password):
            token = create_access_token(identity=email)
            return jsonify({
                'status': 'success',
                'message': 'The user logged in successfully',
                'user': {'id': user.id, 'email': user.email},
                'token': token
            }), 200
        else:
            return jsonify({'error': 'Password mismatch'}), 401
    else:
        return jsonify({'error': 'User not found'}), 404


@api.route('/logout', methods=['POST'])
def logout():
    resp = jsonify({
        'msg': 'Logged Out succesfullyyy'
    })

    unset_jwt_cookies(resp)

    return resp


@api.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["token"] = token
                response.data = json.dumps(data).encode("utf-8")
    except (RuntimeError, KeyError):
        # If it's not a valid JWT, just return the original response
        pass

    return response



# samo za userot so e najaven
@api.route('/user/details/<email>')
@jwt_required()
def show(email):
    print(email)
    if not email:
        return jsonify({
            'error': 'Unathorized access'
        }), 401

    user = User.query.filter_by(email=email).first()

    response = {
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'description': user.description
    }

    return response




if __name__ == '__main__':
    api.run(debug=True)

