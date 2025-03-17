const errorHandler = (error, req, res, next) => {

    console.error(error);
    
    return res.status(500).json({
        message: error.message
    });
};

export default errorHandler;