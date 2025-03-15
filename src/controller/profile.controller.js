import { User } from "../model/user.model.js"

export const getUserProfile = async (req, res) => {

    const { id } = req.params

    try {

        const user = (
            await User.findById(id)
                .select("-fullName -phone -title -country -dob -password -point -tmcScore -arvScore -combinedScore -leaderboardPosition -emailVerified -role -gender -refreshToken -otpExpiration -createdAt -updatedAt -__v"))

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

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
    const { screenName, fullName, phone, country, dob, gender } = req.body

    try {

        const user = await User.findOne({ screenName })

        if (user && user._id.toString() !== id) {
            return res.status(400).json({ status: false, message: "Screen name already exists" })
        }

        const updatedUser = (
            await User.findByIdAndUpdate(id, { screenName, fullName, phone, country, dob, gender }, { new: true })
                .select("-title -password -tierRank -point -tmcScore -arvScore -combinedScore -leaderboardPosition -completedTargets -successRate -emailVerified -role -refreshToken -otpExpiration -createdAt -updatedAt -__v"))

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

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" })
        }

        user.password = newPassword

        await user.save({ validateBeforeSave: false })

        return res.status(200).json({
            status: true,
            message: "Password updated successfully"
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
