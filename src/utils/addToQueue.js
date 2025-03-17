export const addToQueue = async (model, res) => {

    try {
        const entity = await model.findByIdAndUpdate(id, { isQueued: true }, { new: true })
        return res.status(200).json({
            data: entity
        });
    }

    catch (error) {
        next(error);
    }
}