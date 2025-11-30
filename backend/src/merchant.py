import json
import logging
from pathlib import Path
from typing import List, Dict, Optional, Any
from .order_manager import OrderManager
from .cart import Cart

logger = logging.getLogger("merchant")

# Load catalog
CATALOG_PATH = Path(__file__).parent / "catalog.json"
try:
    with open(CATALOG_PATH, "r") as f:
        PRODUCTS = json.load(f)
except Exception as e:
    logger.error(f"Failed to load catalog: {e}")
    PRODUCTS = []

order_manager = OrderManager()

def list_products(filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """
    List products from the catalog, optionally filtered by category, price, etc.
    
    Args:
        filters: A dictionary of filters. Supported keys:
            - category (str): Filter by category (exact match).
            - max_price (float): Filter by maximum price.
            - min_price (float): Filter by minimum price.
            - color (str): Filter by color (in attributes).
            - search (str): Search in name or description.
            
    Returns:
        List of product dictionaries.
    """
    results = PRODUCTS
    
    if not filters:
        return results

    filtered_results = []
    for product in results:
        match = True
        
        # Category filter
        if "category" in filters and filters["category"]:
            if product.get("category", "").lower() != filters["category"].lower():
                match = False
        
        # Price filters
        if match and "max_price" in filters:
            if product.get("price", 0) > filters["max_price"]:
                match = False
        
        if match and "min_price" in filters:
            if product.get("price", 0) < filters["min_price"]:
                match = False
                
        # Attribute filters (e.g., color)
        if match and "color" in filters and filters["color"]:
            prod_color = product.get("attributes", {}).get("color", "").lower()
            if filters["color"].lower() not in prod_color:
                match = False

        # Search filter
        if match and "search" in filters and filters["search"]:
            query = filters["search"].lower()
            name = product.get("name", "").lower()
            desc = product.get("description", "").lower()
            if query not in name and query not in desc:
                match = False
        
        if match:
            filtered_results.append(product)
            
    return filtered_results

def get_product_by_id(product_id: str) -> Optional[Dict[str, Any]]:
    for p in PRODUCTS:
        if p["id"] == product_id:
            return p
    return None

def create_order(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Create an order from a list of items.
    
    Args:
        items: List of dicts with keys:
            - product_id (str)
            - quantity (int)
            - options (dict, optional) - e.g. size, color if overriding
            
    Returns:
        Dict containing order details including order_id.
    """
    cart = Cart()
    
    for item in items:
        product_id = item.get("product_id")
        try:
            quantity = int(item.get("quantity", 1))
        except ValueError:
            quantity = 1
        
        product = get_product_by_id(product_id)
        if product:
            # Construct notes from options if present
            notes = ""
            if "options" in item and item["options"]:
                notes = ", ".join([f"{k}: {v}" for k, v in item["options"].items()])
            
            cart.add_item(
                item_id=product_id,
                name=product["name"],
                price=product["price"],
                quantity=quantity,
                notes=notes
            )
        else:
            logger.warning(f"Product ID {product_id} not found.")

    if not cart.items:
        return {"error": "No valid items in order."}

    order_id = order_manager.place_order(cart)
    order_details = order_manager.get_order(order_id)
    
    return order_details

def get_last_order() -> Optional[Dict[str, Any]]:
    """
    Retrieves the most recently created order from the orders directory.
    This is a simple implementation that looks at file timestamps.
    """
    try:
        files = list(Path(order_manager.orders_dir).glob("*.json"))
        if not files:
            return None
        
        # Sort by modification time, newest first
        files.sort(key=lambda x: x.stat().st_mtime, reverse=True)
        
        last_order_file = files[0]
        with open(last_order_file, "r") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error getting last order: {e}")
        return None
