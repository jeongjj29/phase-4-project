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
@api_bp.route("/api/stores", methods=["GET", "POST", "OPTIONS"])
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


@api_bp.route("/api/items", methods=["GET", "POST"])
def handle_items():
    if request.method == "GET":
        items = [item.to_dict() for item in Item.query.all()]
        return make_response(items)

    elif request.method == "POST":
        data = request.get_json()

        if not data.get("name") or len(data["name"]) < 3:
            return make_response({"error": "Item name must be at least 3 characters long"}, 400)

        new_item = Item(
            name=data.get("name"),
            image_url=data.get("image_url"),
            group=data.get("group"),
            form=data.get("form"),
            count=data.get("count"),
            department=data.get("department"),
            size=data.get("size"),
            category=data.get("category"),
        )

        db.session.add(new_item)
        db.session.commit()
        return make_response(new_item.to_dict(), 201)


@api_bp.route("/api/items/<int:id>", methods=["GET", "PUT", "DELETE"])
def handle_item(id):
    if request.method == "GET":
        item = Item.query.get_or_404(id)
        return make_response(item.to_dict())

    elif request.method == "PUT":
        data = request.get_json()
        item = Item.query.get_or_404(id)
        for key, value in data.items():
            setattr(item, key, value)
        db.session.add(item)
        db.session.commit()
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


@api_bp.route("/api/purchases", methods=["GET", "POST", "OPTIONS"])
def handle_purchases():
    if request.method == "GET":
        item_prices = ItemPrice.query.order_by(ItemPrice.created_at.desc()).all()
        result = [
            {
                "id": ip.id,
                "price": ip.price,
                "created_at": ip.created_at.isoformat(),
                "updated_at": ip.updated_at.isoformat(),
                "store": {"id": ip.store.id, "name": ip.store.name},
                "item": {"id": ip.item.id, "name": ip.item.name},
            }
            for ip in item_prices
        ]
        return make_response(result)

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

@api_bp.route("/api/purchases/<int:id>", methods=["GET", "PUT", "DELETE"])
def handle_purchase(id):
    if request.method == "GET":
        item_price = ItemPrice.query.get_or_404(id)
        return make_response(item_price.to_dict())

    elif request.method == "PUT":
        data = request.get_json()
        item_price = ItemPrice.query.get_or_404(id)
        for key, value in data.items():
            setattr(item_price, key, value)
        db.session.add(item_price)
        db.session.commit()
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
    title = data.get("name")
    item_names = data.get("items")

    new_list = List(title=title)

    for item_name in item_names:
        item = Item.query.filter_by(name=item_name).first()
        if not item:
            item = Item(name=item_name, count=0, category='Default', group='Default', form='Default', department='Default')
            db.session.add(item)
        new_list.items.append(item)

    db.session.add(new_list)
    db.session.commit() 

    return make_response(new_list.to_dict()), 201



@api_bp.route("/api/lists/<int:id>", methods=["GET", "PUT"])
def handle_list(id):
    lst = List.query.get_or_404(id)

    if request.method == "GET":
        return make_response(lst.to_dict_with_items())

    elif request.method == "PUT":
        data = request.get_json()

        lst.title = data.get("title", lst.title)

        item_names = data.get("items", [])
        lst.items.clear()

        for item_data in item_names:
            item_name = item_data['name']
            item = Item.query.filter_by(name=item_name).first()
            if not item:
                item = Item(
                    name=item_name,
                    count=0,
                    category='Default',
                    group='Default',
                    form='Default',
                    department='Default'
                )
                db.session.add(item)
            
            lst.items.append(item)

        db.session.commit()

        return make_response(lst.to_dict_with_items()), 200



