const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';
const ngos = JSON.parse(fs.readFileSync(path.join(__dirname, 'ngos.json'), 'utf-8'));

// Helper to parse request body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// Call Google Gemini API
function callGeminiAPI(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.candidates && response.candidates[0]) {
            resolve(response.candidates[0].content.parts[0].text);
          } else {
            reject(new Error('Invalid Gemini response'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);

  if (req.method === 'GET' && parsedUrl.pathname === '/ngos') {
    res.writeHead(200);
    res.end(JSON.stringify(ngos));
  } 
  else if (req.method === 'POST' && parsedUrl.pathname === '/match-ngo') {
    try {
      const body = await parseBody(req);
      const { foodType, quantity, quantityKg, expiryHours, foodPreference } = body;

      // Build AI prompt
      const prompt = `You are an AI assistant for a food donation platform. Analyze the following donation and NGO data to recommend the best NGO match.

DONATION DETAILS:
- Food Type: ${foodType}
- Quantity: ${quantity} (${quantityKg} kg)
- Expires in: ${expiryHours} hours
- Food Preference: ${foodPreference || 'Any'}

AVAILABLE NGOs:
${ngos.map((ngo, i) => `${i + 1}. ${ngo.name}
   - Distance: ${ngo.distance} km
   - Need: ${ngo.need} people
   - Urgency: ${ngo.urgency}
   - Food Preference: ${ngo.foodPreference}`).join('\n\n')}

MATCHING CRITERIA:
1. Urgency level (High urgency NGOs get priority if food expires soon)
2. Distance (closer is better for quick delivery)
3. Food preference compatibility (Veg/Non-veg/Any)
4. Quantity match (NGO need vs available food)

Respond ONLY with valid JSON in this exact format:
{
  "recommendedNGO": {
    "id": <ngo_id>,
    "name": "<ngo_name>",
    "score": <0-100>
  },
  "reasoning": "<brief explanation>",
  "alternatives": [
    {"id": <id>, "name": "<name>", "score": <0-100>}
  ]
}`;

      const aiResponse = await callGeminiAPI(prompt);
      
      // Extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        res.writeHead(200);
        res.end(JSON.stringify(result));
      } else {
        throw new Error('Could not parse AI response');
      }
    } catch (error) {
      console.error('Match NGO error:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  }
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`NourishNet backend running at http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  GET  /ngos       - List all NGOs`);
  console.log(`  POST /match-ngo  - AI-powered NGO matching`);
});
