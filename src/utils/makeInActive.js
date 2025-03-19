export const makeInActive = async (id, model, res) => {

    try {
        const entity = await model.findByIdAndUpdate(id, { isActive: false }, { new: true })
        return res.status(200).json({
            data: entity
        });
    }

    catch (error) {
        next(error);
    }
}