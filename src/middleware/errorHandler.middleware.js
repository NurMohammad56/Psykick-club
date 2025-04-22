const errorHandler = (error, req, res, next) => {

    console.error(error);

    return res.status(500).json({
        status: false,
        message: error.message
    });
};

export default errorHandler;