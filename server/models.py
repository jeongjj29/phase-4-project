from sqlalchemy import func
from sqlalchemy_serializer import SerializerMixin
from config import db

class Item(db.Model, SerializerMixin):
    __tablename__ = "items"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    item_prices = db.relationship("ItemPrice", backref="item", cascade="all, delete")

    serialize_rules = ('-item_prices',)

    def __repr__(self):
        return f"<Item {self.name}>"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

class Store(db.Model, SerializerMixin):
    __tablename__ = "stores"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    item_prices = db.relationship("ItemPrice", backref="store", cascade="all, delete")

    serialize_rules = ('-item_prices',)

    def __repr__(self):
        return f"<Store {self.name}>"
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }


class ItemPrice(db.Model, SerializerMixin):
    __tablename__ = "item_prices"

    id = db.Column(db.Integer, primary_key=True)
    price = db.Column(db.Float, nullable=False)
    store_id = db.Column(db.Integer, db.ForeignKey("stores.id"), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey("items.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=True)
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now(), nullable=True)

    def __repr__(self):
        return f"<ItemPrice: Store {self.store_id}, Item {self.item_id}, Price {self.price}>"
