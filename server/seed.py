from config import db, app  # Make sure to import your Flask app
from models import Store, Item, ItemPrice
import random

def seed_data():
    # Create stores
    stores = [
        Store(name="SuperMart"),
        Store(name="QuickBuy"),
        Store(name="MegaMart"),
        Store(name="FreshMarket"),
        Store(name="ValueShop")
    ]
    
    # Create items
    items = [
        Item(name="Apples"),
        Item(name="Bananas"),
        Item(name="Oranges"),
        Item(name="Milk"),
        Item(name="Bread"),
        Item(name="Eggs"),
        Item(name="Chicken"),
        Item(name="Rice"),
        Item(name="Pasta"),
        Item(name="Tomatoes")
    ]
    
    # Add stores and items to session
    db.session.add_all(stores)
    db.session.add_all(items)
    
    # Create item prices
    item_prices = []
    for _ in range(20):  # Generate 20 item prices
        price = round(random.uniform(0.5, 10.0), 2)  # Random price between 0.5 and 10.0
        store = random.choice(stores)  # Randomly select a store
        item = random.choice(items)  # Randomly select an item
        item_prices.append(ItemPrice(price=price, store=store, item=item))
    
    # Add item prices to session
    db.session.add_all(item_prices)
    
    # Commit the transaction
    db.session.commit()
    print("Data seeded successfully!")

if __name__ == "__main__":
    with app.app_context():  # Add this line to create an application context
        seed_data()
