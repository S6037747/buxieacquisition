import companyModel from "../../models/companyModel.js";
import userModel from "../../models/userModel.js";

const deleteCompanyData = async (request, response) => {
  const data = request.body || {};

  const authUser = await userModel.findById(data.userId);

  if (!data.userId || !authUser) {
    return response.json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    if (data.companyId) {
      const company = await companyModel.findById(data.companyId);

      if (!company) {
        return response.json({
          success: false,
          message: "Company not found",
        });
      }

      await companyModel.findByIdAndDelete(data.companyId);

      return response.json({
        success: true,
        message: "Company deleted successfully",
      });
    } else {
      return response.json({
        success: false,
        message: "Missing companyId",
      });
    }
  } catch (error) {
    response.json({
      success: false,
      error: error.message,
    });
  }
};

export default deleteCompanyData;
