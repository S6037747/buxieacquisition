import logModel from "../models/logModel.js";

const createlog = async (request, response) => {
  try {
    const { actionBy, type, method, description } = request.body;

    if (!actionBy) {
      const log = new logModel({
        type: "Automated",
        description: description,
      });
      await log.save();

      return response.json({
        success: true,
        message: "Log saved",
      });
    } else {
      const log = new logModel({
        actionBy: actionBy,
        type: type,
        method: method,
        description: description,
      });

      await log.save();

      return response.json({
        success: true,
        message: "Log saved",
      });
    }
  } catch (error) {
    // Catch if a error occurs
    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export default createlog;
