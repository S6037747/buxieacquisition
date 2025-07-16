import companyModel from "../../models/companyModel.js";
import userModel from "../../models/userModel.js";

const postInteraction = async (request, response) => {
  const { companyId, userId, description, method } = request.body;

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

    company.interactions.push({
      userId,
      date: new Date().toISOString(),
      description: description.trim(),
      method: method,
    });

    company.updatedAt = Date.now();

    await company.save();

    return response.json({
      success: true,
      message: "Interaction posted.",
    });
  } catch (error) {
    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export default postInteraction;
