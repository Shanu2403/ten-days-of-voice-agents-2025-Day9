
import json
import os
import uuid
from datetime import datetime
from typing import List, Dict, Optional, Annotated
from src.blinkit_catalog import PRODUCTS

ORDERS_FILE = "orders.json"

def _load_orders() -> List[Dict]:
    if not os.path.exists(ORDERS_FILE):
        return []
    try:
        with open(ORDERS_FILE, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def _save_orders(orders: List[Dict]):
    with open(ORDERS_FILE, "w") as f:
        json.dump(orders, f, indent=2)

# User Context for Personalization
user_context = {
    "diet": [], # e.g., "vegan", "gluten-free"
    "likes": [], # e.g., "spicy", "sweet"
}

def update_user_context(key: str, value: str):
    """Updates the user's context/preferences."""
    if key in user_context:
        if value not in user_context[key]:
            user_context[key].append(value)

def get_product_tags(p):
    """Generates a 'vector' of tags for a product."""
    name_lower = p["name"].lower()
    cat_lower = p["category"].lower()
    
    tags = set(name_lower.split())
    tags.add(cat_lower)
    
    # Add synonyms based on category/name substrings
    if "milk" in name_lower or "dairy" in cat_lower: tags.update(["calcium", "white", "liquid", "cow", "milk"])
    if "curd" in name_lower: tags.update(["yogurt", "probiotic", "dahi"])
    if "paneer" in name_lower: tags.update(["cheese", "protein", "soft"])
    if "bread" in name_lower or "bakery" in cat_lower: tags.update(["toast", "sandwich", "wheat", "loaf", "bread"])
    if "chips" in name_lower or "snacks" in cat_lower: tags.update(["snack", "crunchy", "salty", "junk", "munchies", "chips"])
    if "coca-cola" in name_lower or "coke" in name_lower: tags.update(["soda", "fizzy", "drink", "beverage", "cold", "coke"])
    if "vegetable" in cat_lower: tags.update(["healthy", "cooking", "fresh", "green", "vegetable"])
    
    return tags

def calculate_score(query_tokens, product_tags):
    """Calculates a simple Jaccard/Overlap score."""
    intersection = len(query_tokens.intersection(product_tags))
    if intersection == 0: return 0
    return intersection / len(query_tokens.union(product_tags)) # Jaccard Index

def list_products(
    query: Annotated[str, "The search query or category name"] = "",
) -> List[Dict]:
    """
    Smart Search: Uses tag-based scoring (Vector-lite) and Personalization.
    """
    query = query.lower().strip()
    if not query:
        return PRODUCTS

    query_tokens = set(query.split())
    
    scored_products = []
    
    for p in PRODUCTS:
        # 1. Personalization Filter
        # If user is vegan, skip dairy (unless explicitly asked for)
        if "vegan" in user_context["diet"] and p["category"].lower() in ["dairy", "bakery"] and "milk" not in query:
            continue
            
        # 2. Vector-lite Scoring
        tags = get_product_tags(p)
        score = calculate_score(query_tokens, tags)
        
        # Boost for exact substring match
        if query in p["name"].lower():
            score += 1.0
            
        if score > 0.1: # Threshold
            scored_products.append((score, p))
            
    # Sort by score desc
    scored_products.sort(key=lambda x: x[0], reverse=True)
    
    return [p for _, p in scored_products]

def create_order(
    items: Annotated[List[Dict], "List of items to order. Each item must have 'product_id' and 'quantity'."]
) -> Dict:
    """
    Create a new order for the specified items.
    Calculates total, generates ID, and saves to orders.json.
    """
    order_id = f"BLK-{uuid.uuid4().hex[:8].upper()}"
    order_items = []
    total_amount = 0
    currency = "INR"

    for item in items:
        product_id = item.get("product_id")
        quantity = item.get("quantity", 1)
        
        # Find product
        product = next((p for p in PRODUCTS if p["id"] == product_id), None)
        if product:
            item_total = product["price"] * quantity
            total_amount += item_total
            order_items.append({
                "product_id": product_id,
                "name": product["name"],
                "price": product["price"],
                "quantity": quantity,
                "item_total": item_total
            })
            currency = product["currency"]

    order = {
        "id": order_id,
        "items": order_items,
        "total_amount": total_amount,
        "currency": currency,
        "created_at": datetime.now().isoformat(),
        "status": "placed"
    }

    orders = _load_orders()
    orders.append(order)
    _save_orders(orders)

    return order

def get_last_order() -> Annotated[Dict | None, "Returns the most recent order details"]:
    """
    Retrieve the details of the last placed order.
    Useful for 'What did I just buy?' queries.
    """
    orders = _load_orders()
    if not orders:
        return None
    return orders[-1]
