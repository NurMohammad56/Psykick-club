import { UserSubmission } from "../model/userSubmission.model.js";

export const getTMCLeaderboard = async (_, res, next) => {
    try {
        const leaderboard = await UserSubmission.aggregate([
            {
                $project: {
                    userId: 1,
                    totalTMCPoints: { $sum: "$participatedTMCTargets.points" },
                    tierRank: 1
                }
            },
            { $sort: { totalTMCPoints: -1 } }
        ]);

        return res.status(200).json({
            status: true,
            message: "TMC Leaderboard fetched successfully",
            data: leaderboard
        })
    }

    catch (error) {
        next(error)
    }
}

export const getARVLeaderboard = async (_, res, next) => {

    try {

        const leaderboard = await UserSubmission.aggregate([
            {
                $project: {
                    userId: 1,
                    totalARVPoints: { $sum: "$participatedARVTargets.points" },
                    tierRank: 1
                }
            },
            { $sort: { totalARVPoints: -1 } }
        ]);

        return res.status(200).json({
            status: true,
            message: "ARV Leaderboard fetched successfully",
            data: leaderboard
        })
    }
    catch (error) {
        next(error)
    }
}

export const getTotalLeaderboard = async (_, res, next) => {

    try {

        const leaderboard = await UserSubmission.aggregate([
            {
                $project: {
                    userId: 1,
                    totalPoints: {
                        $add: [
                            { $sum: "$participatedTMCTargets.points" },
                            { $sum: "$participatedARVTargets.points" }
                        ]
                    },
                    tierRank: 1
                }
            },
            { $sort: { totalPoints: -1 } }
        ]);

        return res.status(200).json({
            status: true,
            message: "Total Leaderboard fetched successfully",
            data: leaderboard
        })
    }

    catch (error) {
        next(error)
    }
}


