import companyModel from "../../models/companyModel.js";
import userModel from "../../models/userModel.js";

const deleteComment = async (request, response) => {
  const { companyId, commentId, replyId, userId } = request.body || {};

  const authUser = await userModel.findById(userId);

  if (!userId || !authUser) {
    return response.json({
      success: false,
      message: "User not authenticated",
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

    const comment = company.comments.id(commentId);

    if (!comment) {
      return response.json({
        success: false,
        message: "comment not found.",
      });
    }

    if (replyId === "") {
      company.comments = company.comments.filter(
        (c) => c._id.toString() !== commentId
      );
      await company.save();

      return response.json({
        success: true,
        message: "comment deleted",
      });
    } else {
      const reply = comment.replies.id(replyId);

      if (!reply) {
        return response.json({
          success: false,
          message: "reply not found.",
        });
      }
      comment.replies = comment.replies.filter(
        (r) => r._id.toString() !== replyId
      );
      await company.save();

      return response.json({
        success: true,
        message: "reply deleted",
      });
    }
  } catch (error) {
    response.json({
      success: false,
      message: error.message,
    });
  }
};

export default deleteComment;
