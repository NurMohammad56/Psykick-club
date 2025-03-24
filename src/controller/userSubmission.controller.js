import { TMCTarget } from "../model/TMCTarget.model.js";
import { ARVTarget } from "../model/ARVTarget.model.js";
import { UserSubmission } from "../model/userSubmission.model.js";
// import { cumulativeStdNormalProbability } from 'simple-statistics';
import { User } from "../model/user.model.js";

const erf = (x) => {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = (x >= 0) ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
};

const cumulativeStdNormalProbability = (z) => {
    return 0.5 * (1 + erf(z / Math.sqrt(2)));
};

const calculatePValue = (successfulChallenges, totalChallenges) => {
    if (totalChallenges === 0) return 1; // Avoid division by zero, return max p-value
    if (successfulChallenges === 0) return 1; // If no success, p-value is 1
    if (successfulChallenges === totalChallenges) return 0.0001; // If 100% success, p-value is very small

    const p0 = 0.5; // Null hypothesis probability (50% chance)
    const pHat = successfulChallenges / totalChallenges; // Observed success rate
    const SE = Math.sqrt((p0 * (1 - p0)) / totalChallenges); // Standard error
    const Z = (pHat - p0) / SE; // Z-score

    // Calculate two-tailed p-value using cumulative standard normal probability
    const pValue = 2 * (1 - cumulativeStdNormalProbability(Z));

    return pValue;
};

// Function to calculate the tier based on the total points
const updateUserTier = (points) => {
    const tierTable = [
        { name: "NOVICE SEEKER", up: 1, retain: [0], down: null },
        { name: "INITIATE", up: 1, retain: [-29, 0], down: -30 },
        { name: "APPRENTICE", up: 31, retain: [1, 30], down: 0 },
        { name: "EXPLORER", up: 61, retain: [1, 60], down: 0 },
        { name: "VISIONARY", up: 81, retain: [31, 80], down: 30 },
        { name: "ADEPT", up: 101, retain: [31, 100], down: 30 },
        { name: "SEER", up: 121, retain: [61, 120], down: 60 },
        { name: "ORACLE", up: 141, retain: [61, 140], down: 60 },
        { name: "MASTER REMOTE VIEWER", up: 161, retain: [101, 160], down: 100 },
        { name: "ASCENDING MASTER", up: null, retain: [121], down: 120 },
    ];

    let currentTierIndex = tierTable.findIndex(
        (tier) => tier.name === "NOVICE SEEKER"
    );

    for (let i = 0; i < tierTable.length; i++) {
        if (points >= tierTable[i].up) {
            currentTierIndex = i;
        }
    }

    // Determine the next tier or previous tier transition based on points
    if (points >= tierTable[currentTierIndex].up) {
        return tierTable[currentTierIndex].name;
    } else if (points <= tierTable[currentTierIndex].down) {
        return tierTable[currentTierIndex - 1].name || tierTable[0].name;
    }

    return tierTable[currentTierIndex].name;
};

