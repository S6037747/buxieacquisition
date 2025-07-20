import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import Header from "../components/dashboard/header.jsx";
import PageButtons from "../components/dashboard/pageButtons";
import TableCompanies from "../components/dashboard/tableCompanies.jsx";
import { tableSearch } from "../components/searchTable.jsx";

const Dashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const allTags = Array.from(
    new Set(companies.flatMap((company) => company.tags))
  );
  const {
    backendUrl,
    userData,
    isLoggedin,
    loading: authLoading,
  } = useContext(AppContext);

  // =======================================RENDER ON REFRESH============================================== //

  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedin) {
      navigate("/", { replace: true });
      return;
    }

    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${backendUrl}/api/company/data`);
        setCompanies(data.companies || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch companies. " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [authLoading, isLoggedin, backendUrl]);

  useEffect(() => {
    let filtered = companies;

    if (searchTerm) {
      filtered = tableSearch(filtered, searchTerm.toLowerCase(), [
        "name",
        "industry",
        "address.city",
        "status",
      ]);
    }

    if (tagInput.trim()) {
      const inputLower = tagInput.toLowerCase();
      const matchingTags = allTags.filter((tag) =>
        tag.toLowerCase().includes(inputLower)
      );

      if (matchingTags.length > 0) {
        filtered = filtered.filter((company) =>
          company.tags.some((tag) =>
            matchingTags.some(
              (match) => match.toLowerCase() === tag.toLowerCase()
            )
          )
        );
      } else {
        filtered = [];
      }
    }

    setFilteredCompanies(filtered);
  }, [searchTerm, tagInput, companies]);

  // =====================================MAIN HTML WEBSITE================================================== //

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Header />

      <div className="px-6 py-6 text-4xl font-semibold text-[#150958]">
        Welcome back{userData ? `, ${userData.name}` : ""}!
      </div>
      <p className="text-sm text-gray-500 mt-1 px-6">
        In this dashboard you are free to track any progress on business (B2B)
        contacts. This dashboard is meant for members of the Buixie board or any
        affiliates who require access. For any bugs or issue's please contact
        the system administrator.
      </p>
      {/* ---------- Main ---------- */}
      <main className="flex-1 overflow-y-auto p-6 overflow-x-hidden">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-semibold text-[#150958]">
            Business relations{" "}
            <span className="text-sm font-normal text-gray-500">
              ({filteredCompanies.length} results found)
            </span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
            <div className="relative">
              <input
                id="tag-search"
                type="text"
                value={tagInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setTagInput(value);
                  const matchedTag = allTags.find((tag) =>
                    tag.toLowerCase().startsWith(value.toLowerCase())
                  );
                  setSelectedTag(matchedTag || null);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                placeholder="Search by tag"
                className="border rounded-md px-3 py-2 w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
                autoComplete="off"
              />
              {showSuggestions && tagInput.length >= 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 shadow-md overflow-hidden">
                  {[
                    ...new Map(
                      allTags
                        .filter((tag) =>
                          tag.toLowerCase().includes(tagInput.toLowerCase())
                        )
                        .map((tag) => [tag.toLowerCase(), tag])
                    ).values(),
                  ]
                    .slice(0, 4)
                    .map((originalTag) => {
                      return (
                        <li
                          key={originalTag}
                          onClick={() => {
                            setSelectedTag(originalTag);
                            setTagInput(originalTag);
                          }}
                          className="px-3 py-2 hover:bg-gray-200 cursor-pointer transition-colors duration-150"
                        >
                          {originalTag}
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
            <input
              id="company-search"
              type="text"
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Find company"
              className="border rounded-md px-3 py-2 w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
            />
            <button
              onClick={() => navigate("/new-company")}
              className="bg-[#150958] text-white px-4 py-2 rounded hover:bg-[#4338CA] transition w-full sm:w-auto"
            >
              Add business contact
            </button>
          </div>
        </div>
        {/* Controls */}
        <div className="flex flex-col gap-2 sm:flex-col sm:items-start mb-4"></div>

        <TableCompanies
          companies={filteredCompanies}
          loading={loading}
          error={error}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
        />

        <div className="flex flex-wrap justify-between items-center mb-4 gap-4 px-1 py-4">
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

          <button
            onClick={() => navigate("/export")}
            className="bg-[#150958] text-white px-4 py-2 rounded hover:bg-[#4338CA] transition w-full sm:w-auto"
          >
            Export contacts (CSV)
          </button>
        </div>
        <PageButtons
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          totalCompanies={filteredCompanies.length}
        />
        <div className="mt-4 flex justify-center items-center">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <span>&copy;</span> 2025 Jeremy Zhou. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
