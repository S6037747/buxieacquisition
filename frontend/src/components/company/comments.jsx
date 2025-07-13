import { TrashIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AppContext } from "../../context/AppContext";
import WarningModel from "../company/warning";
import { toast } from "react-toastify";

const Comments = ({ company, fetchCompany }) => {
  const comments = company.comments;
  const { backendUrl, userData } = useContext(AppContext);
  const [activeReplyIndex, setActiveReplyIndex] = useState(null);
  const [commentId, setCommentId] = useState("");
  const [replyId, setReplyId] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [reply, setReply] = useState("");
  const [comment, setComment] = useState("");
  const [userNames, setUserNames] = useState({});

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const commentHandler = async () => {
    if (comment.trim() === "") {
      return toast.error("Comment cannot be empty");
    }
    try {
      const { data } = await axios.post(`${backendUrl}/api/company/comment`, {
        companyId: company._id,
        comment: comment,
      });
      if (!data.success) {
        return toast.error(data.message);
      } else {
        toast.success(data.message);
        fetchCompany();
        setComment("");
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const deleteHandler = async () => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/company/comment`, {
        data: {
          companyId: company._id,
          commentId: commentId,
          replyId: replyId,
        },
      });

      if (!data.success) {
        return toast.error(data.message);
      }
      {
        toast.success(data.message);
        fetchCompany();
        setCommentId("");
        setReplyId("");
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const replyHandler = async (commentId) => {
    if (reply.trim() === "") {
      return toast.error("Comment cannot be empty");
    }
    try {
      const { data } = await axios.post(`${backendUrl}/api/company/comment`, {
        companyId: company._id,
        reply: reply,
        commentId: commentId,
      });
      if (!data.success) {
        return error.toast(data.message);
      }
      {
        toast.success(data.message);
        fetchCompany();
        setCommentId("");
        setActiveReplyIndex(null);
        setReply("");
      }
    } catch (error) {
      return error.toast(error.message);
    }
  };

  useEffect(() => {
    const fetchNames = async () => {
      const ids = new Set();

      (company.comments ?? []).forEach((comment) => {
        ids.add(comment.userId);
        comment.replies?.forEach((r) => ids.add(r.userId));
      });

      const namesObj = {};
      for (let id of ids) {
        try {
          const { data } = await axios.get(
            `${backendUrl}/api/company/data/user/${id}`
          );
          if (data.success) {
            namesObj[id] = data.name;
          }
        } catch (err) {
          toast.error("Error fetching user name", err);
        }
      }

      setUserNames(namesObj);
    };

    fetchNames();
  }, [company]);

  return (
    <>
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Comments{" "}
          <span className="text-sm font-normal text-gray-500">
            ({comments?.length || 0})
          </span>
        </h2>
        <div className="space-y-3 mb-4">
          {comments?.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              No comments yet. Be the first to comment.
            </p>
          )}
          {(comments ?? []).map((comment, index) => (
            <div key={index} className="flex flex-col gap-2 py-3">
              {/* Main comment */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs">
                  {getInitials(userNames[comment.userId])}
                </div>
                <div className="bg-gray-100 rounded-md px-4 py-2 w-full shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm text-gray-800">
                      {userNames[comment.userId] || "Loading..."}
                    </span>
                    <span className="text-xs text-gray-500">
                      {comment.date.split("T")[0]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.comment}</p>
                  <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveReplyIndex(index);
                      }}
                      className="flex items-center gap-1 text-gray-500 hover:underline text-xs"
                    >
                      <ArrowUturnLeftIcon className="w-4 h-4" />
                      Reply
                    </button>
                    {(userData.userId === comment.userId ||
                      userData?.role === "admin") && (
                      <button
                        onClick={() => {
                          setWarningMessage(
                            "Are you sure you wanna delete this comment? This action cannot be undone."
                          );
                          setShowConfirm(true);
                          setCommentId(comment._id);
                        }}
                        className="flex items-center gap-1 text-gray-500 hover:underline text-xs"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {activeReplyIndex === index && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 ml-10 text-gray-700 flex items-center justify-center font-bold text-xs">
                      You
                    </div>
                    <div className="flex-1">
                      <textarea
                        rows="3"
                        className="w-full border border-gray-300 rounded p-2 text-sm resize-none"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Add your reply here..."
                      />
                      <button
                        onClick={() => {
                          replyHandler(comment._id);
                        }}
                        className="mt-2 bg-[#150958] text-white px-4 py-2 rounded text-sm hover:bg-[#2a1b7a] transition-colors"
                      >
                        Add Reply
                      </button>
                      <button
                        onClick={() => setActiveReplyIndex(null)}
                        className="mt-2 ml-4 px-4 py-2 rounded text-sm border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Replies */}
              {comment.replies &&
                comment.replies.map((reply, rIndex) => (
                  <div
                    key={rIndex}
                    className="flex items-start gap-3 ml-10 mt-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs">
                      {getInitials(userNames[reply.userId])}
                    </div>
                    <div className="bg-gray-100 rounded-md px-4 py-2 w-full shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm text-gray-800">
                          {userNames[reply.userId] || "Loading..."}
                        </span>
                        <span className="text-xs text-gray-500">
                          {reply.date.split("T")[0]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{reply.reply}</p>
                      <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                        {(userData.userId === reply.userId ||
                          userData?.role === "admin") && (
                          <button
                            onClick={() => {
                              setWarningMessage(
                                "Are you sure you wanna delete this reply? This action cannot be undone."
                              );
                              setShowConfirm(true);
                              setCommentId(comment._id);
                              setReplyId(reply._id);
                            }}
                            className="flex items-center gap-1 text-gray-500 hover:underline text-xs"
                          >
                            <TrashIcon className="w-4 h-4" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
        <hr className="my-4 border-t border-gray-200" />

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs">
            You
          </div>
          <div className="flex-1">
            <textarea
              rows="3"
              className="w-full border border-gray-300 rounded p-2 text-sm resize-none"
              placeholder="Add your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              onClick={() => {
                commentHandler();
              }}
              className="mt-2 bg-[#150958] text-white px-4 py-2 rounded text-sm hover:bg-[#2a1b7a] transition-colors"
            >
              Add Comment
            </button>
          </div>
        </div>
      </section>
      <WarningModel
        isOpen={showConfirm}
        message={warningMessage}
        onCancel={() => {
          setShowConfirm(false);
          setCommentId("");
          setReplyId("");
        }}
        onConfirm={() => {
          setShowConfirm(false);
          deleteHandler();
        }}
      />
    </>
  );
};

export default Comments;
