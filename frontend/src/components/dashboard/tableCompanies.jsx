import { useNavigate } from "react-router-dom";
import { tableSorter } from "../tableSorter";
import { useEffect, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const TableCompanies = ({
  companies: initialCompanies,
  loading,
  error,
  currentPage,
  rowsPerPage,
}) => {
  const [companies, setCompanies] = useState([]);
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const navigate = useNavigate();

  const handleSort = (key) => {
    const nextDir = sortKey === key && sortDir === "asc" ? "desc" : "asc";
    const sorted = tableSorter(companies, key, nextDir);

    setCompanies(sorted);
    setSortKey(key);
    setSortDir(nextDir);
  };

  useEffect(() => {
    // Sort initialCompanies by updatedAt desc before setting
    const sorted = tableSorter(initialCompanies, "updatedAt", "desc");
    setCompanies(sorted);
    setSortKey("updatedAt");
    setSortDir("desc");
  }, [initialCompanies]);

  return (
    <div className="overflow-x-auto w-full bg-white shadow rounded-lg">
      <table className="min-w-[700px] w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th
              onClick={() => handleSort("name")}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
            >
              <div className="flex items-center">
                Name
                {sortKey === "name" &&
                  (sortDir === "asc" ? (
                    <ChevronUpIcon className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  ))}
              </div>
            </th>
            <th
              onClick={() => handleSort("industry")}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
            >
              <div className="flex items-center">
                Industry
                {sortKey === "industry" &&
                  (sortDir === "asc" ? (
                    <ChevronUpIcon className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  ))}
              </div>
            </th>
            <th
              onClick={() => handleSort("address.city")}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
            >
              <div className="flex items-center">
                Location
                {sortKey === "location" &&
                  (sortDir === "asc" ? (
                    <ChevronUpIcon className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  ))}
              </div>
            </th>
            <th
              onClick={() => handleSort("status")}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
            >
              <div className="flex items-center">
                Status
                {sortKey === "status" &&
                  (sortDir === "asc" ? (
                    <ChevronUpIcon className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  ))}
              </div>
            </th>
            <th
              onClick={() => handleSort("updatedAt")}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
            >
              <div className="flex items-center">
                Last update
                {sortKey === "updatedAt" &&
                  (sortDir === "asc" ? (
                    <ChevronUpIcon className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  ))}
              </div>
            </th>
            <th
              onClick={() => handleSort("createdAt")}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
            >
              <div className="flex items-center">
                Created
                {sortKey === "createdAt" &&
                  (sortDir === "asc" ? (
                    <ChevronUpIcon className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  ))}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="7" className="px-6 py-4 text-center text-red-500">
                {error}
              </td>
            </tr>
          ) : companies.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                No companies found.
              </td>
            </tr>
          ) : (
            companies
              .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
              .map((company, idx) => (
                <tr
                  key={idx}
                  onClick={() => navigate(`/company/?id=${company._id}`)}
                  className="cursor-pointer hover:bg-gray-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {(currentPage - 1) * rowsPerPage + idx + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {company.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {company.industry || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {company.address?.city || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        company.status === "active"
                          ? "bg-green-100 text-green-800"
                          : company.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {company.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(company.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableCompanies;
