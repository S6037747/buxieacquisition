import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Header from "../components/dashboard/header";
import TableUsers from "../components/Admin/tableUsers.jsx";
import PageButtons from "../components/dashboard/pageButtons";
import { useState } from "react";
import axios from "axios";

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    backendUrl,
    isLoggedin,
    loading: authLoading,
    userData,
  } = useContext(AppContext);

  useEffect(() => {
    if (authLoading) return;

    // Redirect if user is not logged in
    if (!isLoggedin) {
      return navigate("/", { replace: true });
    }

    if (userData && userData.role !== "admin") {
      return navigate("/dashboard", { replace: true });
    }

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/all-data`);
        setUsers(data.users || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch users. " + err.message);
      }
    };

    fetchUsers();
  }, [authLoading, isLoggedin, backendUrl]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />

      <div className="px-6 py-6 text-4xl font-semibold text-[#150958]">
        Woah! Someone is important.
      </div>
      <p className="text-sm text-gray-500 mt-1 px-6">
        Welcome to the admin panel. Here you can see all users who have access
        to the Buixie Dashboard. And if needed you can reset 2FA or invite new
        users.
      </p>

      {/* ---------- Main ---------- */}
      <TableUsers
        loading={authLoading}
        users={users}
        error={error}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
      />

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
        totalCompanies={users.length}
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
