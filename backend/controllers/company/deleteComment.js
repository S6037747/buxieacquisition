import companyModel from "../../models/companyModel.js";
import userModel from "../../models/userModel.js";
import logModel from "../../models/logModel.js";

const deleteComment = async (request, response) => {
  const { companyId, commentId, replyId, userId } = request.body || {};

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

    const comment = company.comments.id(commentId);

    if (!comment) {
      return response.json({
        success: false,
        message: "Comment not found.",
      });
    }

    if (replyId === "") {
      company.comments = company.comments.filter(
        (c) => c._id.toString() !== commentId
      );
      await company.save();
      await new logModel({
        actionBy: userId,
        type: "CompanyAPI",
        method: "Delete",
        description: `Deleted comment ${commentId} for company ${companyId} by user ${userId}`,
      }).save();
      return response.json({
        success: true,
        message: "Comment deleted!",
      });
    } else {
      const reply = comment.replies.id(replyId);
      if (!reply) {
        return response.json({
          success: false,
          message: "Reply not found.",
        });
      }
      comment.replies = comment.replies.filter(
        (r) => r._id.toString() !== replyId
      );
      await company.save();
      await new logModel({
        actionBy: userId,
        type: "CompanyAPI",
        method: "Delete",
        description: `Deleted reply ${replyId} to comment ${commentId} for company ${companyId} by user ${userId}`,
      }).save();
      return response.json({
        success: true,
        message: "Reply deleted.",
      });
    }
  } catch (error) {
    await new logModel({
      actionBy: userId,
      type: "CompanyAPI",
      method: "Delete",
      description: `Error deleting comment/reply for company ${companyId} by user ${userId}: ${error.message}`,
    }).save();
    response.json({
      success: false,
      message: error.message,
    });
  }
};

export default deleteComment;
