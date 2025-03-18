import express from 'express';
import { dbconfig } from './src/db/index.js';
import dotenv from 'dotenv';
import errorHandler from './src/middleware/errorHandler.middleware.js'
import { notFoundHandler } from './src/middleware/notFoundHandler.middleware.js';

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
import categoryImageRoute from "./src/route/categoryImage.route.js"
import ARVTargetRoute from "./src/route/ARVTarget.route.js"
import privacyPolicyRoute from './src/route/privacyPolicy.route.js';

// set 
app.use('/api/v1/user', userRoute);
app.use('/api/v1/profile', profileRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/category', categoryImageRoute);
app.use('/api/v1/ARVTarget', ARVTargetRoute);
app.use('/api/v1/privacy-policy', privacyPolicyRoute);

// not found route handler middleware
app.use(notFoundHandler)

//error handler middleware
app.use(errorHandler);

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
