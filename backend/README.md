# NourishNet Backend - AI-Powered NGO Matching

Lightweight Node.js backend with Google Gemini AI integration for intelligent food donation matching.

## Features

- **GET /ngos** - Fetch all available NGOs
- **POST /match-ngo** - AI-powered NGO recommendation based on:
  - Food type and quantity
  - Expiry time (urgency)
  - Distance to NGO
  - Food preference compatibility
  - NGO capacity and urgency level

## Setup

### 1. Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

Or set it directly when running:
```bash
GEMINI_API_KEY=your_key node server.js
```

### 3. Start Server

```bash
node server.js
```

Server runs on `http://localhost:3000`

## API Usage

### Get All NGOs

```bash
curl http://localhost:3000/ngos
```

### Match NGO with AI

```bash
curl -X POST http://localhost:3000/match-ngo \
  -H "Content-Type: application/json" \
  -d '{
    "foodType": "Biryani & Curry",
    "quantity": "20 kg",
    "quantityKg": 20,
    "expiryHours": 4,
    "foodPreference": "Any"
  }'
```

**Response:**
```json
{
  "recommendedNGO": {
    "id": 1,
    "name": "Hope Foundation",
    "score": 95
  },
  "reasoning": "Hope Foundation is the best match due to high urgency, close proximity (2.3 km), and capacity to serve 120 people.",
  "alternatives": [
    {"id": 2, "name": "Care for Kids", "score": 88},
    {"id": 4, "name": "Street Angels NGO", "score": 82}
  ]
}
```

## Integration with Frontend

Add this to your hotel dashboard:

```javascript
async function getAIRecommendation() {
  const donationData = {
    foodType: document.getElementById('foodType').value,
    quantity: document.getElementById('quantity').value,
    quantityKg: parseFloat(document.getElementById('quantityKg').value),
    expiryHours: parseInt(document.getElementById('expiryHours').value),
    foodPreference: document.getElementById('foodPreference').value
  };

  const response = await fetch('http://localhost:3000/match-ngo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donationData)
  });

  const result = await response.json();
  console.log('AI Recommendation:', result);
  
  // Display recommendation to user
  displayRecommendation(result);
}
```

## How It Works

1. **Data Collection**: Frontend sends donation details (food type, quantity, expiry)
2. **AI Analysis**: Google Gemini analyzes donation against all NGOs using:
   - Urgency matching (high urgency + short expiry = priority)
   - Distance optimization (closer NGOs ranked higher)
   - Food preference compatibility
   - Capacity matching (NGO need vs available quantity)
3. **Smart Ranking**: Returns top recommendation + alternatives with scores
4. **Reasoning**: Provides explanation for the match

## No Dependencies

Pure Node.js with built-in modules only:
- `http` - Web server
- `https` - Google API calls
- `fs` - File operations
- `url` - URL parsing

## Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key (required)
- `PORT` - Server port (default: 3000)

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `404` - Endpoint not found
- `500` - Server error (check API key or network)

## CORS

CORS is enabled for all origins, allowing frontend integration from any domain.
