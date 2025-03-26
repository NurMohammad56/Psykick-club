import { UserSubmission } from "../model/userSubmission.model.js";
import { User } from "../model/user.model.js";

const tierTable = [
    { name: 'NOVICE SEEKER', up: 1, retain: [0], down: null },
    { name: 'INITIATE', up: 1, retain: [-29, 0], down: -30 },
    { name: 'APPRENTICE', up: 31, retain: [1, 30], down: 0 },
    { name: 'EXPLORER', up: 61, retain: [1, 60], down: 0 },
    { name: 'VISIONARY', up: 81, retain: [31, 80], down: 30 },
    { name: 'ADEPT', up: 101, retain: [31, 100], down: 30 },
    { name: 'SEER', up: 121, retain: [61, 120], down: 60 },
    { name: 'ORACLE', up: 141, retain: [61, 140], down: 60 },
    { name: 'MASTER REMOTE VIEWER', up: 161, retain: [101, 160], down: 100 },
    { name: 'ASCENDING MASTER', up: null, retain: [121], down: 120 },
];

export const updateUserTier = async (userId) => {
    try {
        const user = await User.findById(userId);
        const userSubmission = await UserSubmission.findOne({ userId });

        if (!user || !userSubmission) {
            return { status: false, message: "User or submission data not found" }
        }

        // Calculate final points with penalty if needed
        let finalPoints = userSubmission.totalPoints;
        if (userSubmission.completedChallenges < 10) {
            const missingGames = 10 - userSubmission.completedChallenges;
            finalPoints -= missingGames * 10;
            finalPoints = Math.max(finalPoints, -29); // Minimum points cap
        }

        // Determine new tier
        const currentTierIndex = tierTable.findIndex(tier => tier.name === user.tierRank);
        let newTier = user.tierRank;

        // Check for promotion
        if (currentTierIndex < tierTable.length - 1) {
            const nextTier = tierTable[currentTierIndex + 1];
            if (finalPoints >= nextTier.up) {
                newTier = nextTier.name;
            }
        }

        // Check for demotion
        if (currentTierIndex > 0) {
            const currentTier = tierTable[currentTierIndex];
            if (currentTier.down !== null && finalPoints <= currentTier.down) {
                newTier = tierTable[currentTierIndex - 1].name;
            }
        }

        // Update both user and submission
        user.tierRank = newTier;
        user.totalPoints = finalPoints;

        userSubmission.tierRank = newTier;
        userSubmission.totalPoints = finalPoints;
        userSubmission.completedChallenges = 0;
        userSubmission.lastChallengeDate = new Date();

        await user.save();
        await userSubmission.save();

        return {
            status: true,
            message: "Tier updated successfully",
            newTier,
            finalPoints,
        }

    } catch (error) {
        throw new error;
    }
};