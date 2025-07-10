import companyModel from "../../models/companyModel.js";
import userModel from "../../models/userModel.js";

const patchCompanyData = async (req, res) => {
  const data = req.body;

  const authUser = await userModel.findById(data.userId);

  if (!data.userId || !authUser) {
    return response.json({
      success: false,
      message: "User not authenticated",
    });
  }

  // Validate required fields
  if (
    (!data.name || typeof data.name !== "string" || data.name.trim() === "") &&
    !data.status
  ) {
    return res.json({
      success: false,
      error: "Company name is required.",
    });
  }

  try {
    const company = await companyModel.findById(data.companyId);

    if (!company) {
      return res.json({
        success: false,
        message: "Company not found.",
      });
    }

    if (!data.status) {
      company.set(data);
    } else {
      if (data !== "active" || data !== "inactive") {
        company.status = data.status;
      } else {
        return res.json({
          success: false,
          message: "Invalid status.",
        });
      }
    }

    company.updatedAt = Date.now();

    await company.save();

    return res.json({
      success: true,
      message: "Company updated successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export default patchCompanyData;
