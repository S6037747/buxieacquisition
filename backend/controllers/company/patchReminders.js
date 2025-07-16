import companyModel from "../../models/companyModel.js";
import userModel from "../../models/userModel.js";

const patchReminder = async (req, res) => {
  // NEW: pull fields directly from req.body
  const { companyId, reminderId, completed, userId } = req.body;

  const authUser = await userModel.findById(userId);

  if (!userId || !authUser) {
    return response.json({
      success: false,
      message: "User not authenticated.",
    });
  }

  try {
    // find company
    const company = await companyModel.findById(companyId);
    if (!company) {
      return res.json({ success: false, message: "Company not found." });
    }

    // find reminder
    const reminder = company.reminders.id(reminderId);
    if (!reminder) {
      return res.json({ success: false, message: "Reminder not found." });
    }

    company.updatedAt = Date.now();

    // update completed state
    reminder.completed = !!completed;

    await company.save();
    return res.json({ success: true, message: "Reminder state updated." });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export default patchReminder;
