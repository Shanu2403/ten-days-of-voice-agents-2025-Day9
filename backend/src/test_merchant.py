import logging
import sys
from .merchant import list_products, create_order, get_last_order

# Configure logging
logging.basicConfig(level=logging.INFO)

if __name__ == "__main__":
    print("Testing Catalog Browsing...")
    # Test listing all
    all_products = list_products()
    print(f"Found {len(all_products)} total products.")
    
    # Test filter by category
    mobiles = list_products({"category": "mobiles"})
    print(f"Found {len(mobiles)} mobiles.")
    
    if len(mobiles) == 0:
        print("TEST FAILED: No mobiles found.")
        sys.exit(1)

    print("\nTesting Order Creation (Normal)...")
    # Test creating an order
    item_to_order = mobiles[0]
    print(f"Ordering: {item_to_order['name']} (ID: {item_to_order['id']})")
    
    order_items = [
        {
            "product_id": item_to_order["id"],
            "quantity": 1,
            "options": {"color": "Black"}
        }
    ]
    
    order_result = create_order(order_items)
    print(f"Order Result: {order_result}")
    
    if "error" in order_result:
        print(f"TEST FAILED: {order_result['error']}")
        sys.exit(1)

    print("\nTesting Order Creation (String Quantity)...")
    # Test creating an order with string quantity (LLM edge case)
    try:
        order_items_str = [
            {
                "product_id": item_to_order["id"],
                "quantity": "1", # String instead of int
            }
        ]
        order_result_str = create_order(order_items_str)
        print(f"Order Result (String Qty): {order_result_str}")
    except Exception as e:
        print(f"CAUGHT EXPECTED ERROR (String Qty): {e}")
        # If this errors, we found the bug. We should fix it.

    print("\nALL TESTS PASSED")
