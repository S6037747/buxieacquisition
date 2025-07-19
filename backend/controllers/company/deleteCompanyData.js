import companyModel from "../../models/companyModel.js";
import userModel from "../../models/userModel.js";
import logModel from "../../models/logModel.js";

const deleteCompanyData = async (request, response) => {
  const data = request.body || {};

  const authUser = await userModel.findById(data.userId);

  if (!data.userId || !authUser) {
    return response.json({
      success: false,
      message: "User not authenticated.",
    });
  }

  try {
    if (data.companyId) {
      const company = await companyModel.findById(data.companyId);

      if (!company) {
        return response.json({
          success: false,
          message: "Company not found.",
        });
      }

      await companyModel.findByIdAndDelete(data.companyId);
      await new logModel({
        actionBy: data.userId,
        type: "CompanyAPI",
        method: "Delete",
        description: `Deleted company ${data.companyId} by user ${data.userId}`,
      }).save();
      return response.json({
        success: true,
        message: "Company deleted successfully.",
      });
    } else {
      return response.json({
        success: false,
        message: "Missing companyId.",
      });
    }
  } catch (error) {
    await new logModel({
      actionBy: data.userId,
      type: "CompanyAPI",
      method: "Delete",
      description: `Error deleting company ${data.companyId} by user ${data.userId}: ${error.message}`,
    }).save();
    response.json({
      success: false,
      error: error.message,
    });
  }
};

export default deleteCompanyData;
