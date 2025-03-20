import express from 'express';
import { dbconfig } from './src/db/index.js';
import dotenv from 'dotenv';
import errorHandler from './src/middleware/errorHandler.middleware.js'
import { notFoundHandler } from './src/middleware/notFoundHandler.middleware.js';
import passport from 'passport';
import session from 'express-session';

dotenv.config();

const app = express();

// Passport Session Setup
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


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
import TMCTargetRoute from "./src/route/TMCTarget.route.js"
import userSubmissionTMCRoute from "./src/route/userSubmissionTMC.route.js"
import termsCondition from "./src/route/termsCondition.route.js";
import aboutUsRoute from "./src/route/aboutUs.route.js";
import OAuthRoute from "./src/route/OAuth.route.js"
import contactUsRoute from "./src/route/contactUs.route.js"

// set 
app.use('/api/v1/user', userRoute);
app.use('/api/v1/profile', profileRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/category', categoryImageRoute);
app.use('/api/v1/ARVTarget', ARVTargetRoute);
app.use('/api/v1/privacy-policy', privacyPolicyRoute);
app.use('/api/v1/TMCTarget', TMCTargetRoute);
app.use('/api/v1/userSubmissionTMC', userSubmissionTMCRoute);
app.use('/api/v1/terms-and-condition', termsCondition);
app.use('/api/v1/about-us', aboutUsRoute);
app.use('/api/v1', OAuthRoute);
app.use('/api/v1', contactUsRoute);


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
