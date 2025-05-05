import { ARVTarget } from "../model/arvTarget.model.js";
import { TMCTarget } from "../model/tmcTarget.model.js";
import {
  startNextGameService,
  updateAddToQueueService,
  updateGameTimeService,
  updateMakeCompleteService,
  updateMakeInActiveService,
  updateRemoveFromQueueService
} from "../services/ARVTMCServices/ARVTMCServices.js";
import { generateCode } from "../utils/generateCode.js";

export const createTMCTarget = async (req, res, next) => {
  const { targetImage, controlImages, revealTime, bufferTime, gameTime } = req.body;

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
        status: false,
        message: "Reveal time should be in the future or equal to game time",
      });
    }

    else if (new Date(revealTime).getTime() > new Date(bufferTime).getTime()) {
      return res.status(400).json({
        status: false,
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
      status: true,
      message: "TMCTarget created successfully",
    });
  }

  catch (error) {
    next(error);
  }
};

export const getAllTMCTargets = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const [totalItems, TMCTargets] = await Promise.all([
      TMCTarget.countDocuments(),
      TMCTarget.find()
        .select("-__v")
        .skip(skip)
        .limit(limit)
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      status: true,
      data: TMCTargets,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit
      },
      message: "All TMCTargets fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const getAllQueuedTMCTargets = async (req, res, next) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {

    const [totalItems, TMCTargets] = await Promise.all([
      TMCTarget.countDocuments({ isQueued: true, isActive: false, isPartiallyActive: false }),
      TMCTarget.find({ isQueued: true, isActive: false, isPartiallyActive: false })
        .select("-__v")
        .skip(skip)
        .limit(limit)
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      status: true,
      data: TMCTargets,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit
      },
      message: "All queued TMCTargets fetched successfully"
    });
  }

  catch (error) {
    next(error);
  }
};

export const getAllUnQueuedTMCTargets = async (req, res, next) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {

    const [totalItems, TMCTargets] = await Promise.all([
      TMCTarget.countDocuments({ isQueued: false, isActive: false, isPartiallyActive: false }),
      TMCTarget.find({ isQueued: false, isActive: false, isPartiallyActive: false })
        .select("-__v")
        .skip(skip)
        .limit(limit)
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      status: true,
      data: TMCTargets,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit
      },
      message: "All unqueued TMCTargets fetched successfully"
    });
  }

  catch (error) {
    next(error);
  }
};

export const getActiveTMCTarget = async (_, res, next) => {

  try {
    const activeTMCTarget = await TMCTarget.findOne({
      $or: [
        { isActive: true },
        { isPartiallyActive: true }
      ]
    })
      .select("-__v")
      .lean()

    return res.status(200).json({
      status: true,
      data: activeTMCTarget,
      message: "Active TMCTarget fetched successfully"
    });
  }

  catch (error) {
    next(error)
  }
}

export const startNextGame = async (_, res, next) => {
  try {
    await startNextGameService(TMCTarget, res, next, "TMC");
  }

  catch (error) {
    next(error);
  }
};

export const updateAddToQueue = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { gameTime } = await TMCTarget.findById(id).select("gameTime")
    await updateAddToQueueService(id, TMCTarget, res, next, gameTime)
  }

  catch (error) {
    next(error);
  }
};

export const updateRemoveFromQueue = async (req, res, next) => {
  const { id } = req.params;

  try {
    await updateRemoveFromQueueService(id, TMCTarget, res, next);
  }

  catch (error) {
    next(error);
  }
};

export const updateBufferTime = async (req, res, next) => {
  const { id } = req.params;
  const { bufferTime } = req.body;

  try {
    const { revealTime } = await TMCTarget.findById(id).select("revealTime");

    if (new Date(revealTime).getTime() > new Date(bufferTime).getTime()) {
      return res.status(400).json({
        status: false,
        message: "Buffer time should be in the future or equal to reveal time",
      });
    }

    await TMCTarget.findByIdAndUpdate(id, { bufferTime }, { new: true })
    return res.status(200).json({
      status: true,
      message: "Buffer time updated successfully"
    });
  }

  catch (error) {
    next(error);
  }
};

export const updateGameTime = async (req, res, next) => {
  const { id } = req.params;
  const { gameTime } = req.body;

  try {
    await updateGameTimeService(id, gameTime, TMCTarget, res, next);
  } catch (error) {
    next(error);
  }
};

// once game time is over then only isActive gets false
export const updateMakeInactive = async (req, res, next) => {
  const { id } = req.params;

  try {
    await updateMakeInActiveService(id, TMCTarget, res, next);
  }

  catch (error) {
    next(error);
  }
};

export const updateMakeComplete = async (req, res, next) => {
  const { id } = req.params;

  try {
    await updateMakeCompleteService(id, TMCTarget, "TMCTargets", res, next);
  }

  catch (error) {
    next(error);
  }
};
