import companyModel from "../../models/companyModel.js";
import userModel from "../../models/userModel.js";

const postCompanyData = async (request, response) => {
  const { company, userId } = request.body;

  const authUser = await userModel.findById(userId);

  if (!userId || !authUser) {
    return response.json({
      success: false,
      message: "User not authenticated",
    });
  }

  // name is required
  if (
    !company.name ||
    typeof company.name !== "string" ||
    company.name.trim() === ""
  ) {
    return response.json({
      success: false,
      error: "Company name is required.",
    });
  }

  try {
    const newCompany = await companyModel.create(company);

    return response.json({
      success: true,
      companyId: newCompany._id,
    });
  } catch (error) {
    return response.json({
      success: false,
      error: error.message,
    });
  }
};

export default postCompanyData;
