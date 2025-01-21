require('dotenv').config(); // enables loading .env vars
const jwt = require('jsonwebtoken');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();

// Allow requests from client-side (updated CORS config)
app.use(cors({
  origin: 'http://localhost:5173', // Match your frontend's origin
  methods: ['GET', 'POST'], // Allowed HTTP methods
  credentials: true // Include this if your frontend uses cookies or Authorization headers
}));
app.options('*', cors()); // Handle preflight requests

// JWKS endpoint
app.post('/.well-known/jwks.json', (req, res) => {
  try {
    const jwks = {
      keys: [
        {
          kty: 'RSA',
          n: 'uIh0pFx89-g64cYvlQ75sw1Nmg2Z5XIXOD0mMhdnEeSgB2rBw74fuUnAIybjFdwHvLsyTfznWk65gKJ8Gp5KFdlP79qYcv1Wu01YpBEZrrBGyEHkra_BIHKNGMR3c7xCwXo4598CXr_7OdtApjNY-HiGUgVWq6UOjBzwvcxua33KxULLwAmX7ELfEEnrUaQtc_nC_shtdKuMjmykotY_F9FT3xzcAnkXDr3u4Y3wNRoZJFBa8dwSlCscfo3mXOGh56b_OsJTwvO1D2_s_x0MtqykC1aehcJDenu2jrF9jSqFM-6kiEiNxdg6bca_KJ53Az8Iveb_K60v4fMij0HySQ',
          e: 'AQAB',
          ext: true,
          kid: 'bac2586ababe9f4c8fe0d171593d',
          alg: 'RS256',
          use: 'sig'
        }
      ]
    };
    res.json(jwks);
  } catch (error) {
    console.error('Error serving JWKS:', error);
    res.status(500).json({ error: error.message });
  }
});

// Token endpoint to generate JWT
app.post('/api/token', async (req, res) => {
  try {
    const privateKey = fs.readFileSync('privateKey.pem');
    const token = jwt.sign(
      {
        sub: '9fcd68c4-af50-4dd7-adf6-abd12a13cb32',
        name: 'Shlok Verma',
        email: 'shlok@web3auth.io',
        aud: 'urn:api-web3auth-io',
        iss: 'https://web3auth.io',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      privateKey,
      { algorithm: 'RS256', keyid: 'bac2586ababe9f4c8fe0d171593d' }
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const listener = app.listen(process.env.PORT || 8080, () =>
  console.log('Listening on port ' + listener.address().port)
);
