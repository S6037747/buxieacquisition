import companyModel from "../../models/companyModel.js";
import userModel from "../../models/userModel.js";
import logModel from "../../models/logModel.js";

const postCompanyData = async (request, response) => {
  const { company, userId } = request.body;

  Object.keys(company).forEach((key) => {
    if (typeof company[key] === "string") {
      company[key] = company[key].trim();
    }
  });

  const authUser = await userModel.findById(userId);

  if (!userId || !authUser) {
    return response.json({
      success: false,
      message: "User not authenticated.",
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
    await new logModel({
      actionBy: userId,
      type: "CompanyAPI",
      method: "Post",
      description: `Created company ${newCompany._id} by user ${userId}`,
    }).save();
    return response.json({
      success: true,
      companyId: newCompany._id,
    });
  } catch (error) {
    await new logModel({
      actionBy: userId,
      type: "CompanyAPI",
      method: "Post",
      description: `Error creating company by user ${userId}: ${error.message}`,
    }).save();
    return response.json({
      success: false,
      error: error.message,
    });
  }
};

export default postCompanyData;
