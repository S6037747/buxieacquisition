import companyModel from "../../models/companyModel.js";
import userModel from "../../models/userModel.js";

const getCompanyData = async (request, response) => {
  const companyId = request.params.id;
  const { userId } = request.body;

  const authUser = await userModel.findById(userId);

  if (!userId || !authUser) {
    return response.json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    if (companyId) {
      const company = await companyModel.findById(companyId);

      if (!company) {
        return response.json({
          success: false,
          message: "Company not found",
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
    response.json({
      success: false,
      message: error.message,
    });
  }
};

export default getCompanyData;
