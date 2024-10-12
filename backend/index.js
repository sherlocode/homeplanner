const express = require('express');
const verifyGoogleToken = require('./middleware/authMiddleware');

const app = express();

// Protected route example
app.get('/api/protected', verifyGoogleToken, (req, res) => {
  res.status(200).json({
    message: 'You have access to this protected route!',
    user: req.user,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
