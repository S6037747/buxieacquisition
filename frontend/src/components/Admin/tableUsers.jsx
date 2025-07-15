import axios from "axios";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import {
  EllipsisVerticalIcon,
  TrashIcon,
  LockOpenIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronDoubleUpIcon,
  KeyIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import WarningModel from "../company/warning";
import { useNavigate } from "react-router-dom";

const TableUsers = ({
  error,
  users,
  loading,
  currentPage,
  rowsPerPage,
  refetchUsers,
}) => {
  const [userNames, setUserNames] = useState({});
  const { backendUrl } = useContext(AppContext);
  const [menuOpenId, setMenuOpenId] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("desc");

  const navigate = useNavigate();

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredUsers = users
    ?.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "totpActive") {
        aValue = aValue ? "true" : "false";
        bValue = bValue ? "true" : "false";
      } else if (sortField === "date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === "invitedBy") {
        aValue = userNames[aValue]?.toLowerCase() || "";
        bValue = userNames[bValue]?.toLowerCase() || "";
      } else {
        aValue = aValue?.toString().toLowerCase() || "";
        bValue = bValue?.toString().toLowerCase() || "";
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const resetPasswordHandler = async (email) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/request-reset-token`,
        { email: email }
      );

      if (!data.success) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const inviteUserHandler = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/invite`, {
        email: inviteEmail,
      });

      if (!data.success) {
        return toast.error(data.message);
      } else {
        toast.success(data.message);
        refetchUsers && refetchUsers();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resendInviteHandler = async (email) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/invite`, {
        email: email,
        resend: true,
      });

      if (!data.success) {
        return toast.error(data.message);
      } else {
        toast.success(data.message);
        refetchUsers && refetchUsers();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteUserHandler = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/delete`, {
        userIdDelete: userId,
      });

      if (!data.success) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        refetchUsers && refetchUsers();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const totpResetHandler = async (id) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/admin`, {
        userIdAction: id,
        totpReset: true,
      });

      if (!data.success) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        refetchUsers && refetchUsers();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const promoteHandler = async (id) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/admin`, {
        userIdAction: id,
        promote: true,
      });

      if (!data.success) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        refetchUsers && refetchUsers();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchNames = async () => {
      const ids = new Set();

      (users ?? []).forEach((user) => {
        ids.add(user.invitedBy);
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
  }, [users]);

  return (
    <>
      <main className="flex-1 relative p-6">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-semibold text-[#150958]">
            Users{" "}
            <span className="text-sm font-normal text-gray-500">
              ({users.length} results found)
            </span>
          </h2>
          <div className="flex gap-3 items-center">
            <input
              id="filter"
              type="text"
              placeholder="Find user"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-md px-3 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
            />
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-[#150958] text-white px-4 py-2 rounded hover:bg-[#4338CA] transition"
            >
              Invite a user
            </button>
          </div>
        </div>

        <div className="w-full bg-white shadow rounded-lg relative overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th
                  onClick={() => handleSort("name")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    Name
                    {sortField === "name" &&
                      (sortOrder === "asc" ? (
                        <ChevronUpIcon className="w-4 h-4 inline" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 inline" />
                      ))}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("role")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    Role
                    {sortField === "role" &&
                      (sortOrder === "asc" ? (
                        <ChevronUpIcon className="w-4 h-4 inline" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 inline" />
                      ))}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    Email
                    {sortField === "email" &&
                      (sortOrder === "asc" ? (
                        <ChevronUpIcon className="w-4 h-4 inline" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 inline" />
                      ))}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("totpActive")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    2FA Active
                    {sortField === "totpActive" &&
                      (sortOrder === "asc" ? (
                        <ChevronUpIcon className="w-4 h-4 inline" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 inline" />
                      ))}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("date")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    Created
                    {sortField === "date" &&
                      (sortOrder === "asc" ? (
                        <ChevronUpIcon className="w-4 h-4 inline" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 inline" />
                      ))}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("invitedBy")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    Invited by
                    {sortField === "invitedBy" &&
                      (sortOrder === "asc" ? (
                        <ChevronUpIcon className="w-4 h-4 inline" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 inline" />
                      ))}
                  </span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers
                  .slice(
                    (currentPage - 1) * rowsPerPage,
                    currentPage * rowsPerPage
                  )
                  .map((user, idx) => (
                    <tr key={idx} className="cursor-pointer hover:bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {(currentPage - 1) * rowsPerPage + idx + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user.totpActive ? "True" : "False"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(user.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {userNames[user.invitedBy]}
                      </td>
                      <td className="relative px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                        <button
                          onClick={() => {
                            setMenuOpenId(
                              menuOpenId === user._id ? null : user._id
                            );
                          }}
                        >
                          <EllipsisVerticalIcon className="w-6 h-6" />
                        </button>
                        {menuOpenId === user._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                            {user.role === "user" && (
                              <button
                                onClick={() => {
                                  setWarningMessage(
                                    "Are you sure you want to delete this user? This action cannot be undone."
                                  );
                                  setUserId(user._id);
                                  setShowConfirm(true);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-black hover:bg-gray-50"
                              >
                                <TrashIcon className="w-4 h-4" />
                                Delete
                              </button>
                            )}
                            {user.isAccountVerified && (
                              <button
                                onClick={() => {
                                  resetPasswordHandler(user.email);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-black hover:bg-gray-50"
                              >
                                <KeyIcon className="w-4 h-4" />
                                Password reset
                              </button>
                            )}

                            {user.totpActive && (
                              <button
                                onClick={() => {
                                  totpResetHandler(user._id);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-black hover:bg-gray-50"
                              >
                                <LockOpenIcon className="w-4 h-4" />
                                Reset 2FA
                              </button>
                            )}

                            {!user.isAccountVerified && (
                              <button
                                onClick={() => {
                                  resendInviteHandler(user.email);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-black hover:bg-gray-50"
                              >
                                <PaperAirplaneIcon className="w-4 h-4" />
                                Resend invite
                              </button>
                            )}

                            {user.role === "user" && (
                              <button
                                onClick={() => {
                                  promoteHandler(user._id);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-black hover:bg-gray-50"
                              >
                                <ChevronDoubleUpIcon className="w-4 h-4" />
                                Make Admin
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {showInviteModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/10 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-114">
              <h3 className="text-lg font-semibold mb-4">Invite User</h3>
              <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                You are about to invite a new user to the Buixie Dashboard. This
                will grant them full access to all platform data, including
                sensitive information.
              </p>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (inviteEmail.trim()) {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(inviteEmail)) {
                        toast.error("Please enter a valid email.");
                        return;
                      } else {
                        inviteUserHandler();
                        setShowInviteModal(false);
                        setInviteEmail("");
                      }
                    } else {
                      toast.error("Please enter a valid email.");
                    }
                  }}
                  className="px-4 py-2 bg-[#150958] text-white rounded hover:bg-[#4338CA]"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <WarningModel
        isOpen={showConfirm}
        message={warningMessage}
        onCancel={() => {
          setShowConfirm(false);
          setUserId("");
        }}
        onConfirm={() => {
          setShowConfirm(false);
          deleteUserHandler();
        }}
      />
    </>
  );
};

export default TableUsers;
