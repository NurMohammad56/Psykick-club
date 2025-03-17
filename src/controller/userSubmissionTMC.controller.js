import { UserSubmissionTMC } from "../model/userSubmissionTMC.model.js";

export const createUserSubmissionTMC = async (req, res, next) => {

    const { userId, firstChoiceImage, secondChoiceImage, TMCTargetId } = req.body;

    try {
        await UserSubmissionTMC.create({ userId, firstChoiceImage, secondChoiceImage, TMCTargetId });

        return res.status(201).json({
            message: "User submission TMC created successfully",
        });
    }

    catch (error) {
        next(error);
    }
}

export const getUserSubmissionTMCAndCalculatePoints = async (req, res, next) => {

    const { id } = req.params;

    try {

        const userSubmissionTMC = await UserSubmissionTMC.findById(id)
            .populate("TMCTargetId", "targetImage code")
            .select("-__v -user")

        let points = 0

        if (userSubmissionTMC.firstChoiceImage === userSubmissionTMC.TMCTargetId.targetImage) {
            points = 25;
        }

        else if (userSubmissionTMC.secondChoiceImage === userSubmissionTMC.TMCTargetId.targetImage) {
            points = 10;
        }

        else {
            points = -10;
        }

        return res.status(200).json({ data: userSubmissionTMC, points });
    }

    catch (error) {
        next(error);
    }
}