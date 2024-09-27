from datetime import datetime, timedelta
from sqlalchemy import func
from config import db
from models import Store, Item, ItemPrice
from random import choice as rc
from random import uniform as ru
from random import randrange as rr
from app import app

def seed_data():
    with app.app_context():
        db.drop_all()
        db.create_all()

        stores = [
            Store(name="SuperMart"),
            Store(name="QuickBuy"),
            Store(name="MegaStore"),
            Store(name="LocalMart"),
            Store(name="DailyDeals"),
            Store(name="KeyFoods"),
            Store(name="HMart"),
            Store(name="FoodUniverse"),
            Store(name="FoodBazaar"),
            Store(name="FoodTown"),
        ]

        items = [
            Item(name="Apples", category="Fruit", group="Produce", form="Whole", department="Produce", size="1 lb", count=10),
            Item(name="Bananas", image_url="bananas.jpg", category="Fruit", group="Produce", form="Whole", department="Produce", size="1 lb", count=12),
            Item(name="Cherries", category="Fruit", group="Produce", form="Whole", department="Produce", size="1 lb", count=15),
            Item(name="Dates", category="Fruit", group="Dried Fruit", form="Whole", department="Produce", size="1 lb", count=5),
            Item(name="Eggs", image_url="eggs.jpg", category="Dairy", group="Eggs", form="Whole", department="Dairy", size="dozen", count=18),
            Item(name="Fish", category="Protein", group="Seafood", form="Whole", department="Seafood", size="1 lb", count=8),
            Item(name="Grapes", category="Fruit", group="Produce", form="Whole", department="Produce", size="1 lb", count=20),
            Item(name="Honey", category="Condiment", group="Sweeteners", form="Liquid", department="Grocery", size="8 oz", count=6),
            Item(name="Ice Cream", image_url="icecream.jpg", category="Dessert", group="Frozen", form="Tub", department="Frozen Foods", size="1.5 qt", count=4),
            Item(name="Juice", category="Beverage", group="Drinks", form="Liquid", department="Beverages", size="64 oz", count=7),
            Item(name="Cheese", category="Dairy", group="Cheese", form="Block", department="Dairy", size="8 oz", count=9),
            Item(name="Milk", image_url="milk.jpg", category="Dairy", group="Beverages", form="Liquid", department="Dairy", size="1 gallon", count=5),
            Item(name="Nuts", category="Snack", group="Dry Goods", form="Whole", department="Snacks", size="8 oz", count=12),
            Item(name="Oranges", category="Fruit", group="Produce", form="Whole", department="Produce", size="1 lb", count=11),
            Item(name="Pears", category="Fruit", group="Produce", form="Whole", department="Produce", size="1 lb", count=14),
            Item(name="Pineapples", category="Fruit", group="Produce", form="Whole", department="Produce", size="1 lb", count=9),
            Item(name="Raspberries", category="Fruit", group="Produce", form="Whole", department="Produce", size="6 oz", count=16),
            Item(name="Strawberries", category="Fruit", group="Produce", form="Whole", department="Produce", size="1 lb", count=10),
            Item(name="V8 Strawberry Banana", image_url="V8StrawberryBanana.jpg", category="Beverage", group="Juices", form="Liquid", department="Beverages", size="46 oz", count=8),
            Item(name="Bread", image_url="bread.jpg", category="Bakery", group="Bread", form="Loaf", department="Bakery", size="16 oz", count=20),
            Item(name="Chewy Granola Bars", image_url="chewy_bars.jpg", category="Snack", group="Granola Bars", form="Pack", department="Snacks", size="6 bars", count=15),
            Item(name="Coffee", image_url="coffee.jpg", category="Beverage", group="Coffee", form="Ground", department="Beverages", size="12 oz", count=5),
            Item(name="Hershey's Chocolate", image_url="herseschocloatr.jpg", category="Snack", group="Candy", form="Bar", department="Snacks", size="1.55 oz", count=10),
            Item(name="Sausage Dog", image_url="sausage_dog.jpg", category="Protein", group="Meat", form="Pre-cooked", department="Protein", size="1 count", count=8),
            Item(name="Tomatoes", image_url="tomatos.jpg", category="Vegetable", group="Produce", form="Whole", department="Produce", size="1 lb", count=12),
            Item(name="Yogurt", category="Dairy", group="Dairy", form="Cup", department="Dairy", size="32 oz", count=9),
            Item(name="Zucchini", category="Vegetable", group="Produce", form="Whole", department="Produce", size="1 lb", count=11),
            Item(name="Avocados", category="Fruit", group="Produce", form="Whole", department="Produce", size="1 lb", count=5),
            Item(name="Cucumbers", category="Vegetable", group="Produce", form="Whole", department="Produce", size="1 lb", count=10),
            Item(name="Potatoes", category="Vegetable", group="Produce", form="Whole", department="Produce", size="1 lb", count=20),
            Item(name="Spinach", category="Vegetable", group="Produce", form="Fresh", department="Produce", size="8 oz", count=8),
            Item(name="Carrots", category="Vegetable", group="Produce", form="Whole", department="Produce", size="1 lb", count=15),
            Item(name="Broccoli", category="Vegetable", group="Produce", form="Whole", department="Produce", size="1 lb", count=7),
        ]

        db.session.add_all(stores)
        db.session.add_all(items)

        created_time = datetime.now()
        item_prices = [
            ItemPrice(price=1.99, store=stores[0], item=items[0], created_at=created_time),
            ItemPrice(price=0.99, store=stores[0], item=items[1], created_at=created_time),
            ItemPrice(price=2.49, store=stores[1], item=items[2], created_at=created_time + timedelta(days=1)),
            ItemPrice(price=3.49, store=stores[2], item=items[3], created_at=created_time + timedelta(days=1)),
            ItemPrice(price=4.99, store=stores[3], item=items[4], created_at=created_time + timedelta(days=2)),
            ItemPrice(price=5.49, store=stores[4], item=items[5], created_at=created_time + timedelta(days=2)),
            ItemPrice(price=1.49, store=stores[0], item=items[6], created_at=created_time + timedelta(days=3)),
            ItemPrice(price=2.99, store=stores[1], item=items[7], created_at=created_time + timedelta(days=3)),
            ItemPrice(price=3.99, store=stores[2], item=items[8], created_at=created_time + timedelta(days=4)),
            ItemPrice(price=4.49, store=stores[3], item=items[9], created_at=created_time + timedelta(days=4)),
        ]

        more_item_prices = []
        for i in range(50):
            item_price = ItemPrice(
                price=round(ru(0.99, 9.99), 2),
                store=rc(stores),
                item=rc(items),
                created_at=created_time + timedelta(days=rr(0, 30))
            )
            more_item_prices.append(item_price)

        db.session.add_all(item_prices + more_item_prices)
        db.session.commit()

if __name__ == "__main__":
    seed_data()
