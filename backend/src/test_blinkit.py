
import os
import json
from src import blinkit_merchant

def test_blinkit_merchant():
    print("Testing Blinkit Merchant...")
    
    # 1. Test List Products (Semantic & Personalized)
    print("\n1. Testing list_products (Semantic & Personalized)...")
    
    # Test 1: Synonym "fizzy" -> Coke
    fizzy = blinkit_merchant.list_products("fizzy")
    print(f"Query 'fizzy' found: {[p['name'] for p in fizzy]}")
    assert any("Coca-Cola" in p["name"] for p in fizzy)

    # Test 2: Personalization (Vegan)
    print("   Setting context: Diet = Vegan")
    blinkit_merchant.update_user_context("diet", "vegan")
    
    # Should NOT find Milk (Dairy) even if we search for "calcium" (which maps to milk)
    # Wait, if I search "milk" explicitly it might show up due to the "milk not in query" check.
    # Let's search for "calcium" which maps to milk tags.
    calcium = blinkit_merchant.list_products("calcium")
    print(f"Query 'calcium' (Vegan) found: {[p['name'] for p in calcium]}")
    # Ensure no dairy products are returned
    assert not any(p["category"] == "Dairy" for p in calcium)
    
    # Reset context for other tests
    blinkit_merchant.user_context["diet"] = []
    
    # 2. Test Create Order
    print("\n2. Testing create_order...")
    items = [
        {"product_id": "dairy-001", "quantity": 2}, # 2x Amul Milk (27*2 = 54)
        {"product_id": "bakery-001", "quantity": 1} # 1x Bread (45)
    ]
    order = blinkit_merchant.create_order(items)
    print(f"Order Created: {order['id']}, Total: {order['total_amount']}")
    assert order["total_amount"] == 99
    
    # 3. Test Persistence
    print("\n3. Testing Persistence...")
    with open("orders.json", "r") as f:
        orders = json.load(f)
        last_order = orders[-1]
        print(f"Last Order from JSON: {last_order['id']}")
        assert last_order["id"] == order["id"]
        
    # 4. Test Get Last Order
    print("\n4. Testing get_last_order...")
    fetched_order = blinkit_merchant.get_last_order()
    print(f"Fetched Order: {fetched_order['id']}")
    assert fetched_order["id"] == order["id"]

    print("\n✅ All Blinkit Tests Passed!")

if __name__ == "__main__":
    # Clean up previous test
    if os.path.exists("orders.json"):
        os.remove("orders.json")
    test_blinkit_merchant()
