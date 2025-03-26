import mongoose from 'mongoose';
import { User } from '../model/user.model.js';
import { UserSubmission } from '../model/userSubmission.model.js';

const tierTable = [
    { name: 'NOVICE SEEKER', up: 1, down: null, retain: [0] },
    { name: 'INITIATE', up: 1, down: -30, retain: [-29, 0] },
    { name: 'APPRENTICE', up: 31, down: 0, retain: [1, 30] },
    { name: 'EXPLORER', up: 61, down: 0, retain: [1, 60] },
    { name: 'VISIONARY', up: 81, down: 30, retain: [31, 80] },
    { name: 'ADEPT', up: 101, down: 30, retain: [31, 100] },
    { name: 'SEER', up: 121, down: 60, retain: [61, 120] },
    { name: 'ORACLE', up: 141, down: 60, retain: [61, 140] },
    { name: 'MASTER REMOTE VIEWER', up: 161, down: 100, retain: [101, 160] },
    { name: 'ASCENDING MASTER', up: null, down: 120, retain: [121] }
];

export const updateUserTier = async (userId) => {
    const session = await mongoose.startSession();
    
    try {
        await session.withTransaction(async () => {
            const [user, userSubmission] = await Promise.all([
                User.findById(userId).session(session),
                UserSubmission.findOne({ userId }).session(session)
            ]);

            if (!user || !userSubmission) {
                throw new Error("User data not found");
            }

            // পয়েন্ট ক্যালকুলেশন
            let finalPoints = userSubmission.totalPoints;
            if (userSubmission.completedChallenges < 10) {
                const missingGames = 10 - userSubmission.completedChallenges;
                finalPoints -= missingGames * 10;
                finalPoints = Math.max(finalPoints, -29);
            }

            // নতুন টিয়ার নির্ধারণ
            const newTier = calculateNewTier(user.tierRank, finalPoints);

            // একই ট্রানজেকশনে আপডেট
            await Promise.all([
                User.updateOne(
                    { _id: userId },
                    { $set: { tierRank: newTier, totalPoints: finalPoints } },
                    { session }
                ),
                UserSubmission.updateOne(
                    { userId },
                    { 
                        $set: { 
                            tierRank: newTier, 
                            totalPoints: finalPoints,
                            completedChallenges: 0,
                            lastChallengeDate: new Date()
                        }
                    },
                    { session }
                )
            ]);

            return {
                status: true,
                message: "Tier updated successfully",
                previousTier: user.tierRank,
                newTier,
                finalPoints,
                tierChanged: user.tierRank !== newTier
            };
        });
    } catch (error) {
        console.error("Tier update failed:", error);
        throw error;
    } finally {
        session.endSession();
    }
};

function calculateNewTier(currentTier, points) {
    const currentIndex = tierTable.findIndex(t => t.name === currentTier);
    if (currentIndex === -1) return 'NOVICE SEEKER';

    const currentTierData = tierTable[currentIndex];

    // 1. Check for demotion first
    if (currentTierData.down !== null && points <= currentTierData.down) {
        return tierTable[Math.max(0, currentIndex - 1)].name;
    }

    // 2. Check for promotion
    if (currentIndex < tierTable.length - 1 && points >= currentTierData.up) {
        return tierTable[currentIndex + 1].name;
    }

    // 3. Check retain range
    const [min, max] = currentTierData.retain.length === 2 ? 
        currentTierData.retain : 
        [currentTierData.retain[0], currentTierData.retain[0]];

    if (points >= min && points <= max) {
        return currentTier;
    }

    // Default: no change
    return currentTier;
}