import { User } from "../model/user.model.js";

const checkInactiveUsers = async () => {
  const inactiveThreshold = 10 * 60 * 1000;
  try {
    const inactiveUsers = await User.find({
      lastActive: { $lt: new Date(Date.now() - inactiveThreshold) },
      "sessions.sessionEndTime": { $exists: false },
    });

    inactiveUsers.forEach(async (user) => {
      await User.findByIdAndUpdate(user._id, {
        $set: {
          "sessions.$[elem].sessionEndTime": Date.now(),
        },
      }, {
        arrayFilters: [{ "elem.sessionEndTime": { $exists: false } }],
      });
    });
  } catch (error) {
    console.error("Error checking inactive users:", error);
  }
};

const startCronJob = () => {
  setInterval(checkInactiveUsers, 5 * 60 * 1000); 
  console.log("Cron job started successfully.");
};

export { checkInactiveUsers, startCronJob };