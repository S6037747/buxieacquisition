import companyModel from "../../models/companyModel.js";
import userModel from "../../models/userModel.js";
import logModel from "../../models/logModel.js";

const getCompanyData = async (request, response) => {
  const companyId = request.params.id;
  const { userId } = request.body;

  const authUser = await userModel.findById(userId);

  if (!userId || !authUser) {
    return response.json({
      success: false,
      message: "User not authenticated.",
    });
  }

  try {
    if (companyId) {
      const company = await companyModel.findById(companyId);
      if (!company) {
        await new logModel({
          actionBy: userId,
          type: "CompanyAPI",
          method: "Get",
          description: `Company not found: ${companyId} requested by user ${userId}`,
        }).save();
        return response.json({
          success: false,
          message: "Company not found.",
        });
      }
      return response.json({
        success: true,
        company: company,
      });
    } else {
      const companies = await companyModel.find();
      return response.json({
        success: true,
        companies: companies,
      });
    }
  } catch (error) {
    await new logModel({
      actionBy: userId,
      type: "CompanyAPI",
      method: "Get",
      description: `Error fetching company data for user ${userId}: ${error.message}`,
    }).save();
    response.json({
      success: false,
      message: error.message,
    });
  }
};

export default getCompanyData;
