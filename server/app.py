# app.py

from config import app, db, api
import routes  # Import routes to register them

if __name__ == "__main__":
    app.run(port=3001, debug=True)
