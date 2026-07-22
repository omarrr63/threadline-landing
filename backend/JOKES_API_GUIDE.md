# Joke Generator API Routes

## Endpoints

### 1. Get Random Joke (API Ninjas)
```
GET /api/jokes/random
```

**Response:**
```json
{
  "success": true,
  "joke": "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "source": "API Ninjas"
}
```

---

### 2. Get Joke by Category (API Ninjas)
```
GET /api/jokes/category/:category
```

**Categories:** `general`, `programming`, `knock-knock`

**Example:**
```
GET /api/jokes/category/programming
```

**Response:**
```json
{
  "success": true,
  "category": "programming",
  "joke": "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
  "source": "API Ninjas"
}
```

---

### 3. Get Multiple Random Jokes (API Ninjas)
```
GET /api/jokes/multiple/:count
```

**Parameters:**
- `count` (optional, max 20): Number of jokes to fetch

**Example:**
```
GET /api/jokes/multiple/5
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "jokes": [
    "Joke 1...",
    "Joke 2...",
    "Joke 3...",
    "Joke 4...",
    "Joke 5..."
  ],
  "source": "API Ninjas"
}
```

---

### 4. Get Random Joke (JokeAPI - No Key Required)
```
GET /api/jokes/alternative/random
```

**Response:**
```json
{
  "success": true,
  "joke": "Why did the programmer quit his job? Because he didn't get arrays.\n\nBecause he got arrays!",
  "type": "twopart",
  "category": "Programming",
  "source": "JokeAPI"
}
```

---

### 5. Get Joke by Category (JokeAPI - No Key Required)
```
GET /api/jokes/alternative/category/:category
```

**Categories:** `general`, `programming`, `knock-knock`, `coding`, `misc`

**Example:**
```
GET /api/jokes/alternative/category/programming
```

**Response:**
```json
{
  "success": true,
  "joke": "A SQL query walks into a bar, walks up to two tables and asks in a quiet voice... 'Can I join you?'",
  "type": "single",
  "category": "Programming",
  "source": "JokeAPI"
}
```

---

## Setup

### Option 1: Using API Ninjas (Requires API Key)

1. Sign up at [api-ninjas.com](https://api-ninjas.com/)
2. Get your free API key
3. Add to `.env`:
```
JOKES_API_KEY=your_api_key_here
```

### Option 2: Using JokeAPI (No Key Required)

Just use the `/alternative/` endpoints - no setup needed!

---

## Usage Examples

### JavaScript/Fetch
```javascript
// Get random joke
fetch('http://localhost:5000/api/jokes/random')
  .then(res => res.json())
  .then(data => console.log(data.joke));

// Get programming joke
fetch('http://localhost:5000/api/jokes/category/programming')
  .then(res => res.json())
  .then(data => console.log(data.joke));

// Get 5 jokes
fetch('http://localhost:5000/api/jokes/multiple/5')
  .then(res => res.json())
  .then(data => console.log(data.jokes));

// Alternative without key
fetch('http://localhost:5000/api/jokes/alternative/random')
  .then(res => res.json())
  .then(data => console.log(data.joke));
```

### cURL
```bash
# Random joke
curl http://localhost:5000/api/jokes/random

# Programming joke
curl http://localhost:5000/api/jokes/category/programming

# 5 jokes
curl http://localhost:5000/api/jokes/multiple/5

# Alternative random
curl http://localhost:5000/api/jokes/alternative/random
```

---

## APIs Used

1. **API Ninjas** - https://api-ninjas.com/api/jokes
   - Requires free API key
   - Multiple categories
   - Reliable & fast

2. **JokeAPI** - https://jokeapi.dev/
   - Free, no key required
   - Multiple joke types (single & two-part)
   - Wide variety of categories

---

## Error Handling

**Invalid Category:**
```json
{
  "error": "Invalid category. Valid categories are: general, programming, knock-knock"
}
```

**API Error:**
```json
{
  "error": "Failed to fetch joke"
}
```
