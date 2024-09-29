from sqlalchemy import func
from flask import Blueprint, jsonify, request
from models import Store, Item, ItemPrice, List
from config import db
from datetime import datetime

api_bp = Blueprint("api", __name__)


@api_bp.route("/api/test", methods=["GET"])
def test():
    return jsonify({"message": "Test Successful!"})


@api_bp.route("/api/stores", methods=["GET"])
def get_all_stores():
    stores = Store.query.all()
    return jsonify([store.to_dict() for store in stores])


@api_bp.route("/api/stores/<int:id>", methods=["GET", "DELETE"])
def get_store(id):
    if request.method == "GET":
        store = Store.query.get_or_404(id)
        return jsonify(store.to_dict())
    elif request.method == "DELETE":
        store = Store.query.get_or_404(id)
        db.session.delete(store)
        db.session.commit()
        return jsonify({}), 204


@api_bp.route("/api/stores/create", methods=["POST", "OPTIONS"])
def create_store():
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    data = request.get_json()
    if "name" not in data or len(data["name"]) < 3:
        return jsonify({"error": "Store name must be at least 3 characters long"}), 400

    new_store = Store(name=data["name"])
    db.session.add(new_store)
    db.session.commit()

    return jsonify(new_store.to_dict()), 201


@api_bp.route("/api/items", methods=["GET"])
def get_all_items():
    items = Item.query.all()
    return jsonify([item.to_dict() for item in items])


@api_bp.route('/api/items', methods=['POST'])
def create_item():
    data = request.get_json()
    new_item = Item.create(
        name=data.get('name'),
        image_url=data.get('image_url'),
        group=data.get('group'),
        form=data.get('form'),
        count=data.get('count'),
        department=data.get('department'),
        size=data.get('size'),
        category=data.get('category'),
    )
    return jsonify(new_item.to_dict()), 201

@api_bp.route("/api/purchases", methods=["GET"])
def get_all_item_prices():
    item_prices = ItemPrice.get_all_item_prices()
    return jsonify(item_prices)


@api_bp.route("/api/item_prices/create", methods=["POST", "OPTIONS"])
def create_item_price():
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    data = request.get_json()

    if "price" not in data or "store_id" not in data or "item_id" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    new_item_price = ItemPrice(
        price=data["price"], store_id=data["store_id"], item_id=data["item_id"]
    )

    db.session.add(new_item_price)
    db.session.commit()

    return jsonify(new_item_price.to_dict()), 201


@api_bp.route("/api/items/<int:id>", methods=["GET", "DELETE"])
def get_item(id):
    if request.method == "GET":
        item = Item.query.get_or_404(id)
        return jsonify(item.to_dict())
    elif request.method == "DELETE":
        item = Item.query.get_or_404(id)
        db.session.delete(item)
        db.session.commit()
        return jsonify({}), 204


@api_bp.route("/api/purchases/<int:id>", methods=["GET", "DELETE"])
def get_item_price(id):
    if request.method == "GET":
        item_price = ItemPrice.query.get_or_404(id)
        return jsonify(item_price.to_dict())
    elif request.method == "DELETE":
        item_price = ItemPrice.query.get_or_404(id)
        db.session.delete(item_price)
        db.session.commit()
        return jsonify({}), 204


@api_bp.route("/api/stores/top5", methods=["GET"])
def get_top5_stores():
    top5_stores = (
        db.session.query(
            Store.id, Store.name, func.count(ItemPrice.id).label("item_price_count")
        )
        .join(ItemPrice)
        .group_by(Store.id)
        .order_by(func.count(ItemPrice.id).desc())
        .limit(5)
        .all()
    )

    top5_stores_dict = [
        {"id": store.id, "name": store.name, "item_price_count": store.item_price_count}
        for store in top5_stores
    ]

    return jsonify(top5_stores_dict)