export const createUserSubmissionTMC = async (req, res, next) => {
    const { firstChoiceImage, secondChoiceImage, TMCTargetId } = req.body;
    const userId = req.user._id;

    try {
        let points = 0;

        // Ensure userSubmission exists
        let userSubmission = await UserSubmission.findOne({ userId });
        if (!userSubmission) {
            userSubmission = new UserSubmission({
                userId,
                completedChallenges: 0,
                totalPoints: 0,
                tierRank: "NOVICE SEEKER",
                participatedTMCTargets: [],
                lastChallengeDate: new Date(),
            });
            await userSubmission.save();
        }

        // Find the TMC target
        const TMC = await TMCTarget.findById(TMCTargetId);
        if (!TMC) {
            return res.status(404).json({ message: "TMC target not found" });
        }

        // Calculate points for TMC challenge
        if (TMC.targetImage === firstChoiceImage) {
            points = 25;
        } else if (TMC.targetImage === secondChoiceImage) {
            points = 10;
        } else {
            points = -10;
        }

        // Update userSubmission
        await UserSubmission.findOneAndUpdate(
            { userId },
            {
                $push: {
                    participatedTMCTargets: {
                        TMCId: TMCTargetId,
                        firstChoiceImage,
                        secondChoiceImage,
                        points,
                    },
                },
                $inc: {
                    completedChallenges: 1,
                    totalPoints: points,
                },
                $set: {
                    lastChallengeDate: new Date(),
                },
            },
            { new: true }
        );

        // Re-fetch updated submission
        userSubmission = await UserSubmission.findOne({ userId });

        // Update totalPoints in UserProfile
        await User.findByIdAndUpdate(
            userId,
            { totalPoints: userSubmission.totalPoints },
            { new: true, runValidators: true }
        );

        // Handle tier updates (every 10 challenges)
        if (userSubmission.completedChallenges >= 10) {
            const newTier = updateUserTier(userSubmission.tierRank, userSubmission.totalPoints);

            if (userSubmission.tierRank !== newTier) {
                // Update tier rank in UserSubmission and UserProfile
                await UserSubmission.findOneAndUpdate({ userId }, { tierRank: newTier, completedChallenges: 0 });
                await User.findByIdAndUpdate(userId, { tierRank: newTier }, { new: true });
            }
        }

        // Handle tier downgrade after 15 days if <10 challenges are completed
        const timeDiff = new Date() - userSubmission.lastChallengeDate;
        const cycleTime = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds

        if (timeDiff > cycleTime && userSubmission.completedChallenges < 10) {
            await UserSubmission.findOneAndUpdate(
                { userId },
                { completedChallenges: 0, totalPoints: 0, tierRank: "NOVICE SEEKER" }
            );

            await UserProfile.findByIdAndUpdate(
                userId,
                { tierRank: "NOVICE SEEKER", totalPoints: 0 },
                { new: true, runValidators: true }
            );
        }

        return res.status(201).json({
            message: "TMC challenge submitted successfully",
            points,
            tierRank: userSubmission.tierRank,
        });
    } catch (error) {
        next(error);
    }
};

export const createUserSubmissionARV = async (req, res, next) => {

    const { submittedImage, ARVTargetId } = req.body;
    const userId = req.user._id

    try {
        const doesUserExists = await UserSubmission.findOne({ userId })

        if (!doesUserExists) {
            const newUserParticipation = new UserSubmission({
                userId
            });

            await newUserParticipation.save();
        }

        await UserSubmission.findOneAndUpdate({ userId },
            {
                $push: {
                    participatedARVTargets: {
                        ARVId: ARVTargetId,
                        submittedImage,
                        points: null
                    }
                }
            },
        )

        return res.status(201).json({
            message: "ARV challenge submitted successfully",
        });
    }

    catch (error) {
        next(error);
    }
}

export const getPreviousTMCResults = async (req, res) => {

    const userId = req.user._id
    const { currentTMCTargetId } = req.params

    try {
        const userSubmission = await UserSubmission.findOne({ userId })

        if (!userSubmission) {
            return res.status(404).json({ message: "No submissions found" });
        }

        const previousTMCResults = userSubmission.participatedTMCTargets.filter(
            target => target.TMCId.toString() !== currentTMCTargetId
        );

        return res.status(200).json({
            status: true,
            message: "Previous TMC Results fetched successfully",
            data: previousTMCResults
        });
    }

    catch (error) {
        next(error);
    }
}

export const getPreviousARVResults = async (req, res) => {

    const userId = req.user._id
    const { currentARVTargetId } = req.params

    try {
        const userSubmission = await UserSubmission.findOne({ userId })

        if (!userSubmission) {
            return res.status(404).json({ message: "No submissions found" });
        }

        const previousARVResults = userSubmission.participatedARVTargets.filter(
            target => target.ARVId.toString() !== currentARVTargetId
        );

        return res.status(200).json({
            status: true,
            message: "Previous ARV Results fetched successfully",
            data: previousARVResults
        });
    }

    catch (error) {
        next(error);
    }
}

export const getTMCTargetResult = async (req, res, next) => {
    const { TMCTargetId } = req.params;
    const userId = req.user._id;

    try {
        // Find UserSubmission for the user
        const result = await UserSubmission.findOne(
            { userId, "participatedTMCTargets.TMCId": TMCTargetId },
            { "participatedTMCTargets": 1, _id: 0 }
        );


        // If no result found, return a proper error message
        if (!result) {
            return res.status(404).json({
                status: false,
                message: "No submission found for this TMC Target.",
            });
        }

        // Find the matching TMC submission
        const matchedTMC = result.participatedTMCTargets?.find(
            (tmc) => tmc.TMCId && tmc.TMCId.toString() === TMCTargetId.toString()
        );

        // If no matching submission found, return a message
        if (!matchedTMC) {
            return res.status(404).json({
                status: false,
                message: "No result found for the provided TMC Target ID.",
            });
        }

        return res.status(200).json({
            status: true,
            message: "TMC Result fetched successfully",
            data: matchedTMC,
        });
    } catch (error) {
        next(error);
    }
};


