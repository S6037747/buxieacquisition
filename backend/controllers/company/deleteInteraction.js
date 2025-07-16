import companyModel from "../../models/companyModel.js";
import userModel from "../../models/userModel.js";

const deleteInteraction = async (request, response) => {
  const { userId, companyId, interactionId } = request.body || {};

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

    const interaction = company.interactions.id(interactionId);

    if (!interaction) {
      return response.json({
        success: false,
        message: "Interaction not found.",
      });
    }

    company.interactions = company.interactions.filter(
      (c) => c._id.toString() !== interactionId
    );

    company.updatedAt = Date.now();

    await company.save();

    return response.json({
      success: true,
      message: "Interaction deleted.",
    });
  } catch (error) {
    response.json({
      success: false,
      message: error.message,
    });
  }
};

export default deleteInteraction;
