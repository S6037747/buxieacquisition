import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Header from "../components/dashboard/header";
import PageButtons from "../components/dashboard/pageButtons";
import InteractionsTable from "../components/Interactions/InteractionsTable";
import axios from "axios";

const Interactions = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const interactions = useMemo(() => {
    const allInteractions = companies.flatMap((company) =>
      company.interactions.map((interaction) => ({
        ...interaction,
        companyName: company.name,
        companyId: company._id,
      }))
    );
    return Array.from(new Set(allInteractions));
  }, [companies]);

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
        Buixie interactions.
      </div>
      <p className="text-sm text-gray-500 mt-1 px-6">
        Wanna know how we as buixie contact externals? This is the perfect page
        to see all possible interactions in a simple table. The search function
        finds interactions based on company name, description or who handled the
        interaction.
      </p>

      {/* ---------- Main ---------- */}
      <InteractionsTable
        loading={authLoading}
        interactions={interactions}
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
        totalItems={interactions.length}
      />

      <div className="mt-4 flex justify-center items-center">
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <span>&copy;</span> 2025 Jeremy Zhou. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Interactions;
