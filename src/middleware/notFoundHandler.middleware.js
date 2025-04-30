export const notFoundHandler = (req, res, next) => {
    return res.status(404).json({
        message: "The requested resource was not found!",
    })
}