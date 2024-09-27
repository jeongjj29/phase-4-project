# routes.py

from flask import Blueprint, jsonify, request
from models import Store
from config import db

api_bp = Blueprint('api', __name__)

@api_bp.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "Test Successful!"})

@api_bp.route('/api/stores', methods=['GET'])
def get_all_stores():
    stores = Store.query.all()
    return jsonify([store.to_dict() for store in stores])

@api_bp.route('/api/stores/create', methods=['POST', 'OPTIONS'])
def create_store():
    if request.method == 'OPTIONS':
        return jsonify({"status": "OK"}), 200

    data = request.get_json()
    if 'name' not in data or len(data['name']) < 3:
        return jsonify({"error": "Store name must be at least 3 characters long"}), 400
    
    new_store = Store(name=data['name'])
    db.session.add(new_store)
    db.session.commit()

    return jsonify(new_store.to_dict()), 201

from config import app
app.register_blueprint(api_bp)
