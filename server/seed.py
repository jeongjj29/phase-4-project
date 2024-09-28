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
            Item(name="Bays Original Pre-sliced English Muffins", category="English Muffins", group="Grains", form="Sliced", department="Baked Goods", count=6, size="12 oz"),
            Item(name="La Banderita Ricas Flour Tortillas, Regular, Family Pack, 20 count, 22.5 oz", category="Flour Tortillas", group="Grains", form="Block", department="Baked Goods", count=20, size="22.5 oz"),
            Item(name="Mission Super Soft Soft Taco Flour Tortillas, 17.5 oz, 10 Count", category="Flour Tortillas", group="Grains", form="Block", department="Baked Goods", count=10, size="17.5 oz"),
            Item(name="Great Value Honey Wheat Bread, 20 oz", image_url="bread.jpg", category="Bread", group="Grains", form="Loaf", department="Baked Goods", count=None, size="20 oz"),
            Item(name="Lender’s Refrigerated Pre-Sliced Plain Bagel, 6 per Bag, 17.1 oz Bag", category="Bagels", group="Grains", form="Sliced", department="Baked Goods", count=6, size="17.1 oz"),
            Item(name="Great Value Pure Granulated Sugar, 10lb", category="Sugar", group="Others", form="Granulated", department="Pantry", count=None, size="10 lb"),
            Item(name="Great Value Milk Chocolate Chips, 11.5 oz", category="Chocolate Chips", group="Others", form="Bag", department="Baking", count=None, size="11.5 oz"),
            Item(name="V8 Strawberry Banana 100 Fruit and Vegetable Juice, 46 fl oz Bottle", image_url="V8StrawberryBanana.jpg", category="Fruit Juice", group="Frutes/Vege.", form="Bottle", department="Beverages", count=None, size="46 fl oz"),
            Item(name="Tropicana Pure Premium Low Acid No Pulp Orange Fruit Juice, 52 fl oz, Bottle", category="Fruit Juice", group="Frutes/Vege.", form="Bottle", department="Beverages", count=None, size="52 fl oz"),
            Item(name="Malt-O-Meal Cinnamon Toasters Breakfast Cereal, Cinnamon Cereal Squares, 33 oz Resealable Bag", category="Cereal", group="Grains", form="Box", department="Breakfast", count=None, size="33 oz"),
            Item(name="Great Value 100% Whole Grain Old Fashioned Oats, 42 oz", category="Oats", group="Grains", form="Bag", department="Breakfast", count=None, size="42 oz"),
            Item(name="Malt O Meal Quick Cooking Hot Wheat Cereal, Original, 36 oz Box", category="Cereal", group="Grains", form="Box", department="Breakfast", count=None, size="36 oz"),
            Item(name="Great Value French Vanilla Coffee Creamer, 64 fl oz", category="Coffee Creamer", group="Dairy", form="Bottle", department="Beverages", count=None, size="64 fl oz"),
            Item(name="Folgers Black Silk Ground Coffee, Smooth Dark Roast Coffee, 33.7 Ounce Canister", image_url="coffee.jpg",  category="Coffee", group="Others", form="Canister", department="Beverages", count=None, size="33.7 oz"),
            Item(name="Florida Crystals Organic Raw Cane Sugar, 6 lb Pouch", category="Sugar", group="Others", form="Cane", department="Pantry", count=None, size="6 lb"),
            Item(name="Great Value Deli Style Sliced Non-Smoked Provolone Cheese, 8 oz, 12 Count", category="Cheese", group="Dairy", form="Sliced", department="Dairy", count=12, size="8 oz"),
            Item(name="Great Value Chive & Onion Cream Cheese Spread, 8 oz Tub", category="Cream Cheese", group="Dairy", form="Tub", department="Dairy", count=None, size="8 oz"),
            Item(name="Daisy Pure and Natural Cottage Cheese, 4% Milkfat, 16 oz (1 lb) Tub (Refrigerated)", category="Cottage Cheese", group="Dairy", form="Tub", department="Dairy", count=None, size="16 oz"),
            Item(name="Great Value Cream Cheese Brick, 8 oz (Refrigerated)", image_url="milk.jpg", category="Cream Cheese", group="Dairy", form="Brick", department="Dairy", count=None, size="8 oz"),
            Item(name="Pillsbury Flaky Layers Refrigerated Buttermilk Biscuits, 5 ct., 6 oz.", category="Biscuits", group="Grains", form="Package", department="Baked Goods", count=5, size="6 oz"),
            Item(name="Great Value Cream Cheese 8 oz, 2 Count", category="Cream Cheese", group="Dairy", form="Package", department="Dairy", count=2, size="8 oz"),
            Item(name="Great Value Large White Eggs, 18 Count", image_url="eggs.jpg",  category="Eggs", group="Dairy", form="Carton", department="Dairy", count=18, size=None),
            Item(name="Daisy Pure and Natural Sour Cream, 16 oz (1 lb) Tub (Refrigerated)", category="Sour Cream", group="Dairy", form="Tub", department="Dairy", count=None, size="16 oz"),
            Item(name="Great Value Mild Cheddar Cheese, 32 oz", category="Cheese", group="Dairy", form="Block", department="Dairy", count=None, size="32 oz"),
            Item(name="Great Value Half and Half, 64 fl oz", category="Half and Half", group="Dairy", form="Bottle", department="Dairy", count=None, size="64 fl oz"),
            Item(name="Great Value Deli Style Sliced Sharp Cheddar Cheese, 8 oz, 12 Slices", category="Cheese", group="Dairy", form="Sliced", department="Dairy", count=12, size="8 oz"),
            Item(name="Great Value Milk 2% Reduced Fat Gallon Plastic Jug", category="Milk", group="Dairy", form="Jug", department="Dairy", count=None, size="Gallon"),
            Item(name="Country Crock Calcium Buttery Spread, 45 oz Tub", category="Butter", group="Dairy", form="Tub", department="Dairy", count=None, size="45 oz"),
            Item(name="Great Value Finely Shredded Parmesan Cheese, 6 oz", category="Cheese", group="Dairy", form="Shredded", department="Dairy", count=None, size="6 oz"),
            Item(name="Hillshire Farm Ultra Thin Sliced Pastrami Deli Lunch Meat, 7 oz", category="Lunch Meat", group="Proteins", form="Sliced", department="Meat", count=None, size="7 oz"),
            Item(name="Hillshire Farm Uncured Ultra Thin Hard Salami Deli Lunch Meat, 7 oz", category="Lunch Meat", group="Proteins", form="Sliced", department="Meat", count=None, size="7 oz"),
            Item(name="Fresh Cosmic Crisp Apples, Each", category="Apples", group="Frutes/Vege.", form="Fresh", department="Produce", count=None, size="Each"),
            Item(name="Green Giant Fresh Washed & Trimmed Green Leaf Lettuce, 7 oz", category="Lettuce", group="Frutes/Vege.", form="Fresh", department="Produce", count=None, size="7 oz"),
            Item(name="Fresh Banana Fruit, Each", image_url="bananas.jpg",  category="Banana", group="Frutes/Vege.", form="Fresh", department="Produce", count=None, size="Each"),
            Item(name="Marketside Caesar Chopped Salad Kit, 8.8 oz Bag, Fresh", category="Salad", group="Frutes/Vege.", form="Kit", department="Produce", count=None, size="8.8 oz"),
            Item(name="Fresh Roma Tomato, Each", image_url="tomatos.jpg", category="Tomato", group="Frutes/Vege.", form="Fresh", department="Produce", count=None, size="Each"),
            Item(name="Fresh Green Leaf Lettuce, Each", category="Lettuce", group="Frutes/Vege.", form="Fresh", department="Produce", count=None, size="Each"),
            Item(name="De Wafelbakkers Chocolate Chip Pancakes, 33 oz, 24 Count Bag (Frozen)", category="Pancakes", group="Grains", form="Bag", department="Frozen", count=None, size="33 oz"),
            Item(name="Great Value Deli Style Wedges Seasoned Potatoes, 32 oz Bag (Frozen)", category="Potatoes", group="Frutes/Vege.", form="Wedges", department="Frozen", count=None, size="32 oz"),
            Item(name="Great Value Patties & Shredded Seasoned Potato Hash Brown", category="Potatoes", group="Frutes/Vege.", form="Hash", department="Frozen", count=None, size=None),
            Item(name="Great Value Frozen Whole Kernel Corn, 32 oz Steamable Bag", category="Corn", group="Frutes/Vege.", form="Bag", department="Frozen", count=None, size="32 oz"),
            Item(name="De Wafelbakkers Buttermilk Pancakes, 33 oz, 24 Count Bag (Frozen)", category="Pancakes", group="Grains", form="Bag", department="Frozen", count=None, size="33 oz"),
            Item(name="Great Value Frozen Corn on the Cob, 32 oz", category="Corn", group="Frutes/Vege.", form="Cob", department="Frozen", count=None, size="32 oz"),
            Item(name="Birds Eye Steamfresh Mixed Vegetables, 10 oz", category="Mixed Vegetables", group="Frutes/Vege.", form="Bag", department="Frozen", count=None, size="10 oz"),
            Item(name="Green Giant Steamers Broccoli, 10 oz", category="Broccoli", group="Frutes/Vege.", form="Bag", department="Frozen", count=None, size="10 oz"),
            Item(name="Hunt’s Diced Tomatoes with Basil, Garlic & Oregano, 14.5 oz Can", category="Canned Tomatoes", group="Others", form="Can", department="Pantry", count=None, size="14.5 oz"),
            Item(name="Great Value Cream of Mushroom Soup, 10.5 oz Can", category="Cream of Mushroom Soup", group="Others", form="Can", department="Pantry", count=None, size="10.5 oz"),
            Item(name="Campbell's Condensed Cream of Chicken Soup, 10.5 oz", category="Cream of Chicken Soup", group="Others", form="Can", department="Pantry", count=None, size="10.5 oz"),
            Item(name="Campbell’s Chunky Soup, 15.25 oz Can", category="Soup", group="Others", form="Can", department="Pantry", count=None, size="15.25 oz"),
            Item(name="Progresso Traditional Lentil Soup, 19 oz Can", category="Lentil Soup", group="Others", form="Can", department="Pantry", count=None, size="19 oz"),
            Item(name="Bush's Best Original Baked Beans, 28 oz Can", category="Baked Beans", group="Others", form="Can", department="Pantry", count=None, size="28 oz"),
            Item(name="Del Monte Whole Kernel Corn, 15 oz Can", category="Corn", group="Others", form="Can", department="Pantry", count=None, size="15 oz"),
            Item(name="Great Value 2% Reduced Fat Milk, Half Gallon", category="Milk", group="Dairy", form="Jug", department="Dairy", count=None, size="Half Gallon"),
            Item(name="Great Value Natural Crunchy Peanut Butter, 28 oz", category="Peanut Butter", group="Others", form="Jar", department="Pantry", count=None, size="28 oz"),
            Item(name="Kraft Original Barbecue Sauce, 18 oz", category="Barbecue Sauce", group="Condiments", form="Bottle", department="Condiments", count=None, size="18 oz"),
            Item(name="Great Value Ketchup, 38 oz", category="Ketchup", group="Condiments", form="Bottle", department="Condiments", count=None, size="38 oz"),
            Item(name="Great Value Mayonnaise, 30 oz", category="Mayonnaise", group="Condiments", form="Bottle", department="Condiments", count=None, size="30 oz"),
            Item(name="Great Value Salsa Medium, 24 oz", category="Salsa", group="Condiments", form="Jar", department="Condiments", count=None, size="24 oz"),
            Item(name="Great Value All-Purpose Flour, 5 lb", category="Flour", group="Others", form="Bag", department="Baking", count=None, size="5 lb"),
            Item(name="Great Value Cornmeal, 5 lb", category="Cornmeal", group="Others", form="Bag", department="Baking", count=None, size="5 lb"),
            Item(name="McCormick Onion Powder, 3.4 oz", category="Onion Powder", group="Spices", form="Bottle", department="Spices", count=None, size="3.4 oz"),
            Item(name="McCormick Ground Black Pepper, 2.5 oz", category="Black Pepper", group="Spices", form="Bottle", department="Spices", count=None, size="2.5 oz"),
            Item(name="McCormick Ground Cinnamon, 1.5 oz", category="Ground Cinnamon", group="Spices", form="Bottle", department="Spices", count=None, size="1.5 oz"),
            Item(name="McCormick Ground Ginger, 1.12 oz", category="Ground Ginger", group="Spices", form="Bottle", department="Spices", count=None, size="1.12 oz"),
            Item(name="McCormick Garlic Powder, 3.4 oz", category="Garlic Powder", group="Spices", form="Bottle", department="Spices", count=None, size="3.4 oz"),
            Item(name="Cajun Seasoning, 2.5 oz", category="Cajun Seasoning", group="Spices", form="Bottle", department="Spices", count=None, size="2.5 oz"),
            Item(name="McCormick Italian Seasoning, 0.5 oz", category="Italian Seasoning", group="Spices", form="Bottle", department="Spices", count=None, size="0.5 oz"),
            Item(name="McCormick Chili Powder, 2 oz", category="Chili Powder", group="Spices", form="Bottle", department="Spices", count=None, size="2 oz"),
            Item(name="Great Value Cooking Oil, 48 fl oz", category="Cooking Oil", group="Others", form="Bottle", department="Cooking", count=None, size="48 fl oz"),
            Item(name="Great Value Cooking Spray, 5 oz", category="Cooking Spray", group="Others", form="Can", department="Cooking", count=None, size="5 oz"),
            Item(name="Pasta, 16 oz", category="Pasta", group="Grains", form="Box", department="Pasta", count=None, size="16 oz"),
            Item(name="Kraft Macaroni and Cheese, 7.25 oz", category="Macaroni and Cheese", group="Grains", form="Box", department="Pasta", count=None, size="7.25 oz"),
            Item(name="Ronco Spaghetti, 16 oz", category="Spaghetti", group="Grains", form="Box", department="Pasta", count=None, size="16 oz"),
            Item(name="Great Value Green Beans, 14.5 oz", category="Green Beans", group="Frutes/Vege.", form="Can", department="Frozen", count=None, size="14.5 oz"),
            Item(name="Green Giant Fresh Broccoli, 12 oz", category="Broccoli", group="Frutes/Vege.", form="Fresh", department="Produce", count=None, size="12 oz"),
            Item(name="Great Value Potato Wedges, 32 oz", category="Potato Wedges", group="Frutes/Vege.", form="Bag", department="Frozen", count=None, size="32 oz"),
            Item(name="Great Value Blueberries, 12 oz", category="Blueberries", group="Frutes/Vege.", form="Bag", department="Frozen", count=None, size="12 oz"),
            Item(name="McCormick Chili Powder, 2 oz", category="Chili Powder", group="Spices", form="Bottle", department="Spices", count=None, size="2 oz"),

        ]

        db.session.add_all(stores)
        db.session.add_all(items)

        # Assuming prices are in cents and need to be converted to dollars
        item_prices = [
            ItemPrice(price=3.48, store=stores[0], item=items[0], created_at=datetime.now()),
            ItemPrice(price=3.24, store=stores[1], item=items[1], created_at=datetime.now()),
            ItemPrice(price=2.78, store=stores[1], item=items[2], created_at=datetime.now()),
            ItemPrice(price=1.87, store=stores[2], item=items[3], created_at=datetime.now()),
            ItemPrice(price=2.74, store=stores[3], item=items[4], created_at=datetime.now()),
            ItemPrice(price=8.17, store=stores[4], item=items[5], created_at=datetime.now()),
            ItemPrice(price=2.32, store=stores[4], item=items[6], created_at=datetime.now()),
            ItemPrice(price=3.54, store=stores[5], item=items[7], created_at=datetime.now()),
            ItemPrice(price=3.94, store=stores[5], item=items[8], created_at=datetime.now()),
            ItemPrice(price=5.48, store=stores[6], item=items[9], created_at=datetime.now()),
            ItemPrice(price=3.98, store=stores[6], item=items[10], created_at=datetime.now()),
            ItemPrice(price=4.96, store=stores[7], item=items[11], created_at=datetime.now()),
            ItemPrice(price=4.98, store=stores[7], item=items[12], created_at=datetime.now()),
            ItemPrice(price=14.44, store=stores[8], item=items[13], created_at=datetime.now()),
            ItemPrice(price=10.17, store=stores[8], item=items[14], created_at=datetime.now()),
            ItemPrice(price=1.97, store=stores[9], item=items[15], created_at=datetime.now()),
            ItemPrice(price=2.12, store=stores[9], item=items[16], created_at=datetime.now()),
            ItemPrice(price=2.88, store=stores[9], item=items[17], created_at=datetime.now()),
            ItemPrice(price=3.68, store=stores[9], item=items[18], created_at=datetime.now()),
            ItemPrice(price=3.20, store=stores[9], item=items[19], created_at=datetime.now()),
            ItemPrice(price=4.49, store=stores[9], item=items[20], created_at=datetime.now()),
            ItemPrice(price=4.49, store=stores[9], item=items[21], created_at=datetime.now()),
        ]

        db.session.add_all(item_prices)
        db.session.commit()

if __name__ == "__main__":
    seed_data()
