import logModel from "../../models/logModel.js";

const isAuthenticated = async (request, response) => {
  try {
    return response.json({
      success: true,
    });
  } catch (error) {
    // Catch if a error occurs
    const log = new logModel({
      type: "AuthAPI",
      description: `The following error has occured in the isAuthenticated.js: ${error.message}`,
    });

    await log.save();

    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export default isAuthenticated;
