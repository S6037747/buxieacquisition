import companyModel from "../../models/companyModel.js";
import userModel from "../../models/userModel.js";
import logModel from "../../models/logModel.js";

const postReminder = async (request, response) => {
  const { companyId, userId, description, priority, dueDate } = request.body;

  const authUser = await userModel.findById(userId);

  if (!userId || !authUser) {
    return response.json({
      success: false,
      message: "User not authenticated.",
    });
  }

  try {
    const company = await companyModel.findById(companyId);

    if (!company) {
      return response.json({
        success: false,
        message: "Company not found.",
      });
    }

    company.reminders.push({
      userId,
      created: new Date().toISOString(),
      priority: priority,
      dueDate: dueDate,
      description: description.trim(),
    });

    company.updatedAt = Date.now();

    await company.save();
    await new logModel({
      actionBy: userId,
      type: "CompanyAPI",
      method: "Post",
      description: `Posted reminder for company ${companyId} by user ${userId}`,
    }).save();
    return response.json({
      success: true,
      message: "Reminder posted.",
    });
  } catch (error) {
    await new logModel({
      actionBy: userId,
      type: "CompanyAPI",
      method: "Post",
      description: `Error posting reminder for company ${companyId} by user ${userId}: ${error.message}`,
    }).save();
    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export default postReminder;
