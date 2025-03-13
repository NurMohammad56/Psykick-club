import { User } from "../model/user.model.js"


export const getUserProfile = async (req, res) => {

    const { id } = req.params

    try {

        const user = await User.findById(id).select("-username -phone -title -country -dob -password -point -tmcScore -arvScore -combinedScore -leaderboardPosition -emailVerified")

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

    const { id } = req.params
    const { email, fullName, userName, phone, country, dob, gender } = req.body

    try {

        const updatedUser = await User.findByIdAndUpdate(id, { email, fullName, userName, phone, country, dob, gender }, { new: true })

        return res.status(200).json({
            status: true,
            message: "Profile updated successfully",
            data: updatedUser
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

export const updateUserPassword = async (req, res) => {

    const { newPassword } = req.body
    const { id } = req.params

    try {

        const user = await User.findById(id)

        user.password = newPassword

        await user.save({ validateBeforeSave: false })
    }

    catch (error) {
        console.error(error);

        return res.status(500).json({
            status: false,
            message: "Internal server error"
        })
    }
}
