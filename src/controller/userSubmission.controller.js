import { TMCTarget } from "../model/TMCTarget.model.js";
import { ARVTarget } from "../model/ARVTarget.model.js";
import { UserSubmission } from "../model/userSubmission.model.js";
import { User } from "../model/user.model.js";
import { updateUserTier } from "./tier.controller.js";

export const submitTMCGame = async (req, res, next) => {
    const { firstChoiceImage, secondChoiceImage, TMCTargetId } = req.body;
    const userId = req.user._id;

    try {
        let points = 0;

        // Find or create user submission
        let userSubmission = await UserSubmission.findOne({ userId });
        if (!userSubmission) {
            userSubmission = new UserSubmission({
                userId,
                completedChallenges: 0,
                totalPoints: 0,
                participatedTMCTargets: [],
                participatedARVTargets: [],
                lastChallengeDate: new Date()
            });
            await userSubmission.save();
        }

        // Find the TMC target
        const TMC = await TMCTarget.findById(TMCTargetId);

        if (!TMC) {
            return res.status(404).json({ status: false, message: "TMC target not found" });
        }

        if (TMC.gameTime.getTime() < new Date().getTime()) {
            return res.status(403).json({
                status: false,
                message: "Game time has ended"
            });
        }

        // Calculate points based on choices
        if (TMC.targetImage === firstChoiceImage) {
            points = 25;
        }

        else if (TMC.targetImage === secondChoiceImage) {
            points = 10;
        }

        else {
            points = -10;
        }

        // Update user submission
        userSubmission.participatedTMCTargets.push({
            TMCId: TMCTargetId,
            firstChoiceImage,
            secondChoiceImage,
            points
        });

        userSubmission.completedChallenges += 1;
        userSubmission.totalPoints += points;
        userSubmission.lastChallengeDate = new Date();

        await userSubmission.save();

        // Update user profile
        const user = await User.findByIdAndUpdate(
            userId,
            {
                totalPoints: userSubmission.totalPoints,
                $inc: { targetsLeft: -1 }
            },
            { new: true }
        );

        // Check for tier update
        const tierUpdate = await checkTierUpdate(userId, userSubmission);

        return res.status(200).json({
            status: true,
            message: "TMC game submitted successfully",
            points,
            currentTier: user.tierRank,
            totalPoints: user.totalPoints,
            gamesCompleted: userSubmission.completedChallenges,
            tierUpdate
        });

    }

    catch (error) {
        next(error);
    }
};

export const checkTierUpdate = async (userId) => {
    try {
        // Get user data from database
        const userSubmission = await UserSubmission.findOne({ userId });
        if (!userSubmission) {
            return {
                status: false,
                message: "User submission not found"
            };
        }

        // Calculate cycle status
        const gamesCompleted = userSubmission.completedChallenges;
        const cycleStartDate = userSubmission.lastChallengeDate || userSubmission.createdAt;
        const daysInCycle = Math.floor((new Date() - cycleStartDate) / (1000 * 60 * 60 * 24));
        const shouldEndCycle = gamesCompleted >= 10 || daysInCycle >= 15;

        if (!shouldEndCycle) {
            return {
                status: true,
                message: "Cycle not yet complete",
                data: {
                    gamesCompleted,
                    daysInCycle,
                    cycleComplete: false
                }
            };
        }

        // If cycle should end, update tier
        const updateResult = await updateUserTier(userId);

        return {
            status: true,
            message: "Tier update checked successfully",
            data: {
                ...updateResult,
                cycleComplete: true
            }
        };

    } catch (error) {
        throw error;
    }
};

export const submitARVGame = async (req, res) => {
    try {
        const { submittedImage, ARVTargetId } = req.body;
        const userId = req.user._id;

        const ARV = await ARVTarget.findById(ARVTargetId);
        if (!ARV) {
            return res.status(404).json({ message: "ARV target not found" });
        }

        if (ARV.gameTime.getTime() < new Date().getTime()) {
            return res.status(403).json({
                message: "Game time has ended"
            });
        }

        const currentTime = new Date();

        if (currentTime > ARV.bufferTime) {
            return res.status(400).json({
                message: "Submission period has ended",
                details: {
                    lastSubmissionTime: ARV.bufferTime,
                    currentTime: currentTime
                }
            });
        }

        let userSubmission = await UserSubmission.findOne({ userId }) ||
            new UserSubmission({ userId, tierRank: "NOVICE SEEKER" });

        userSubmission.participatedARVTargets.push({
            ARVId: ARVTargetId,
            submittedImage,
            points: 0,
            submittedAt: currentTime,
            resultChecked: false
        });

        userSubmission.completedChallenges += 1;
        await userSubmission.save();

        return res.status(200).json({
            success: true,
            message: "ARV game submitted successfully",
            data: {
                revealTime: ARV.revealTime,
                outcomeTime: ARV.outcomeTime,
                bufferTime: ARV.bufferTime,
                submissionStatus: {
                    canSubmit: true,
                    until: ARV.bufferTime
                }
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
export const getCompletedTargets = async (req, res, next) => {
    try {
        // 1. Fetch all user submissions with populated target data
        const allSubmissions = await UserSubmission.find({})
            .populate('participatedTMCTargets.TMCId')
            .populate('participatedARVTargets.ARVId');

        // 2. Aggregate data
        const totalStats = {
            users: allSubmissions.length,
            completedTMC: 0,
            completedARV: 0,
            totalPoints: 0,
            tierDistribution: {},
            recentSubmissions: []
        };

        // 3. Process each user's submissions
        allSubmissions.forEach(submission => {
            // TMC Targets
            submission.participatedTMCTargets.forEach(tmc => {
                totalStats.completedTMC++;
                totalStats.totalPoints += tmc.points || 0;
                totalStats.recentSubmissions.push({
                    type: 'TMC',
                    userId: submission.userId,
                    targetId: tmc.TMCId?._id,
                    points: tmc.points,
                    timestamp: submission.lastChallengeDate
                });
            });

            // ARV Targets
            submission.participatedARVTargets.forEach(arv => {
                totalStats.completedARV++;
                totalStats.recentSubmissions.push({
                    type: 'ARV',
                    userId: submission.userId,
                    targetId: arv.ARVId?._id,
                    points: arv.points || 0,
                    timestamp: arv.submittedAt
                });
            });

            // Tier distribution
            totalStats.tierDistribution[submission.tierRank] =
                (totalStats.tierDistribution[submission.tierRank] || 0) + 1;
        });

        // 4. Calculate averages
        totalStats.avgTMCPerUser = totalStats.users > 0
            ? (totalStats.completedTMC / totalStats.users).toFixed(2)
            : 0;
        totalStats.avgARVPerUser = totalStats.users > 0
            ? (totalStats.completedARV / totalStats.users).toFixed(2)
            : 0;

        // 5. Sort recent submissions (newest first)
        totalStats.recentSubmissions.sort((a, b) => b.timestamp - a.timestamp);

        return res.status(200).json({
            status: true,
            message: "All targets data retrieved successfully",
            data: totalStats
        });

    } catch (error) {
        next(error);
    }
};

// P value
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