# routes.py

from flask import Blueprint, jsonify
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

from config import app
app.register_blueprint(api_bp)
