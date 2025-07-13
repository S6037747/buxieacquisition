import { CalendarDaysIcon, TrashIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import WarningModel from "../company/warning";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const Reminders = ({ company, fetchCompany }) => {
  const [userNames, setUserNames] = useState({});
  const [reminderId, setReminderId] = useState("");
  const { userData, backendUrl } = useContext(AppContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [warningMessage, setWarningMessage] = useState("");
  const reminders = [...(company.reminders || [])].sort((a, b) => {
    const now = new Date();
    const aDue = new Date(a.dueDate);
    const bDue = new Date(b.dueDate);

    const aCompleted = a.completed;
    const bCompleted = b.completed;

    const aOverdue = !aCompleted && aDue < now;
    const bOverdue = !bCompleted && bDue < now;

    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    if (!aCompleted && bCompleted) return -1;
    if (aCompleted && !bCompleted) return 1;

    return aDue - bDue;
  });
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [addReminder, setAddReminder] = useState(false);
  const [description, setDescription] = useState("");

  const reminderHandler = async () => {
    if (description.trim() === "") {
      return toast.error("Description cannot be empty");
    }

    if (!dueDate || new Date(dueDate) < new Date()) {
      return toast.error("Please select a valid future due date.");
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/company/reminder`, {
        companyId: company._id,
        description: description,
        priority: priority,
        dueDate: dueDate,
      });
      if (!data.success) {
        return toast.error(data.message);
      } else {
        toast.success(data.message);
        setAddReminder(false);
        setDescription("");
        setDueDate("");
        fetchCompany();
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const patchHandler = async (reminderId, newState) => {
    try {
      const { data } = await axios.patch(`${backendUrl}/api/company/reminder`, {
        companyId: company._id,
        reminderId: reminderId,
        completed: newState,
      });

      if (!data.success) {
        return toast.error(data.message);
      } else {
        toast.success(data.message);
        fetchCompany();
        setMenuOpenId(null);
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };
  const deleteHandler = async () => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/company/reminder`,
        { data: { companyId: company._id, reminderId: reminderId } }
      );
      if (!data.success) {
        return toast.error(data.message);
      } else {
        toast.success(data.message);
        fetchCompany();
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchNames = async () => {
      const ids = new Set();

      (reminders ?? []).forEach((reminder) => {
        ids.add(reminder.userId);
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
      <section className="bg-white p-6 rounded-xl border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Reminders
            <span className="text-sm font-normal text-gray-500 ml-1">
              ({reminders.length})
            </span>
          </h2>
          {!addReminder && (
            <button
              onClick={() => {
                setAddReminder(true);
              }}
              className="bg-[#150958] text-white px-4 py-2 rounded text-sm hover:bg-[#2a1b7a] transition-colors"
            >
              Add Reminder
            </button>
          )}
        </div>

        {reminders.map((itx) => {
          const initials = getInitials(userNames[itx.userId] || "");
          const name = userNames[itx.userId] || "Loading…";

          const isOverdue = new Date(itx.dueDate) < new Date() && !itx.state;
          const isCompleted = itx.completed;

          const bgClass = isCompleted
            ? "bg-gray-50 border-gray-200"
            : isOverdue
            ? "bg-red-50 border-red-200"
            : "bg-blue-50 border-blue-200";

          const priorityColors = {
            low: "bg-green-100 text-green-800",
            normal: "bg-blue-100 text-blue-800",
            high: "bg-orange-100 text-orange-800",
            urgent: "bg-red-100 text-red-800",
          };

          return (
            <div
              key={itx._id}
              className={`relative flex flex-wrap justify-between gap-3 border rounded-md p-4 mb-4 shadow-sm ${bgClass}`}
            >
              {/* left avatar + text */}
              <div className="flex flex-1 items-start gap-3 min-w-0">
                <div className="min-w-[2.5rem] w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base">
                  {initials}
                </div>
                <div className="flex flex-col min-w-0">
                  {/* top‑line name & badges */}
                  <div className="flex flex-wrap items-center gap-2 py-1">
                    <span className="font-semibold text-sm text-gray-900">
                      {name}
                    </span>
                    <span
                      className={`hidden sm:flex text-xs px-2 py-0.5 rounded-full font-medium items-center gap-1 ${
                        priorityColors[itx.priority]
                      }`}
                    >
                      <span className="text-[10px]">⏲</span> {itx.priority}
                    </span>
                    {isCompleted ? (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    ) : isOverdue ? (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-800">
                        Overdue
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* description */}
                  <p
                    className={`text-sm break-words py-1 ${
                      isCompleted
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {itx.description}
                  </p>

                  {/* created on */}
                  <p className="text-xs text-gray-400 mt-1">
                    Created on{" "}
                    <span>
                      {new Date(itx.created).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: window.innerWidth >= 640 ? "numeric" : undefined,
                      })}
                    </span>
                  </p>
                </div>
              </div>

              {/* right: due‑date + menu */}
              <div className="flex flex-col items-end text-sm text-gray-500">
                <div className="flex flex-row items-center gap-2">
                  <div className="flex items-center gap-1">
                    <CalendarDaysIcon className="w-4 h-4" />
                    <span
                      className={
                        isOverdue && !itx.completed
                          ? "text-red-600 font-semibold"
                          : ""
                      }
                    >
                      {new Date(itx.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: window.innerWidth >= 640 ? "numeric" : undefined,
                      })}
                    </span>
                  </div>
                  {(userData?.userId === itx.userId ||
                    userData?.role === "admin") && (
                    <button
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      onClick={() =>
                        setMenuOpenId(menuOpenId === itx._id ? null : itx._id)
                      }
                    >
                      <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* dropdown */}
                {menuOpenId === itx._id && (
                  <div className="absolute right-4 top-10 z-10 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                    <button
                      onClick={() => {
                        patchHandler(itx._id, !isCompleted);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 whitespace-nowrap"
                    >
                      <CheckIcon className="w-4 h-4 text-green-600" />
                      {!isCompleted ? "Mark as done" : "Mark as pending"}
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpenId(null);
                        setWarningMessage(
                          "Are you sure you want to delete this reminder? This action cannot be undone."
                        );
                        setReminderId(itx._id);
                        setShowConfirm(true);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty‑state */}
        {reminders.length === 0 && (
          <p className="text-sm text-gray-500 italic mt-2">
            No reminders yet. Click “Add Reminder” to create one.
          </p>
        )}
        {addReminder && (
          <>
            <hr className="my-4 border-t border-gray-200" />
            <div className="flex-1">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows="3"
                className="w-full border border-gray-300 rounded p-2 text-sm resize-none"
                placeholder="Add your reminder here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded p-2 text-sm"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded p-2 text-sm"
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  reminderHandler();
                }}
                className="mt-2 bg-[#150958] text-white px-4 py-2 rounded text-sm hover:bg-[#2a1b7a] transition-colors"
              >
                Add Reminder
              </button>
              <button
                onClick={() => {
                  setAddReminder(false);
                }}
                className="mt-2 ml-4 px-4 py-2 rounded text-sm border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </section>
      <WarningModel
        isOpen={showConfirm}
        message={warningMessage}
        onCancel={() => {
          setShowConfirm(false);
        }}
        onConfirm={() => {
          setShowConfirm(false);
          deleteHandler();
        }}
      />
    </>
  );
};

export default Reminders;
