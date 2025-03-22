import { TMCTarget } from "../model/TMCTarget.model.js";
import { ARVTarget } from "../model/ARVTarget.model.js";
import { UserSubmission } from "../model/userSubmission.model.js";

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
                        points,
                        successRate: 0,
                        pValue: 0
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

        await ARVTarget.findById(ARVTargetId)

        await UserSubmission.findOneAndUpdate({ userId },
            {
                $push: {
                    participatedARVTargets: {
                        id: ARVTargetId,
                        submittedImage,
                        points: null,
                        successRate: 0,
                        pValue: 0
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