@api_bp.route("/api/orders", methods=["POST"])
def create_order():
    data = request.json
    created_at_str = data.get("created_at")
    items = data.get("items")
    store_name = data.get("store_name")

    if not created_at_str or not items or not store_name:
        return make_response(
            {"error": "Created at date, items, and store name are required"}, 400
        )

    try:
        created_at = datetime.fromisoformat(created_at_str)
    except ValueError:
        return make_response({"error": "Invalid date format. Use YYYY-MM-DD."}, 400)

    store = Store.query.filter_by(name=store_name).first()
    if not store:
        store = Store(name=store_name)
        db.session.add(store)
        db.session.commit()

    new_order = Order(created_at=created_at, store_id=store.id)

    for item in items:
        item_name = item.get("itemName")
        price = item.get("price")

        if not item_name or price is None:
            return make_response(
                {"error": "Item name and price are required for each item"},
                400,
            )

        existing_item = Item.query.filter_by(name=item_name).first()
        if not existing_item:
            new_item = Item.create(
                name=item_name,
                image_url=None,
                count=0,
                group="default",
                form="default",
                department="default",
                size=None,
                category="default",
            )
            existing_item = new_item

        item_price = ItemPrice(
            price=float(price), store_id=store.id, item_id=existing_item.id
        )
        new_order.item_prices.append(item_price)

    db.session.add(new_order)
    db.session.commit()

    return make_response(new_order.to_dict_with_items(), 201)


@api_bp.route("/api/orders", methods=["GET"])
def handle_orders():
    orders = Order.query.all()
    order_details = []

    for order in orders:
        item_prices = []
        for item_price in order.item_prices:
            item_prices.append(item_price.to_dict())

        order_dict = order.to_dict_with_items()
        order_dict["item_prices"] = item_prices
        order_details.append(order_dict)

    return make_response(order_details)


@api_bp.route("/api/orders/<int:id>", methods=["GET", "PUT"])
def handle_order(id):
    order = Order.query.get_or_404(id)

    if request.method == "GET":
        item_prices = [item_price.to_dict() for item_price in order.item_prices]
        order_dict = order.to_dict_with_items()
        order_dict["item_prices"] = item_prices
        return make_response(order_dict, 200)

    elif request.method == "PUT":
        data = request.get_json()

        order.created_at = data.get("created_at", order.created_at)

        store_name = data.get("store_name")
        if store_name:
            store = Store.query.filter_by(name=store_name).first()
            if not store:
                store = Store(name=store_name)
                db.session.add(store)
                db.session.commit()
            order.store_id = store.id

        item_prices_data = data.get("item_prices", [])
        for item_data in item_prices_data:
            item_name = item_data.get("item_name")
            price = item_data.get("price")

            if item_name and price is not None:
                item = Item.query.filter_by(name=item_name).first()
                if not item:
                    item = Item.create(
                        name=item_name, 
                        image_url=None, 
                        count=0, 
                        group='', 
                        form='', 
                        department='', 
                        size=None, 
                        category=None
                    )
                item_price = ItemPrice(
                    item_id=item.id, 
                    price=price, 
                    store_id=order.store_id,
                    order_id=order.id
                )
                db.session.add(item_price)

        db.session.commit()
        return make_response(order.to_dict_with_items(), 200)


@api_bp.route("/api/items/search", methods=["GET"])
def search_items():
    query = request.args.get("query", "").strip()
    if not query:
        return make_response([])

    items = Item.query.filter(Item.name.ilike(f"%{query}%")).all()
    return make_response([item.to_dict() for item in items])


@api_bp.route("/api/stores/search", methods=["GET"])
def search_stores():
    query = request.args.get("query", "").strip()
    if not query:
        return make_response([])

    stores = Store.query.filter(Store.name.ilike(f"%{query}%")).all()

    return make_response([store.to_dict() for store in stores])

@api_bp.route("/api/purchases/item/<int:item_id>", methods=["GET"])
def get_item_prices_by_item_id(item_id):
    item_prices = (
        db.session.query(ItemPrice)
        .filter(ItemPrice.item_id == item_id)
        .all()
    )

    result = [
        {
            "id": item_price.id,
            "price": item_price.price,
            "store": {
                "id": item_price.store.id,
                "name": item_price.store.name
            },
            "created_at": item_price.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }
        for item_price in item_prices
    ]

    return make_response(result), 200
from config import app

app.register_blueprint(api_bp)
