import express from 'express';
import { dbconfig } from './db/index';
import dotenv from 'dotenv';
import userRoute from './route/user.route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());



app.get('/', (req, res) => {
  res.send('Welcome to the server');
});

// Routes
app.use('/api/v1/user', userRoute);

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
