import { User } from "../model/user.model.js"


export const getUserProfile = async (req, res) => {

    const { id } = req.params

    try {

        const user = await User.findById(id).select("-username -country -dob -password -point -tmcScore -arvScore -combinedScore -leaderboardPosition -emailVerified")

        return res.status(200).json({
            status: true,
            data: user
        })
    }

    catch (error) {

        console.error(error);

        return res.status(500).json({
            status: false,
            message: "Internal server error"
        })
    }
}

export const updateUserProfile = async (req, res) => {

    try {

    }

    catch (error) {

    }
}

export const updateUserPassword = async (req, res) => {

    try {

    }

    catch (error) {

    }
}
