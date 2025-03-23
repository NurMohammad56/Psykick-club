import { TMCTarget } from "../model/TMCTarget.model.js";
import { ARVTarget } from "../model/ARVTarget.model.js";
import { UserSubmission } from "../model/userSubmission.model.js";
import { cumulativeStdNormalProbability } from 'simple-statistics';
import { User } from "../model/user.model.js";

const calculatePValue = (successfulChallenges, totalChallenges) => {
    if (totalChallenges === 0) return 0; // Avoid division by zero

    const p0 = 0.5; // Null hypothesis probability
    const pHat = successfulChallenges / totalChallenges; // Observed success rate
    const SE = Math.sqrt((p0 * (1 - p0)) / totalChallenges); // Standard error
    const Z = (pHat - p0) / SE; // Z-score

    // Calculate two-tailed p-value using cumulative standard normal probability
    const pValue = 2 * (1 - cumulativeStdNormalProbability(Z))

    return pValue;
};

export const createUserSubmissionTMC = async (req, res, next) => {
    const { firstChoiceImage, secondChoiceImage, TMCTargetId } = req.body;
    const userId = req.user._id;

    try {
        let points = 0;

        // Check if the user has participated in a TMC challenge before
        const doesUserExist = await UserSubmission.findOne({ userId });

        if (!doesUserExist) {
            const newUserParticipation = new UserSubmission({
                userId,
            });
            await newUserParticipation.save();
        }

        // Find the target image
        const TMC = await TMCTarget.findById(TMCTargetId);

        // Calculate points for TMC challenge
        if (TMC.targetImage === firstChoiceImage) {
            points = 25;
        } else if (TMC.targetImage === secondChoiceImage) {
            points = 10;
        } else {
            points = -10;
        }

        // Update user submission with the challenge details and calculate points
        await UserSubmission.findOneAndUpdate(
            { userId },
            {
                $push: {
                    participatedTMCTargets: {
                        id: TMCTargetId,
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
            }
        );

        // Check if the user has completed 10 challenges and check the cycle
        const userSubmission = await UserSubmission.findOne({ userId });
        const timeDiff = new Date() - userSubmission.lastChallengeDate;
        const cycleTime = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds

        // If 15 days have passed and the user has completed less than 10 challenges, reset points and tier
        if (userSubmission.completedChallenges >= 10 && timeDiff <= cycleTime) {
            // Check if the user has completed the challenge within the 15 days cycle and update tier
            const newTier = updateUserTier(userSubmission.totalPoints);
            await UserSubmission.findOneAndUpdate(
                { userId },
                { tierRank: newTier, completedChallenges: 0, totalPoints: 0 }
            );
        } else if (timeDiff > cycleTime) {
            // If more than 15 days have passed, reset the cycle
            await UserSubmission.findOneAndUpdate(
                { userId },
                {
                    completedChallenges: 0,
                    totalPoints: 0,
                    tierRank: "NOVICE SEEKER",
                }
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


export const createUserSubmissionARV = async (req, res, next) => {

    const { submittedImage, ARVTargetId } = req.body;
    const userId = req.user._id

    try {
        const doesUserExists = await UserSubmission.findById(userId)

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
                        id: ARVTargetId,
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
            target => target.id.toString() !== currentTMCTargetId
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
            target => target.id.toString() !== currentARVTargetId
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

    const { TMCTargetId } = req.params
    const userId = req.user._id

    try {
        const result = UserSubmission.findOne({
            userId, participatedTMCTargets: {
                $elemMatch: { id: TMCTargetId }
            }
        })

        return res.status(200).json({
            status: true,
            message: "TMC Result fetched successfully",
            data: result
        });
    }

    catch (error) {
        next(error)
    }
}

export const getARVTargetResult = async (req, res, next) => {

    const { ARVTargetId } = req.params
    const userId = req.user._id

    try {
        const result = UserSubmission.findOne({
            userId, participatedARVTargets: {
                $elemMatch: { id: ARVTargetId }
            }
        })

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
            { userId, "participatedARVTargets.id": ARVTargetId },
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

export const updateARVAnalytics = async (req, res, next) => {
    const userId = req.user._id

    try {
        const totalARVChallenges = await UserSubmission.countDocuments({ userId, "participatedARVTargets.points": { $ne: null } })
        const successfulARVChallenges = await UserSubmission.countDocuments({ userId, "participatedARVTargets.points": { $gt: 0 } })
        const successRate = (successfulARVChallenges / totalARVChallenges) * 100
        const pValue = calculatePValue(successfulARVChallenges, totalARVChallenges)

        await User.findByIdAndUpdate(userId, { ARVSuccessRate: successRate, ARVpValue: pValue })

        return res.status(200).json({
            status: true,
            message: "ARV analytics updated successfully",
            data: { successRate, pValue }
        })
    }

    catch (error) {
        next(error)
    }
}

export const updateTMCAnalytics = async (req, res, next) => {
    const userId = req.user._id

    try {
        const totalTMCChallenges = await UserSubmission.countDocuments({ userId, "participatedTMCTargets.points": { $ne: null } })
        const successfulTMCChallenges = await UserSubmission.countDocuments({ userId, "participatedTMCTargets.points": { $gt: 0 } })
        const successRate = (successfulTMCChallenges / totalTMCChallenges) * 100
        const pValue = calculatePValue(successfulTMCChallenges, totalTMCChallenges)
        await User.findByIdAndUpdate(userId, { TMCSuccessRate: successRate, TMCpValue: pValue })

        return res.status(200).json({
            status: true,
            message: "TMC analytics updated successfully",
            data: { successRate, pValue }
        })
    }

    catch (error) {
        next(error)
    }
}
