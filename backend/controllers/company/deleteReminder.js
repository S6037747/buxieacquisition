import companyModel from "../../models/companyModel.js";
import userModel from "../../models/userModel.js";

const deleteReminder = async (request, response) => {
  const { userId, companyId, reminderId } = request.body || {};

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

    const reminder = company.reminders.id(reminderId);

    if (!reminder) {
      return response.json({
        success: false,
        message: "Reminder not found.",
      });
    }

    company.reminders = company.reminders.filter(
      (c) => c._id.toString() !== reminderId
    );

    company.updatedAt = Date.now();

    await company.save();

    return response.json({
      success: true,
      message: "Reminder deleted.",
    });
  } catch (error) {
    response.json({
      success: false,
      message: error.message,
    });
  }
};

export default deleteReminder;
