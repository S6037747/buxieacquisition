import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Header from "../components/dashboard/header";
import PageButtons from "../components/dashboard/pageButtons";
import RemindersTable from "../components/reminders/RemindersTable";
import axios from "axios";

const Reminders = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [companies, setCompanies] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    backendUrl,
    isLoggedin,
    loading: authLoading,
  } = useContext(AppContext);

  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedin) {
      navigate("/", { replace: true });
      return;
    }

    const fetchCompanies = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/company/data`);
        setCompanies(data.companies || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch companies. " + err.message);
      }
    };

    fetchCompanies();
  }, [authLoading, isLoggedin, backendUrl]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />
      <div className="px-6 py-6 text-4xl font-semibold text-[#150958]">
        Buixie reminders.
      </div>
      <p className="text-sm text-gray-500 mt-1 px-6">
        Here you can find all pending reminders. Reminders are your to-do list,
        and they make sure you do certain actions which have to be done later.
        You can see your own reminders or overdue reminders of other users.
        Mainly to check if they did not "verzaakt". We always send a email about
        a reminder on the due date itself to the user.
      </p>

      {/* ---------- Main ---------- */}
      <RemindersTable
        error={error}
        loading={authLoading}
        companies={companies}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 px-7 gap-2">
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
        totalCompanies={companies.length}
      />

      <div className="mb-4 flex justify-center items-center">
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <span>&copy;</span> 2025 Jeremy Zhou. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Reminders;