export const getARVTargetResult = async (req, res, next) => {

    const { ARVTargetId } = req.params
    const userId = req.user._id
    console.log(userId, ARVTargetId);

    try {
        const result = await UserSubmission.findOne({
            userId, "participatedARVTargets.ARVId": ARVTargetId
        }
            ,
            { "participatedARVTargets": 1, _id: 0 }
        )

        const matchedARV = result.participatedARVTargets?.find(
            (arv) => arv.ARVId && arv.ARVId.toString() === ARVTargetId.toString()
        );

        if (!matchedARV) {
            return res.status(404).json({
                status: false,
                message: "No result found for the provided ARV Target ID.",
            });
        }


        return res.status(200).json({
            status: true,
            message: "ARV Result fetched successfully",
            data: result
        });
    }

    catch (error) {
        next(error)
    }
}

export const updateARVTargetPoints = async (req, res, next) => {

    const { ARVTargetId } = req.params
    const { submittedImage } = req.body
    const userId = req.user._id

    try {
        let points
        const ARV = await ARVTarget.findById(ARVTargetId)

        points = ARV.resultImage === submittedImage ? 25 : -10;

        await UserSubmission.findOneAndUpdate(
            { userId, "participatedARVTargets.ARVId": ARVTargetId },
            { $set: { "participatedARVTargets.$.points": points } },
        );

        return res.status(200).json({
            status: true,
            message: "Points calculated successfully"
        })
    }

    catch (error) {
        next(error)
    }
}

export const updateTMCAnalytics = async (req, res, next) => {
    const userId = req.user._id;

    try {
        const tmcStats = await UserSubmission.aggregate([
            { $match: { userId } },
            { $unwind: "$participatedTMCTargets" },
            {
                $group: {
                    _id: "$userId",
                    totalChallenges: { $sum: 1 },
                    successfulChallenges: {
                        $sum: {
                            $cond: [{ $gt: ["$participatedTMCTargets.points", 0] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const totalChallenges = tmcStats.length > 0 ? tmcStats[0].totalChallenges : 0;
        const successfulChallenges = tmcStats.length > 0 ? tmcStats[0].successfulChallenges : 0;

        const successRate = totalChallenges > 0 ? (successfulChallenges / totalChallenges) * 100 : 0;

        const pValue = calculatePValue(successfulChallenges, totalChallenges);

        await User.findByIdAndUpdate(userId, {
            TMCSuccessRate: successRate,
            TMCpValue: pValue
        });

        return res.status(200).json({
            status: true,
            message: "TMC analytics updated successfully",
            data: { successRate, pValue }
        });

    } catch (error) {
        next(error);
    }
};

export const updateARVAnalytics = async (req, res, next) => {
    const userId = req.user._id;

    try {
        const arvStats = await UserSubmission.aggregate([
            { $match: { userId } },
            { $unwind: "$participatedARVTargets" },
            {
                $group: {
                    _id: "$userId",
                    totalChallenges: { $sum: 1 },
                    successfulChallenges: {
                        $sum: {
                            $cond: [{ $gt: ["$participatedARVTargets.points", 0] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const totalChallenges = arvStats.length > 0 ? arvStats[0].totalChallenges : 0;
        const successfulChallenges = arvStats.length > 0 ? arvStats[0].successfulChallenges : 0;

        const successRate = totalChallenges > 0 ? (successfulChallenges / totalChallenges) * 100 : 0;

        const pValue = calculatePValue(successfulChallenges, totalChallenges);

        await User.findByIdAndUpdate(userId, {
            ARVSuccessRate: successRate,
            ARVpValue: pValue
        });

        return res.status(200).json({
            status: true,
            message: "ARV analytics updated successfully",
            data: { successRate, pValue }
        });

    } catch (error) {
        next(error);
    }
};