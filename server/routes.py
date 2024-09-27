# routes.py

from flask import Blueprint, jsonify, request
from models import Store, Item, ItemPrice
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

@api_bp.route('/api/items', methods=['GET'])
def get_all_items():
    items = Item.query.all()
    return jsonify([item.to_dict() for item in items])

# Create an item
@api_bp.route('/api/items/create', methods=['POST', 'OPTIONS'])
def create_item():
    if request.method == 'OPTIONS':
        return jsonify({"status": "OK"}), 200

    data = request.get_json()
    if 'name' not in data or len(data['name']) < 3:
        return jsonify({"error": "Item name must be at least 3 characters long"}), 400

    new_item = Item(name=data['name'])
    db.session.add(new_item)
    db.session.commit()

    return jsonify(new_item.to_dict()), 201

@api_bp.route('/api/item_prices', methods=['GET'])
def get_all_item_prices():
    item_prices = ItemPrice.query.all()
    return jsonify([{
        'id': ip.id,
        'price': ip.price,
        'store': ip.store.name,
        'item': ip.item.name,
        'created_at': ip.created_at,
        'updated_at': ip.updated_at
    } for ip in item_prices])

@api_bp.route('/api/item_prices/create', methods=['POST', 'OPTIONS'])
def create_item_price():
    if request.method == 'OPTIONS':
        return jsonify({"status": "OK"}), 200

    data = request.get_json()

    if 'price' not in data or 'store_id' not in data or 'item_id' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    new_item_price = ItemPrice(
        price=data['price'],
        store_id=data['store_id'],
        item_id=data['item_id']
    )

    db.session.add(new_item_price)
    db.session.commit()

    return jsonify(new_item_price.to_dict()), 201

from config import app
app.register_blueprint(api_bp)
