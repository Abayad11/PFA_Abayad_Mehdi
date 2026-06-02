import requests

# Test health
print("=== Test Health AI Inference ===")
r = requests.get("http://localhost:8001/health")
print(r.json())

print("\n=== Test Health LLM ===")
r = requests.get("http://localhost:8000/health")
print(r.json())
