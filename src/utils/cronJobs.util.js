import { User } from "../model/user.model.js";

import cron from 'node-cron';

const checkInactiveUsers = async () => {
  const inactiveThreshold = 10 * 60 * 1000; // 10 minutes
  try {
    const inactiveUsers = await User.find({
      lastActive: { $lt: new Date(Date.now() - inactiveThreshold) },
      'sessions.sessionEndTime': { $exists: false }
    });

    const bulkOps = inactiveUsers.map(user => ({
      updateOne: {
        filter: { 
          _id: user._id,
          'sessions.sessionEndTime': { $exists: false }
        },
        update: {
          $set: {
            'sessions.$[elem].sessionEndTime': new Date(),
            'sessions.$[elem].duration': 
              new Date() - user.sessions.find(s => !s.sessionEndTime).sessionStartTime
          }
        },
        arrayFilters: [{ 'elem.sessionEndTime': { $exists: false } }]
      }
    }));

    if (bulkOps.length > 0) {
      await User.bulkWrite(bulkOps);
    }
  } catch (error) {
    console.error("Error checking inactive users:", error);
  }
};


// In your server startup file:
const initCronJobs = () => {
  // Runs every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    console.log('Running inactive users check...');
    checkInactiveUsers();
  });
};

export { initCronJobs };