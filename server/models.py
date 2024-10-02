from sqlalchemy import func, and_, Column, Integer, String, Float, Enum
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db


class Item(db.Model, SerializerMixin):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    count = Column(Integer, nullable=False)
    category = Column(String, nullable=False)
    group = Column(String, nullable=False)
    form = Column(String, nullable=False)
    department = Column(String, nullable=False)
    size = Column(String, nullable=True)
    category = Column(String, nullable=True)

    lists = db.relationship('List', secondary='item_list', back_populates='items')
    item_prices = db.relationship("ItemPrice", back_populates="item", cascade="all, delete")
  
    stores = association_proxy("item_prices", "store")

    serialize_rules = ("-item_prices.item", "-lists", "-stores.item_prices")  # Avoid recursion

    def __repr__(self):
        return f"<Item {self.name}>"
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'image_url': self.image_url,
            'count': self.count,
            'category': self.category,
            'group': self.group,
            'form': self.form,
            'department': self.department,
            'size': self.size
        }

    @classmethod
    def create(cls, name, image_url, count, group, form, department, size, category):
        new_item = cls(
            name=name,
            image_url=image_url,
            group=group,
            form=form,
            count=count,
            department=department,
            size=size,
            category=category
        )
        db.session.add(new_item)
        db.session.commit()
        return new_item

class Store(db.Model, SerializerMixin):
    __tablename__ = "stores"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    item_prices = db.relationship(
        "ItemPrice", back_populates="store", cascade="all, delete"
    )
    items = association_proxy("item_prices", "item")

    serialize_rules = ("-item_prices.item",)

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
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=True)
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now(), nullable=True)

    store = db.relationship("Store", back_populates="item_prices")
    item = db.relationship("Item", back_populates="item_prices")
    order = db.relationship("Order", back_populates="item_prices")

    serialize_rules = ("-store.item_prices", "-item.item_prices", "-order.item_prices")
    
    def to_dict(self):
        return {
            "id": self.id,
            "price": self.price,
            "item_id": self.item.id,
            "store_id": self.store.id,
            "item_name": self.item.name,
            "store_name": self.store.name,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }

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
                    func.date(cls.created_at) == date,
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
        )
        return [
            {
                "id": ip.id,
                "price": ip.price,
                "created_at": ip.created_at.strftime("%m/%d/%Y"),
                "store": {"id": ip.store.id, "name": ip.store.name},
            }
            for ip in item_prices
        ]
    
class List(db.Model, SerializerMixin):
    __tablename__ = 'lists'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    
    items = db.relationship('Item', secondary='item_list', back_populates='lists')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'items': [item.id for item in self.items]
        }
    def to_dict_with_items(self):
        return {
            'id': self.id,
            'title': self.title,
            'items': [item.to_dict() for item in self.items]
        }
    
class ItemList(db.Model):
    __tablename__ = "item_list"

    id = Column(Integer, primary_key=True)
    list_id = Column(Integer, db.ForeignKey("lists.id"), nullable=False)
    item_id = Column(Integer, db.ForeignKey("items.id"), nullable=False)

class Order(db.Model, SerializerMixin):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=func.now())
    store_id = Column(Integer, db.ForeignKey("stores.id"), nullable=True)

    item_prices = db.relationship("ItemPrice", back_populates="order", cascade="all, delete")

    def to_dict_with_items(self):
        return {
            "id": self.id,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "item_prices": [item_price.to_dict() for item_price in self.item_prices]
        }

    @classmethod
    def create(cls):
        new_order = cls()
        db.session.add(new_order)
        db.session.commit()
        return new_order