@api_bp.route("/api/items/top5", methods=["GET"])
def get_top5_items():
    top5_items = (
        db.session.query(
            Item.id, Item.name, func.count(ItemPrice.id).label("item_price_count")
        )
        .join(ItemPrice)
        .group_by(Item.id)
        .order_by(func.count(ItemPrice.id).desc())
        .limit(5)
        .all()
    )

    top5_items_dict = [
        {"id": item.id, "name": item.name, "item_price_count": item.item_price_count}
        for item in top5_items
    ]

    return jsonify(top5_items_dict)


@api_bp.route("/api/item_prices/most_recent5", methods=["GET"])
def get_most_recent_item_prices():
    recent_item_prices = (
        db.session.query(
            ItemPrice.id,
            ItemPrice.price,
            ItemPrice.created_at,
            Store.name.label("store_name"),
            Item.name.label("item_name"),
        )
        .join(Store, ItemPrice.store_id == Store.id)
        .join(Item, ItemPrice.item_id == Item.id)
        .order_by(ItemPrice.created_at.desc())
        .limit(5)
        .all()
    )

    recent_item_prices_dict = [
        {
            "id": item_price.id,
            "price": item_price.price,
            "created_at": item_price.created_at.strftime("%m/%d/%Y"),
            "store_name": item_price.store_name,
            "item_name": item_price.item_name,
        }
        for item_price in recent_item_prices
    ]

    return jsonify(recent_item_prices_dict)


@api_bp.route("/api/item_prices/item/<int:item_id>", methods=["GET"])
def get_item_prices_by_item(item_id):
    item_prices = ItemPrice.get_item_prices_by_item_id(item_id)
    return jsonify(item_prices)


@api_bp.route("/api/order", methods=["GET"])
def get_order():
    store_name = request.args.get("store")
    date_str = request.args.get("date")

    # Parse the date string into a datetime object
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    # Query the database for orders filtered by store and date
    query = db.session.query(ItemPrice, Store, Item).join(Store, ItemPrice.store_id == Store.id).join(Item, ItemPrice.item_id == Item.id)

    if store_name:
        query = query.filter(Store.name == store_name)
    
    query = query.filter(func.date(ItemPrice.created_at) == date)

    orders = query.all()

    # Serialize the orders
    order_list = []
    for item_price, store, item in orders:
        order_list.append({
            "item_price_id": item_price.id,
            "price": item_price.price,
            "store_name": store.name,
            "item_name": item.name,
            "created_at": item_price.created_at.strftime("%m/%d/%Y"),
        })

    return jsonify(order_list)


@api_bp.route("/api/stores/<int:id>/items", methods=["GET"])
def get_store_items(id):
    store = Store.query.get_or_404(id)
    return jsonify([item.to_dict() for item in store.items])


@api_bp.route("/api/stores/<int:id>/purchases", methods=["GET"])
def get_store_purchases(id):
    store = Store.query.get_or_404(id)
    return jsonify(
        [
            item_price.to_dict(rules=("-store", "-store_id", "-item_id", "-updated_at"))
            for item_price in store.item_prices
        ]
    )


@api_bp.route("/api/items/<int:id>/stores", methods=["GET"])
def get_item_stores(id):
    item = Item.query.get_or_404(id)
    return jsonify([store.to_dict() for store in item.stores])


@api_bp.route("/api/orders", methods=["GET"])
def get_orders():
    item_prices = ItemPrice.get_all_item_prices()
    return jsonify(item_prices)

@api_bp.route("/api/lists", methods=["POST"])
def create_list():
    data = request.get_json()
    title = data.get('title')
    item_ids = data.get('items')

    new_list = List(title=title)

    for item_id in item_ids:
        item = Item.query.get(item_id)
        if item:
            new_list.items.append(item)

    db.session.add(new_list)
    db.session.commit()

    return jsonify(new_list.to_dict()), 201

@api_bp.route("/api/lists", methods=["GET"])
def get_all_lists():
    lists = List.query.all()
    return jsonify([lst.to_dict() for lst in lists])


from config import app

app.register_blueprint(api_bp)
