#!/bin/bash

# Test script to verify all endpoints are working
# Usage: ./test-endpoints.sh YOUR_AUTH_TOKEN

BASE_URL="http://localhost:3001"
TOKEN="$1"

if [ -z "$TOKEN" ]; then
    echo "❌ Error: Please provide authentication token"
    echo "Usage: ./test-endpoints.sh YOUR_AUTH_TOKEN"
    exit 1
fi

echo "🧪 Testing FireDesk API Endpoints"
echo "================================="
echo ""

# Test Plants endpoint
echo "1️⃣  Testing GET /plant..."
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/plant" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$status_code" -eq 200 ]; then
    plant_count=$(echo "$body" | grep -o '"plants":\[' | wc -l)
    echo "   ✅ Status: $status_code"
    echo "   📊 Response: $(echo "$body" | head -c 200)..."
else
    echo "   ❌ Status: $status_code"
    echo "   ⚠️  Response: $body"
fi
echo ""

# Test Plants for Manager/Technician assignment
echo "2️⃣  Testing GET /plants..."
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/plants" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")
status_code=$(echo "$response" | tail -n1)

if [ "$status_code" -eq 200 ]; then
    echo "   ✅ Status: $status_code"
else
    echo "   ❌ Status: $status_code"
fi
echo ""

# Test Manager endpoint
echo "3️⃣  Testing GET /manager..."
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/manager" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")
status_code=$(echo "$response" | tail -n1)

if [ "$status_code" -eq 200 ]; then
    echo "   ✅ Status: $status_code"
else
    echo "   ❌ Status: $status_code"
fi
echo ""

# Test Technician endpoint
echo "4️⃣  Testing GET /technician..."
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/technician" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")
status_code=$(echo "$response" | tail -n1)

if [ "$status_code" -eq 200 ]; then
    echo "   ✅ Status: $status_code"
else
    echo "   ❌ Status: $status_code"
fi
echo ""

# Test Industry endpoint (for dashboard stats)
echo "5️⃣  Testing GET /industry..."
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/industry" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")
status_code=$(echo "$response" | tail -n1)

if [ "$status_code" -eq 200 ]; then
    echo "   ✅ Status: $status_code"
else
    echo "   ❌ Status: $status_code"
fi
echo ""

echo "================================="
echo "✅ Test completed!"
echo ""
echo "📝 Note: If you see ❌ errors, check:"
echo "   1. Backend server is running (port 3001)"
echo "   2. Database is connected"
echo "   3. Authentication token is valid"
echo "   4. User has proper permissions"
