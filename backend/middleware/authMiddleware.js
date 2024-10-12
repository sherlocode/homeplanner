const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,  // Ensure this matches your Google OAuth client ID
    });

    const payload = ticket.getPayload();
    req.user = {
      userId: payload['sub'],  // Google user ID
      email: payload['email'],
      name: payload['name'],
      picture: payload['picture'],
    };

    next();  // Proceed to the next middleware or the route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired Google ID Token' });
  }
};

module.exports = verifyGoogleToken;
