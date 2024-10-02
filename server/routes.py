from sqlalchemy import func
from flask import Blueprint, make_response, request
from models import Store, Item, ItemPrice, List, Order
from config import db
from datetime import datetime

api_bp = Blueprint("api", __name__)


# Test Route
@api_bp.route("/api/test", methods=["GET"])
def test():
    return make_response({"message": "Test Successful!"})


# Store Routes
@api_bp.route("/api/stores", methods=["GET"])
def handle_stores():
    if request.method == "GET":
        stores = Store.query.all()
        return make_response([store.to_dict() for store in stores])

    elif request.method == "POST":
        data = request.get_json()
        if "name" not in data or len(data["name"]) < 3:
            return (
                make_response(
                    {"error": "Store name must be at least 3 characters long"}
                ),
                400,
            )
        new_store = Store(name=data["name"])
        db.session.add(new_store)
        db.session.commit()
        return make_response(new_store.to_dict(), 201)

    elif request.method == "OPTIONS":
        return make_response({"status": "OK"}, 200)


@api_bp.route("/api/stores/<int:id>", methods=["GET", "PUT", "DELETE"])
def handle_store(id):
    if request.method == "GET":
        store = Store.query.get_or_404(id)
        return make_response(store.to_dict())

    elif request.method == "PUT":
        data = request.get_json()
        store = Store.query.get_or_404(id)
        for key, value in data.items():
            setattr(store, key, value)
        db.session.add(store)
        db.session.commit()
        return make_response(store.to_dict())

    elif request.method == "DELETE":
        store = Store.query.get_or_404(id)
        db.session.delete(store)
        db.session.commit()
        return make_response({}, 204)


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

    return make_response(top5_stores_dict)


# Item Routes
@api_bp.route("/api/items", methods=["GET"])
def handle_items():
    if request.method == "GET":
        items = [item.to_dict() for item in Item.query.all()]
        return make_response(items)

    elif request.method == "POST":
        data = request.get_json()
        new_item = Item.create(
            name=data.get("name"),
            image_url=data.get("image_url"),
            group=data.get("group"),
            form=data.get("form"),
            count=data.get("count"),
            department=data.get("department"),
            size=data.get("size"),
            category=data.get("category"),
        )
        return make_response(new_item.to_dict(), 201)


@api_bp.route("/api/items/<int:id>", methods=["GET", "DELETE"])
def handle_item(id):
    if request.method == "GET":
        item = Item.query.get_or_404(id)
        return make_response(item.to_dict())

    elif request.method == "DELETE":
        item = Item.query.get_or_404(id)
        db.session.delete(item)
        db.session.commit()
        return make_response({}, 204)


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

    return make_response(top5_items_dict)


# Purchase Routes
@api_bp.route("/api/purchases", methods=["GET", "POST", "OPTIONS"])
def handle_purchases():
    if request.method == "GET":
        item_prices = ItemPrice.get_all_item_prices()
        return make_response(item_prices)

    elif request.method == "POST":
        data = request.get_json()

        if "price" not in data or "store_id" not in data or "item_id" not in data:
            return make_response({"error": "Missing required fields"}, 400)

        new_item_price = ItemPrice(
            price=data["price"], store_id=data["store_id"], item_id=data["item_id"]
        )

        db.session.add(new_item_price)
        db.session.commit()

        return make_response(new_item_price.to_dict(), 201)

    elif request.method == "OPTIONS":
        return make_response({"status": "OK"}, 200)


@api_bp.route("/api/purchases/<int:id>", methods=["GET", "DELETE"])
def handle_purchase(id):
    if request.method == "GET":
        item_price = ItemPrice.query.get_or_404(id)
        return make_response(item_price.to_dict())
    elif request.method == "DELETE":
        item_price = ItemPrice.query.get_or_404(id)
        db.session.delete(item_price)
        db.session.commit()
        return make_response({}), 204


@api_bp.route("/api/purchases/most_recent5", methods=["GET"])
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

    return make_response(recent_item_prices_dict)


@api_bp.route("/api/purchases/item/<int:item_id>", methods=["GET"])
def get_purchases_by_item(item_id):
    item_prices = ItemPrice.get_item_prices_by_item_id(item_id)
    return make_response(item_prices)


