import {
  CalendarDaysIcon,
  EnvelopeIcon,
  PhoneIcon,
  TrashIcon,
  BuildingOfficeIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import WarningModel from "../company/warning";

const methodStyles = {
  email: {
    icon: <EnvelopeIcon className="w-4 h-4" />,
    text: "email",
    color: "bg-blue-100 text-blue-700",
  },
  phone: {
    icon: <PhoneIcon className="w-4 h-4" />,
    text: "phone",
    color: "bg-yellow-100 text-yellow-700",
  },
  location: {
    icon: <BuildingOfficeIcon className="w-4 h-4" />,
    text: "location",
    color: "bg-green-100 text-green-700",
  },
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const Interactions = ({ company, fetchCompany }) => {
  const [userNames, setUserNames] = useState({});
  const [interactionId, setInteractionId] = useState("");
  const { userData, backendUrl } = useContext(AppContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const interactions = company.interactions || [];
  const [selectedMethod, setSelectedMethod] = useState("email");
  const [addInteraction, setAddInteraction] = useState(false);
  const [description, setDescription] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);

  const interactionHandler = async () => {
    if (description.trim() === "") {
      return toast.error("Description cannot be empty");
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/interaction`,
        {
          companyId: company._id,
          description: description,
          method: selectedMethod,
        }
      );
      if (!data.success) {
        return toast.error(data.message);
      } else {
        toast.success(data.message);
        fetchCompany();
        setAddInteraction(false);
        setDescription("");
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const deleteHandler = async () => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/company/interaction`,
        { data: { companyId: company._id, interactionId: interactionId } }
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

      (interactions ?? []).forEach((interaction) => {
        ids.add(interaction.userId);
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
            Interactions
            <span className="text-sm font-normal text-gray-500 ml-1">
              ({interactions.length})
            </span>
          </h2>
          {!addInteraction && (
            <button
              onClick={() => {
                setAddInteraction(true);
              }}
              className="bg-[#150958] text-white px-4 py-2 rounded text-sm hover:bg-[#2a1b7a] transition-colors"
            >
              Add Interaction
            </button>
          )}
        </div>

        {interactions.map((itx) => {
          const method = methodStyles[itx.method] || methodStyles.email;
          const initials = getInitials(userNames[itx.userId] || "");
          const name = userNames[itx.userId] || "Loading...";

          return (
            <div
              key={itx._id}
              className="flex items-start gap-3 bg-gray-100 rounded-md p-4 mb-4 shadow-sm"
            >
              <div className="w-10 h-10 mt-1 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-base">
                {initials}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-800">
                        {name}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500 flex-wrap">
                        {method.icon}
                        <span className={`px-2 py-0.5 rounded ${method.color}`}>
                          <span className="hidden sm:inline">via </span>
                          {method.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* right: due‑date + menu */}
                  <div className="flex flex-col items-end relative">
                    <div className="relative flex items-center gap-1 text-sm text-gray-500">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>
                        <span className="sm:hidden">
                          {new Date(itx.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                          })}
                        </span>
                        <span className="hidden sm:inline">
                          {new Date(itx.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </span>
                      {(userData?.userId === itx.userId ||
                        userData?.role === "admin") && (
                        <button
                          className="ml-1 text-gray-500 hover:text-gray-700"
                          onClick={() =>
                            setMenuOpenId(
                              menuOpenId === itx._id ? null : itx._id
                            )
                          }
                        >
                          <EllipsisVerticalIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* dropdown */}
                    {menuOpenId === itx._id && (
                      <div className="absolute right-0 top-8 w-full bg-white border border-gray-200 rounded-md shadow-md">
                        <button
                          onClick={() => {
                            setMenuOpenId(null);
                            setWarningMessage(
                              "Are you sure you want to delete this interaction? This action cannot be undone."
                            );
                            setInteractionId(itx._id);
                            setShowConfirm(true);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <TrashIcon className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-1">{itx.description}</p>
              </div>
            </div>
          );
        })}

        {/* Empty‑state */}
        {interactions.length === 0 && (
          <p className="text-sm text-gray-500 italic mt-2">
            No interactions yet. Click “Add Interaction” to create one.
          </p>
        )}
        {addInteraction && (
          <>
            <hr className="my-4 border-t border-gray-200" />
            <div className="flex-1">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows="3"
                className="w-full border border-gray-300 rounded p-2 text-sm resize-none"
                placeholder="Add your interaction here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Interaction Method
              </label>
              <select
                className="w-full border border-gray-300 rounded p-2 text-sm mb-4"
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="location">Location</option>
              </select>
              <button
                onClick={() => {
                  interactionHandler();
                }}
                className="mt-2 bg-[#150958] text-white px-4 py-2 rounded text-sm hover:bg-[#2a1b7a] transition-colors"
              >
                Add Interaction
              </button>
              <button
                onClick={() => {
                  setAddInteraction(false);
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
          setInteractionId("");
        }}
        onConfirm={() => {
          setShowConfirm(false);
          deleteHandler();
        }}
      />
    </>
  );
};

export default Interactions;
