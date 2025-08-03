import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const Progress = ({ company, fetchCompany }) => {
  const [userNames, setUserNames] = useState({});
  const { userData, backendUrl } = useContext(AppContext);
  const progressArray = company.progress || [];
  const latestProgress =
    progressArray.length > 0 ? progressArray[progressArray.length - 1] : null;
  const [changeProgress, setChangeProgress] = useState(false);
  const [description, setDescription] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const progressHandler = async () => {
    if (description.trim() === "") {
      return toast.error("Description cannot be empty");
    }
    try {
      const { data } = await axios.post(`${backendUrl}/api/company/progress`, {
        companyId: company._id,
        description: description,
      });
      if (!data.success) {
        return toast.error(data.message);
      } else {
        toast.success(data.message);
        fetchCompany();
        setChangeProgress(false);
        setDescription("");
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchLatestUserName = async () => {
      if (!progressArray || progressArray.length === 0) return;

      const latestProgress = progressArray[progressArray.length - 1];
      const userId = latestProgress.userId;

      try {
        const { data } = await axios.get(
          `${backendUrl}/api/company/data/user/${userId}`
        );
        if (data.success) {
          setUserNames({ [userId]: data.name });
        }
      } catch (err) {
        toast.error("Error fetching user name", err);
      }
    };

    fetchLatestUserName();
  }, [company, progressArray]);

  return (
    <>
      <section className="bg-white p-6 rounded-xl border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Progress</h2>
          <div className="flex gap-2">
            {progressArray.length > 1 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300 transition-colors"
              >
                View History
              </button>
            )}
            {!changeProgress && (
              <button
                onClick={() => setChangeProgress(true)}
                className="bg-[#150958] text-white px-4 py-2 rounded text-sm hover:bg-[#2a1b7a] transition-colors"
              >
                Change Progress
              </button>
            )}
          </div>
        </div>

        {/* Latest Progress */}
        {latestProgress ? (
          <div className="flex items-start gap-3 bg-gray-100 rounded-md p-4 mb-4 shadow-sm">
            <div className="w-10 h-10 mt-1 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-base">
              {getInitials(userNames[latestProgress.userId] || "")}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-800">
                    {userNames[latestProgress.userId] || "Unknown"}
                  </span>
                </div>
                <div className="relative flex items-center gap-1 text-sm text-gray-500">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>
                    <span className="sm:hidden">
                      {new Date(latestProgress.date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "2-digit",
                        }
                      )}
                    </span>
                    <span className="hidden sm:inline">
                      {new Date(latestProgress.date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-1">
                {latestProgress.description}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic mt-2">
            No progress logged yet. Click “Change Progress” to add one.
          </p>
        )}

        {/* Progress History Modal */}
        {showHistory && (
          <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Progress History
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <div className="space-y-4">
                {progressArray.map((prog) => (
                  <div
                    key={prog.date + prog.userId}
                    className="flex items-start gap-3 bg-gray-50 rounded-md p-4"
                  >
                    <div className="w-10 h-10 mt-1 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-base">
                      {getInitials(userNames[prog.userId] || "")}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-800">
                          {userNames[prog.userId] || "Unknown"}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <CalendarDaysIcon className="w-4 h-4" />
                          <span>
                            {new Date(prog.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">
                        {prog.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-right">
                <button
                  onClick={() => setShowHistory(false)}
                  className="bg-[#150958] text-white px-4 py-2 rounded text-sm hover:bg-[#2a1b7a] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Progress Form */}
        {changeProgress && (
          <>
            <hr className="my-4 border-t border-gray-200" />
            <div className="flex-1">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows="3"
                className="w-full border border-gray-300 rounded p-2 text-sm resize-none"
                placeholder="Change your progress here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button
                onClick={progressHandler}
                className="mt-2 bg-[#150958] text-white px-4 py-2 rounded text-sm hover:bg-[#2a1b7a] transition-colors"
              >
                Save Progress
              </button>
              <button
                onClick={() => {
                  setChangeProgress(false);
                  setDescription("");
                }}
                className="mt-2 ml-4 px-4 py-2 rounded text-sm border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default Progress;
