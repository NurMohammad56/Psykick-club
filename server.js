import express from 'express';
import { dbconfig } from './src/db/index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the server');
});

// Import routes
import userRoute from './src/route/user.route.js';
import profileRoute from './src/route/profile.route.js';
import adminRoute from './src/route/admin.route.js'

// set 
app.use('/api/v1/user', userRoute);
app.use('/api/v1/profile', profileRoute);
app.use('/api/v1/admin', adminRoute);

// Start server
app.listen(PORT, async () => {
  try {
    await dbconfig();
    console.log(`Server is running at http://localhost:${PORT}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
});
