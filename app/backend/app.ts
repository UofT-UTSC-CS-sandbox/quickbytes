import express from 'express';
const cors = require('cors');
import verifyToken from './middleware/verifyToken';
import * as dotenv from 'dotenv';
dotenv.config();

// Create an Express application
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/protected', verifyToken, (req, res) => {
  res.send('This is a protected route');
});

app.get('/confidential', verifyToken, (req, res) => {
  if (req.user) {
    res.send({ secret: 'This is confidential data' });
  } else {
    res.status(401).send('Unauthorized');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});