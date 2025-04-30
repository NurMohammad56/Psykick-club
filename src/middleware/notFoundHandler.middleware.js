export const notFoundHandler = (req, res, next) => {
    console.log("404 route hit:", req.method, req.originalUrl);
    return res.status(404).json({
        message: "The requested resource was not found!",
    })
}