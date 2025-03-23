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
    const userId = req.user._id

    try {
        let points
        const doesUserExists = await UserSubmission.findById(userId)

        if (!doesUserExists) {
            const newUserParticipation = new UserSubmission({
                userId
            });

            await newUserParticipation.save();
        }

        const TMC = await TMCTarget.findById(TMCTargetId)

        if (TMC.targetImage === firstChoiceImage) {
            points = 25
        }

        else if (TMC.targetImage === secondChoiceImage) {
            points = 10
        }

        else {
            points = -10
        }

        await UserSubmission.findOneAndUpdate({ userId },
            {
                $push: {
                    participatedTMCTargets: {
                        id: TMCTargetId,
                        firstChoiceImage,
                        secondChoiceImage,
                        points
                    }
                }
            },
        )


        return res.status(201).json({
            message: "TMC challenge submitted successfully",
        });
    }

    catch (error) {
        next(error);
    }
}

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
