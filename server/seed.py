from datetime import datetime, timedelta
from sqlalchemy import func
from config import db
from models import Store, Item, ItemPrice
from random import choice as rc
from random import uniform as ru
from random import randrange as rr
from app import app  # Adjust this import based on where your Flask app is located


def seed_data():
    # Use the application context
    with app.app_context():
        # Drop existing tables
        db.drop_all()
        # Create tables
        db.create_all()

        # Create stores
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

        # Create items
        items = [
            Item(name="Apples"),
            Item(name="Bananas"),
            Item(name="Cherries"),
            Item(name="Dates"),
            Item(name="Eggs"),
            Item(name="Fish"),
            Item(name="Grapes"),
            Item(name="Honey"),
            Item(name="Ice Cream"),
            Item(name="Juice"),
            Item(name="Cheese"),
            Item(name="Milk"),
            Item(name="Nuts"),
            Item(name="Oranges"),
            Item(name="Pears"),
            Item(name="Pineapples"),
            Item(name="Raspberries"),
            Item(name="Strawberries"),
            Item(name="Tomatoes"),
            Item(name="Yogurt"),
            Item(name="Zucchini"),
            Item(name="Avocados"),
            Item(name="Cucumbers"),
            Item(name="Potatoes"),
            Item(name="Spinach"),
            Item(name="Carrots"),
            Item(name="Broccoli"),
        ]

        # Add stores and items to session
        db.session.add_all(stores)
        db.session.add_all(items)

        # Create item prices with some overlapping created_at times
        created_time = datetime.now()
        item_prices = [
            ItemPrice(
                price=1.99, store=stores[0], item=items[0], created_at=created_time
            ),
            ItemPrice(
                price=0.99, store=stores[0], item=items[1], created_at=created_time
            ),
            ItemPrice(
                price=2.49,
                store=stores[1],
                item=items[2],
                created_at=created_time + timedelta(days=1),
            ),
            ItemPrice(
                price=3.49,
                store=stores[2],
                item=items[3],
                created_at=created_time + timedelta(days=1),
            ),
            ItemPrice(
                price=4.99,
                store=stores[3],
                item=items[4],
                created_at=created_time + timedelta(days=2),
            ),
            ItemPrice(
                price=5.49,
                store=stores[4],
                item=items[5],
                created_at=created_time + timedelta(days=2),
            ),
            ItemPrice(
                price=1.49,
                store=stores[0],
                item=items[6],
                created_at=created_time + timedelta(days=3),
            ),
            ItemPrice(
                price=2.99,
                store=stores[1],
                item=items[7],
                created_at=created_time + timedelta(days=3),
            ),
            ItemPrice(
                price=3.99,
                store=stores[2],
                item=items[8],
                created_at=created_time + timedelta(days=4),
            ),
            ItemPrice(
                price=4.49,
                store=stores[3],
                item=items[9],
                created_at=created_time + timedelta(days=4),
            ),
        ]

        more_item_prices = []
        for i in range(50):
            item_price = ItemPrice(
                price=round(ru(0.99, 9.99), 2),
                store=rc(stores),
                item=rc(items),
                created_at=created_time + timedelta(days=(rr(0, 10, 1))),
            )
            more_item_prices.append(item_price)

        # Add item prices to session
        db.session.add_all(item_prices)
        db.session.add_all(more_item_prices)

        # Commit the transaction
        db.session.commit()
        print("Data seeded successfully!")


if __name__ == "__main__":
    seed_data()