@api_bp.route("/api/stores/<int:id>/items", methods=["GET"])
def get_store_items(id):
    store = Store.query.get_or_404(id)
    return make_response([item.to_dict() for item in store.items])


@api_bp.route("/api/stores/<int:id>/purchases", methods=["GET"])
def get_store_purchases(id):
    store = Store.query.get_or_404(id)
    return make_response(
        [
            item_price.to_dict(rules=("-store", "-store_id", "-item_id", "-updated_at"))
            for item_price in store.item_prices
        ]
    )


@api_bp.route("/api/items/<int:id>/stores", methods=["GET"])
def get_item_stores(id):
    item = Item.query.get_or_404(id)
    return make_response([store.to_dict() for store in item.stores])


@api_bp.route("/api/lists", methods=["GET"])
def get_all_lists():
    lists = List.query.all()
    return make_response([lst.to_dict_with_items() for lst in lists])


@api_bp.route("/api/lists", methods=["POST"])
def create_list():
    data = request.get_json()
    title = data.get("title")
    item_ids = data.get("items")

    new_list = List(title=title)

    for item_id in item_ids:
        item = Item.query.get(item_id)
        if item:
            new_list.items.append(item)

    db.session.add(new_list)
    db.session.commit()

    return make_response(new_list.to_dict()), 201


@api_bp.route("/api/lists/<int:id>", methods=["GET"])
def get_list(id):
    lst = List.query.get_or_404(id)

    return make_response(lst.to_dict_with_items())


@api_bp.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    created_at_str = data.get('created_at')
    items = data.get('items')
    store_name = data.get('store_name')

    if not created_at_str or not items or not store_name:
        return jsonify({"error": "Created at date, items, and store name are required"}), 400

    try:
        created_at = datetime.fromisoformat(created_at_str)
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    store = Store.query.filter_by(name=store_name).first()
    if not store:
        store = Store(name=store_name)
        db.session.add(store)
        db.session.commit()

    new_order = Order(created_at=created_at, store_id=store.id)  # Set store_id here

    for item in items:
        item_name = item.get('itemName')
        price = item.get('price')

        if not item_name or price is None:
            return jsonify({"error": "Item name and price are required for each item"}), 400

        existing_item = Item.query.filter_by(name=item_name).first()
        if not existing_item:
            new_item = Item.create(name=item_name, image_url=None, count=0, group='default', form='default', department='default', size=None, category='default')
            existing_item = new_item

        item_price = ItemPrice(price=float(price), store_id=store.id, item_id=existing_item.id)
        new_order.item_prices.append(item_price)

    db.session.add(new_order)
    db.session.commit()

    return jsonify(new_order.to_dict_with_items()), 201


@api_bp.route('/api/orders', methods=['GET'])
def handle_orders():
    orders = Order.query.all()
    order_details = []

    for order in orders:
        item_prices = []
        for item_price in order.item_prices:
            item_prices.append(item_price.to_dict())

        order_dict = order.to_dict_with_items()
        order_dict['item_prices'] = item_prices
        order_details.append(order_dict)

    return jsonify(order_details)

@api_bp.route('/api/orders/<int:id>', methods=['GET'])
def get_order(id):
    order = Order.query.get_or_404(id)
    item_prices = [item_price.to_dict() for item_price in order.item_prices]
    order_dict = order.to_dict()
    order_dict['item_prices'] = item_prices
    return jsonify(order_dict)

@api_bp.route("/api/items/search", methods=["GET"])
def search_items():
    query = request.args.get('query', '').strip()
    if not query:
        return jsonify([])

    items = Item.query.filter(Item.name.ilike(f"%{query}%")).all()
    return jsonify([item.to_dict() for item in items])

@api_bp.route("/api/stores/search", methods=["GET"])
def search_stores():
    query = request.args.get('query', '').strip()
    if not query:
        return jsonify([])

    stores = Store.query.filter(Store.name.ilike(f"%{query}%")).all()
    
    return jsonify([store.to_dict() for store in stores])

from config import app

app.register_blueprint(api_bp)