import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Header from "../components/dashboard/header";
import TableUsers from "../components/Admin/tableUsers.jsx";
import PageButtons from "../components/dashboard/pageButtons";
import { useState } from "react";
import axios from "axios";
import TableLogs from "../components/Admin/tableLogs.jsx";

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [view, setView] = useState("users");
  const [error, setError] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    backendUrl,
    isLoggedin,
    loading: authLoading,
    userData,
  } = useContext(AppContext);

  // Move fetchUsers outside useEffect so it can be passed down
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/all-data`);
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users. " + err.message);
    }
  };

  const fetchLogs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/log`);
      setLogs(data.logs || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch logs. " + err.message);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    // Redirect if user is not logged in
    if (!isLoggedin) {
      return navigate("/", { replace: true });
    }

    if (userData && userData.role !== "admin") {
      return navigate("/dashboard", { replace: true });
    }

    fetchUsers();
    fetchLogs();
  }, [authLoading, isLoggedin, backendUrl]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />

      <div className="px-6 py-6 text-4xl font-semibold text-[#150958]">
        Woah! Someone is important.
      </div>
      <p className="text-sm text-gray-500 mt-1 px-6">
        Welcome to the admin panel. This section provides administrators with
        comprehensive tools to manage user access and monitor platform
        activities. You can view the list of all registered users who have
        access to the Buixie Dashboard, manage their authentication settings
        including resetting 2FA, and invite new team members to collaborate.
        Additionally, the panel offers access to detailed activity logs that
        track significant user actions, such as logins, account changes, and
        security events, ensuring transparency and accountability across the
        platform.
      </p>

      {/* ---------- Main ---------- */}
      <div className="inline-flex pt-6 px-6 rounded-md" role="group">
        <button
          className={`px-4 py-2 text-sm font-medium border rounded-l-md ${
            view === "users"
              ? "bg-[#150958] text-white"
              : "bg-white text-gray-700 border-gray-300"
          }`}
          onClick={() => setView("users")}
        >
          Users
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-t border-b border-r rounded-r-md ${
            view === "logs"
              ? "bg-[#150958] text-white"
              : "bg-white text-gray-700 border-gray-300"
          }`}
          onClick={() => setView("logs")}
        >
          Logs
        </button>
      </div>

      {view === "users" ? (
        <TableUsers
          loading={authLoading}
          users={users}
          error={error}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          refetchUsers={fetchUsers}
        />
      ) : (
        <TableLogs
          loading={authLoading}
          logs={logs}
          error={error}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
        />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 px-7 gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="maxRows" className="text-sm text-gray-700">
            Rows:
          </label>
          <select
            id="maxRows"
            className="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      <PageButtons
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        totalItems={view === "users" ? users.length : logs.length}
      />

      <div className="mt-4 flex justify-center items-center">
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <span>&copy;</span> 2025 Jeremy Zhou. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Admin;
