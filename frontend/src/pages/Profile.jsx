import {
  PencilSquareIcon,
  LockClosedIcon,
  EnvelopeIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Header from "../components/dashboard/header";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const {
    backendUrl,
    isLoggedin,
    loading: authLoading,
    userData,
    getUserData,
  } = useContext(AppContext);

  const [name, setName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changeNameHandler = async () => {
    if (name.trim().toLowerCase() === userData.name.trim().toLowerCase()) {
      toast.error("Change your name.");
      return;
    }
    try {
      const { data } = await axios.patch(`${backendUrl}/api/user/patch`, {
        name: name,
      });
      if (!data.success) {
        return toast.error(data.message);
      } else {
        getUserData();
        setActiveEdit(null);
        return toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (!data.success) {
        toast.error(data.message);
      } else {
        toast.dismiss();
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeEmailHandler = async () => {
    setNewEmail(newEmail.toLowerCase());
    if (newEmail.trim() === userData.email.trim()) {
      return toast.error("Change your email.");
    }
    try {
      const { data } = await axios.patch(`${backendUrl}/api/user/patch`, {
        email: newEmail,
      });
      if (!data.success) {
        return toast.error(data.message);
      } else {
        getUserData();
        setActiveEdit(null);
        return toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changePasswordHandler = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!newPassword.trim() & !confirmPassword.trim()) {
      toast.error("Password cannot be empty");
      return;
    }
    try {
      const { data } = await axios.patch(`${backendUrl}/api/user/patch`, {
        password: newPassword,
      });
      if (!data.success) {
        return toast.error(data.message);
      } else {
        setActiveEdit(null);
        return toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    // Block until auth check is complete
    if (authLoading) return;

    // Redirect if user is not logged in
    if (!isLoggedin) {
      navigate("/", { replace: true });
      return;
    }
  }, [authLoading, isLoggedin, backendUrl]);

  useEffect(() => {
    if (userData?.name) setName(userData.name);
    if (userData?.email) setNewEmail(userData.email);
  }, [userData]);

  // Editing states
  const [activeEdit, setActiveEdit] = useState(null);
  // Show/hide password state
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <UserIcon className="h-6 w-6 text-gray-700" /> My Profile
            </h2>
            <button
              onClick={() => {
                logoutHandler();
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" /> Logout
            </button>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center text-2xl sm:text-3xl font-medium text-gray-600">
              {userData.name?.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">
                {userData.name}
              </h3>
              <p className="text-sm text-gray-500">{userData.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {/* Name box section */}
            <div className="flex items-start gap-3 rounded-lg py-2 px-3">
              <UserIcon className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1">
                {activeEdit === "name" ? (
                  <>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        className="px-4 py-2 rounded bg-[#150958] text-white hover:bg-opacity-90 text-sm"
                        onClick={() => {
                          changeNameHandler();
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm"
                        onClick={() => setActiveEdit(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-sm sm:text-base font-medium">
                      {userData.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">Name</p>
                  </div>
                )}
              </div>
              {activeEdit !== "name" && (
                <button
                  className="p-2 rounded hover:bg-gray-100 self-start"
                  onClick={() => setActiveEdit("name")}
                >
                  <PencilSquareIcon className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </div>
            {/* Email section */}
            <div className="flex items-start gap-3 rounded-lg py-2 px-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1">
                {activeEdit === "email" ? (
                  <>
                    <input
                      type="email"
                      defaultValue={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        className="px-4 py-2 rounded bg-[#150958] text-white hover:bg-opacity-90 text-sm"
                        onClick={() => {
                          if (newEmail.trim()) {
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(newEmail)) {
                              toast.error("Please enter a valid email.");
                              return;
                            }
                            changeEmailHandler();
                          } else {
                            toast.error("Email cannot be empty.");
                          }
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm"
                        onClick={() => setActiveEdit(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-sm sm:text-base font-medium">
                      {userData.email}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">Email</p>
                  </div>
                )}
              </div>
              {activeEdit !== "email" && (
                <button
                  className="p-2 rounded hover:bg-gray-100 self-start"
                  onClick={() => setActiveEdit("email")}
                >
                  <PencilSquareIcon className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </div>
            {/* Password section */}
            <div className="flex items-start gap-3 rounded-lg py-2 px-3">
              <LockClosedIcon className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1">
                {activeEdit === "password" ? (
                  <>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded pr-10"
                      />
                      <div
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                    <div className="relative mt-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded pr-10"
                      />
                      <div
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="px-4 py-2 rounded bg-[#150958] text-white hover:bg-opacity-90 text-sm"
                        onClick={changePasswordHandler}
                      >
                        Save
                      </button>
                      <button
                        className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm"
                        onClick={() => setActiveEdit(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-sm sm:text-base font-medium">••••••••</p>
                    <p className="text-xs sm:text-sm text-gray-500">Password</p>
                  </div>
                )}
              </div>
              {activeEdit !== "password" && (
                <button
                  className="p-2 rounded hover:bg-gray-100 self-start"
                  onClick={() => setActiveEdit("password")}
                >
                  <PencilSquareIcon className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <div className="mb-4 flex justify-center items-center">
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <span>&copy;</span> 2025 Jeremy Zhou. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Profile;
