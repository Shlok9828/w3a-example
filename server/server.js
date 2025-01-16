require('dotenv').config(); // enables loading .env vars
const jwt = require('jsonwebtoken');
const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');

// Allow requests from client-side
app.use(cors({ origin: 'http://localhost:3000' }));

// JWKS endpoint
app.post('/.well-known/jwks.json', (req, res) => {
  try {
    // Here, manually specify the JWKS fields as per your required format
    const jwks = {
      keys: [
        {
          kty: 'RSA',
          n: 'w_KFYDlDMpFHuIeqHkUyu0JNBgRbwtNpyyKk7tjqdfwIZ60IDJCnYg6Iki6lGF5LNyWH_Sjd4g0sc1LSbEEQxP4sjOnd1SudjFbZPARJf9q0I2DM-Inn6GKO4PE-6MHRSJ1GPUV_k3D3XVPRwz-2CKHd78Fmg2gc3e4X585MmjNdykhXHATfO5zW4d3gMcdCVwQtIOxYeUPWZkomkZ8fQr1IO6njjjMg7kXNWs2z3fKt2iF2U5JY1AxW5vzFF817yUh3hB2p-qVsBqiR4mZKXEw8YKP1ulUV_yRRchhZcchH_swftfKdZivRRtx2sdZGatUVKF0nBYt4FA1hH3B2zQ',
          e: 'AQAB',
          ext: true,
          kid: '89ce3598c473af1bda4bff95e6c8736450206fba',
          alg: 'RS256',
          use: 'sig'
        }
      ]
    };

    // Send the JWKS response
    res.json(jwks);
  } catch (error) {
    console.error('Error serving JWKS:', error);
    res.status(500).json({ error: error.message });
  }
});

// Token endpoint to generate JWT
app.post('/api/token', async (req, res) => {
  try {
    var privateKey = fs.readFileSync('privateKey.pem');
    var token = jwt.sign(
      {
        sub: '9fcd68c4-af50-4dd7-adf6-abd12a13cb32',
        name: 'Yashovardhan Agrawal',
        email: 'yash@web3auth.io',
        aud: 'urn:api-web3auth-io',
        iss: 'https://web3auth.io',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      privateKey,
      { algorithm: 'RS256', keyid: '89ce3598c473af1bda4bff95e6c8736450206fba' }
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
