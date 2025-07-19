import companyModel from "../../models/companyModel.js";
import userModel from "../../models/userModel.js";
import logModel from "../../models/logModel.js";

const postComment = async (request, response) => {
  const { companyId, userId, comment, reply, commentId } = request.body;

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

    if (reply && commentId) {
      if (!reply.trim()) {
        return response.json({
          success: false,
          message: "Reply is empty.",
        });
      }

      const parentComment = company.comments.id(commentId);
      if (!parentComment) {
        return response.json({
          success: false,
          message: "Parent comment not found.",
        });
      }

      parentComment.replies.push({
        userId,
        reply: reply.trim(),
        date: new Date().toISOString(),
      });

      await company.save();
      await new logModel({
        actionBy: userId,
        type: "CompanyAPI",
        method: "Post",
        description: `Added reply to comment ${commentId} for company ${companyId} by user ${userId}`,
      }).save();
      return response.json({
        success: true,
        message: "Reply added.",
      });
    } else if (comment) {
      if (!comment.trim()) {
        return response.json({
          success: false,
          message: "Comment is empty.",
        });
      }

      company.comments.push({
        userId,
        date: new Date().toISOString(),
        comment: comment.trim(),
        replies: [],
      });

      company.updatedAt = Date.now();

      await company.save();
      await new logModel({
        actionBy: userId,
        type: "CompanyAPI",
        method: "Post",
        description: `Added comment to company ${companyId} by user ${userId}`,
      }).save();
      return response.json({
        success: true,
        message: "Comment added.",
      });
    } else {
      return response.json({
        success: false,
        message: "Missing comment or reply.",
      });
    }
  } catch (error) {
    await new logModel({
      actionBy: userId,
      type: "CompanyAPI",
      method: "Post",
      description: `Error adding comment/reply for company ${companyId} by user ${userId}: ${error.message}`,
    }).save();
    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export default postComment;
