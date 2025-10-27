const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const JWT_SECRET = 'your_secret_key';

const sampleUser = {
  username: 'testuser',
  password: 'password123',
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === sampleUser.username && password === sampleUser.password) {
    const payload = { username: sampleUser.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ message: 'Login successful', token });
  }
  res.status(401).json({ message: 'Invalid username or password' });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you have access to this protected route!` });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
