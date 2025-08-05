import logModel from "../models/logModel.js";
import userModel from "../models/userModel.js";

export const createlog = async (request, response) => {
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

export const getLogs = async (request, response) => {
  try {
    const { userId } = request.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return response.json({
        success: false,
        message: "User not Authenticated",
      });
    }

    if (user.role !== "admin") {
      return response.json({
        success: false,
        message: "User not Authorized",
      });
    }

    const logs = await logModel.find();

    return response.json({
      success: true,
      logs: logs,
    });
  } catch (error) {
    return response.json({
      success: false,
      message: error.message,
    });
  }
};
