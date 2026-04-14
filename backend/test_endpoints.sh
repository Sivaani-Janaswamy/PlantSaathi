
#!/bin/bash

echo "=============================="
echo "🚀 ULTRA DEBUG MODE"
echo "=============================="

# ================== LOAD ENV ==================
echo "📦 Loading .env..."

if [ ! -f .env ]; then
  echo "❌ .env not found"
  exit 1
fi

export $(grep -v '^#' .env | xargs)

echo "✅ ENV LOADED"
echo "PORT=$PORT"
echo "SUPABASE_URL=$SUPABASE_URL"
echo "KEY=${SUPABASE_ANON_KEY:0:10}..."
echo

# ================== CONFIG ==================
API_URL="http://localhost:5000"
PLANT_ID="613dd95c-9ea0-47da-8da5-2803e4ef0d4b"
TEST_EMAIL="testuser@plantsaathi.com"
TEST_PASSWORD="TestUser123!"

echo "🌐 API_URL=$API_URL"
echo

# ================== SERVER CHECK ==================
echo "🔍 Checking backend..."

if ! curl -s --max-time 3 "$API_URL" > /dev/null; then
  echo "❌ Backend not responding on $API_URL"
  echo "👉 Start server: npm run dev"
  exit 1
fi

echo "✅ Backend is up"
echo

# ================== AUTH ==================
echo "🔐 Authenticating..."

LOGIN_RESP=$(curl -s --max-time 10 -X POST "$SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESP" | jq -r .access_token)

if [[ "$TOKEN" == "null" || -z "$TOKEN" ]]; then
  echo "⚠️ Creating user..."

  curl -s --max-time 10 -X POST "$SUPABASE_URL/auth/v1/signup" \
    -H "apikey: $SUPABASE_ANON_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" > /dev/null

  echo "🔁 Retrying login..."

  LOGIN_RESP=$(curl -s --max-time 10 -X POST "$SUPABASE_URL/auth/v1/token?grant_type=password" \
    -H "apikey: $SUPABASE_ANON_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

  TOKEN=$(echo "$LOGIN_RESP" | jq -r .access_token)
fi

if [[ "$TOKEN" == "null" || -z "$TOKEN" ]]; then
  echo "❌ AUTH FAILED"
  echo "$LOGIN_RESP"
  exit 1
fi

echo "✅ TOKEN READY"
echo "🔑 ${TOKEN}..."
echo

# ================== TEST RUNNER ==================
PASS=0
FAIL=0
TOTAL=0

run_test() {
  DESC="$1"
  EXPECT_STATUS="$2"
  EXPECT_MSG="$3"
  shift 3

  echo "------------------------------"
  echo "🧪 TEST: $DESC"

  ((TOTAL++))

  TMP=$(mktemp)

  # ⛔ timeout added (VERY IMPORTANT)
  STATUS=$(curl -s --max-time 8 -w "%{http_code}" -o "$TMP" "$@" || echo "000")

  BODY=$(cat "$TMP")
  rm "$TMP"

  echo "📊 STATUS: $STATUS"
  echo "📥 BODY:"
  echo "$BODY"
  echo

  # Detect hang / timeout
  if [[ "$STATUS" == "000" ]]; then
    echo "❌ FAIL (Request timeout / server not responding)"
    ((FAIL++))
    return
  fi

  if [[ "$STATUS" == "$EXPECT_STATUS" && "$BODY" == *"$EXPECT_MSG"* ]]; then
    echo "✅ PASS"
    ((PASS++))
  else
    echo "❌ FAIL (Expected $EXPECT_STATUS + '$EXPECT_MSG')"
    ((FAIL++))
  fi

  echo
}

# ================== TESTS ==================
echo "📌 Running tests..."
echo

# --- AI ---
run_test "AI ask (valid)" 200 "answer" \
  -X POST "$API_URL/ai/ask" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question":"How to care for a rose plant?"}'

run_test "AI ask (no token)" 401 "Unauthorized" \
  -X POST "$API_URL/ai/ask" \
  -H "Content-Type: application/json" \
  -d '{"question":"How to care for a rose plant?"}'

# --- PLANTS ---
run_test "Plants search" 200 "plants" \
  -X GET "$API_URL/plants/search?q=rose"

run_test "Plant by ID" 200 "data" \
  -X GET "$API_URL/plants/$PLANT_ID"

# --- FAVORITES ---
run_test "Favorites (auth)" 200 "data" \
  -X GET "$API_URL/favorites" \
  -H "Authorization: Bearer $TOKEN"

# ================== SUMMARY ==================
echo "=============================="
echo "📊 FINAL RESULT"
echo "=============================="
echo "✅ Passed: $PASS / $TOTAL"
echo "❌ Failed: $FAIL / $TOTAL"
echo "=============================="