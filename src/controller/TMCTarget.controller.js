import { ARVTarget } from "../model/ARVTarget.model.js";
import { TMCTarget } from "../model/TMCTarget.model.js";
import { startNextGameService, updateAddToQueueService, updateGameTimeService, updateMakeCompleteService, updateMakeInActiveService, updateRemoveFromQueueService } from "../services/ARVTMCServices/ARVTMCServices.js";
import { generateCode } from "../utils/generateCode.js";

export const createTMCTarget = async (req, res, next) => {
  const { targetImage, controlImages, revealTime, bufferTime, gameTime } =
    req.body;

  try {
    let code;
    let arvCode, tmcCode;

    do {
      code = generateCode();

      arvCode = await ARVTarget.findOne({ code });
      tmcCode = await TMCTarget.findOne({ code });
    } while (arvCode || tmcCode);

    if (new Date(revealTime).getTime() < new Date(gameTime).getTime()) {
      return res.status(400).json({
        message: "Reveal time should be in the future or equal to game time",
      });
    } else if (
      new Date(revealTime).getTime() > new Date(bufferTime).getTime()
    ) {
      return res.status(400).json({
        message: "Buffer time should be in the future or equal to reveal time",
      });
    }

    const newTMCTarget = new TMCTarget({
      code,
      targetImage,
      controlImages,
      revealTime,
      bufferTime,
      gameTime,
    });
    await newTMCTarget.save();

    return res.status(201).json({
      message: "TMCTarget created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTMCTargets = async (_, res, next) => {
  try {
    const TMCTargets = await TMCTarget.find().select(
      "-targetImage -controlImages -__v"
    );
    return res.status(200).json({
      data: TMCTargets,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllQueuedTMCTargets = async (_, res, next) => {
  try {
    const TMCTargets = await TMCTarget.find({ isQueued: true }).select(
      "-targetImage -controlImages -__v"
    );
    return res.status(200).json({
      data: TMCTargets,
    });
  } catch (error) {
    next(error);
  }
};

<<<<<<< HEAD
//will start the next game in the queue
export const getNextGame = async (_, res, next) => {
  try {
    const nextGame = await TMCTarget.findOneAndUpdate(
      { isCompleted: false, isQueued: true },
      { isActive: true },
      { new: true }
    ).select("-isActive -isQueued -isCompleted -__v");

    return res.status(200).json({
      status: true,
      message: "Next game started successfully",
      data: nextGame,
    });
  } catch (error) {
    next(error);
  }
};
=======
export const startNextGame = async (_, res, next) => {

    try {
        await startNextGameService(TMCTarget, res, next)
    }

    catch (error) {
        next(error)
    }
}
>>>>>>> a610e86e17ee5ecd3d5e6f33e3b227996e09e2df

export const updateAddToQueue = async (req, res, next) => {
  const { id } = req.params;

<<<<<<< HEAD
  try {
    await addToQueue(id, TMCTarget, res);
  } catch (error) {
    next(error);
  }
};
=======
    const { id } = req.params

    try {
        await updateAddToQueueService(id, TMCTarget, res, next);
    }

    catch (error) {
        next(error);
    }
}
>>>>>>> a610e86e17ee5ecd3d5e6f33e3b227996e09e2df

export const updateRemoveFromQueue = async (req, res, next) => {
  const { id } = req.params;

<<<<<<< HEAD
  try {
    await removeFromQueue(id, TMCTarget, res);
  } catch (error) {
    next(error);
  }
};
=======
    const { id } = req.params

    try {
        const { revealTime } = await TMCTarget.findById(id).select("revealTime")
        await updateRemoveFromQueueService(id, TMCTarget, revealTime, res, next)
    }

    catch (error) {
        next(error);
    }
}
>>>>>>> a610e86e17ee5ecd3d5e6f33e3b227996e09e2df

export const updateBufferTime = async (req, res, next) => {
  const { id } = req.params;
  const { bufferTime } = req.body;

  try {
    const { revealTime } = await TMCTarget.findById(id).select("revealTime");

    if (new Date(revealTime).getTime() > new Date(bufferTime).getTime()) {
      return res.status(400).json({
        message: "Buffer time should be in the future or equal to reveal time",
      });
    }

    await TMCTarget.findByIdAndUpdate(id, { bufferTime }, { new: true });
    return res.status(200).json({
      message: "Buffer time updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateGameTime = async (req, res, next) => {
  const { id } = req.params;
  const { gameTime } = req.body;

  try {
    const { revealTime } = await TMCTarget.findById(id).select("revealTime");

<<<<<<< HEAD
    if (new Date(revealTime).getTime() < new Date(gameTime).getTime()) {
      return res.status(400).json({
        message: "Reveal time should be in the future or equal to game time",
      });
=======
    try {
        await updateGameTimeService(id, gameTime, TMCTarget, res, next)
>>>>>>> a610e86e17ee5ecd3d5e6f33e3b227996e09e2df
    }

    await TMCTarget.findByIdAndUpdate(id, { gameTime }, { new: true });
    return res.status(200).json({
      message: "Game time updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateMakeInactive = async (req, res, next) => {
  const { id } = req.params;

<<<<<<< HEAD
  try {
    await makeInActive(id, TMCTarget, res);
  } catch (error) {
    next(error);
  }
};
=======
    const { id } = req.params;

    try {
        await updateMakeInActiveService(id, TMCTarget, res, next);
    }

    catch (error) {
        next(error);
    }
}
>>>>>>> a610e86e17ee5ecd3d5e6f33e3b227996e09e2df

export const updateMakeComplete = async (req, res, next) => {
  const { id } = req.params;

  try {
    await TMCTarget.findByIdAndUpdate(id, { isCompleted: true }, { new: true });

<<<<<<< HEAD
    await CompletedTargets.findByIdAndUpdate(
      process.env.COMPLETED_TARGETS_DOCUMENT_ID,
      { $push: { TMCTargets: id } },
      { new: true }
    );

    return res.status(200).json({
      message: "Target completed successfully",
    });
  } catch (error) {
    next(error);
  }
};
=======
    try {
        await updateMakeCompleteService(id, TMCTarget, "TMCTargets", res, next)
    }

    catch (error) {
        next(error);
    }
}
>>>>>>> a610e86e17ee5ecd3d5e6f33e3b227996e09e2df
