from sqlalchemy import func, and_
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db


class Item(db.Model, SerializerMixin):
    __tablename__ = "items"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    item_prices = db.relationship(
        "ItemPrice", back_populates="item", cascade="all, delete"
    )

    stores = association_proxy("item_prices", "store")

    serialize_rules = ("-item_prices",)

    def __repr__(self):
        return f"<Item {self.name}>"

    def to_dict(self):
        return {"id": self.id, "name": self.name}


class Store(db.Model, SerializerMixin):
    __tablename__ = "stores"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    item_prices = db.relationship(
        "ItemPrice", back_populates="store", cascade="all, delete"
    )
    items = association_proxy("item_prices", "item")

    serialize_rules = ("-item_prices",)

    def __repr__(self):
        return f"<Store {self.name}>"

    def to_dict(self):
        return {"id": self.id, "name": self.name}


class ItemPrice(db.Model, SerializerMixin):
    __tablename__ = "item_prices"

    id = db.Column(db.Integer, primary_key=True)
    price = db.Column(db.Float, nullable=False)
    store_id = db.Column(db.Integer, db.ForeignKey("stores.id"), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey("items.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=True)
    updated_at = db.Column(
        db.DateTime, default=func.now(), onupdate=func.now(), nullable=True
    )

    store = db.relationship("Store", back_populates="item_prices")
    item = db.relationship("Item", back_populates="item_prices")

    @classmethod
    def get_all_item_prices(cls):
        item_prices = cls.query.order_by(cls.created_at.desc()).all()
        return [
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

    @classmethod
    def get_item_price_with_details(cls, store_name, date):
        item_prices = (
            cls.query.join(Store)
            .filter(
                and_(
                    Store.name == store_name,
                    func.date(cls.created_at) == date,  # Filter by date
                )
            )
            .order_by(cls.created_at.desc())
            .all()
        )

        return [
            {
                "id": ip.id,
                "price": ip.price,
                "created_at": ip.created_at.isoformat(),
                "store": {"id": ip.store.id, "name": ip.store.name},
                "item": {"id": ip.item.id, "name": ip.item.name},
            }
            for ip in item_prices
        ]

    @classmethod
    def get_item_prices_by_item_id(cls, item_id):
        item_prices = (
            cls.query.filter_by(item_id=item_id).order_by(cls.created_at.desc()).all()
        )  # Sort by created_at
        return [
            {
                "id": ip.id,
                "price": ip.price,
                "created_at": ip.created_at.strftime("%m/%d/%Y"),
                "store": {"id": ip.store.id, "name": ip.store.name},
            }
            for ip in item_prices
        ]
