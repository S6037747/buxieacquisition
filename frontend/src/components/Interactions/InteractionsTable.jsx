import axios from "axios";
import { useContext, useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const InteractionsTable = ({
  error,
  companies,
  loading,
  currentPage,
  rowsPerPage,
}) => {
  const [userNames, setUserNames] = useState({});
  const { backendUrl } = useContext(AppContext);
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

  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  const [sortedInteractions, setSortedInteractions] = useState(interactions);

  const navigate = useNavigate();

  const handleSort = (key) => {
    const nextDir = sortKey === key && sortDir === "asc" ? "desc" : "asc";
    const sorted = [...interactions].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      if (valA < valB) return nextDir === "asc" ? -1 : 1;
      if (valA > valB) return nextDir === "asc" ? 1 : -1;
      return 0;
    });

    setSortedInteractions(sorted);
    setSortKey(key);
    setSortDir(nextDir);
  };

  useEffect(() => {
    setSortedInteractions(interactions);
  }, [interactions]);

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
  }, [interactions]);

  const filteredUsers = sortedInteractions.filter(
    (i) =>
      i.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userNames[i.userId]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <main className="flex-1 relative p-6">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-semibold text-[#150958]">
            Interactions{" "}
            <span className="text-sm font-normal text-gray-500">
              ({interactions.length} results found)
            </span>
          </h2>
          <div className="flex gap-3 items-center">
            <input
              id="filter"
              type="text"
              placeholder="Find interaction"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-md px-3 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
            />
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
                  onClick={() => handleSort("companyName")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    Company
                    {sortKey === "companyName" &&
                      (sortDir === "asc" ? (
                        <ChevronUpIcon className="w-4 h-4 inline" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 inline" />
                      ))}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("method")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    Method
                    {sortKey === "method" &&
                      (sortDir === "asc" ? (
                        <ChevronUpIcon className="w-4 h-4 inline" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 inline" />
                      ))}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("userId")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    By
                    {sortKey === "userId" &&
                      (sortDir === "asc" ? (
                        <ChevronUpIcon className="w-4 h-4 inline" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 inline" />
                      ))}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("description")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    Description
                    {sortKey === "description" &&
                      (sortDir === "asc" ? (
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
                    Date
                    {sortKey === "date" &&
                      (sortDir === "asc" ? (
                        <ChevronUpIcon className="w-4 h-4 inline" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 inline" />
                      ))}
                  </span>
                </th>
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
                  .map((i, idx) => (
                    <tr
                      key={idx}
                      onClick={() => {
                        navigate(`/company/?id=${i.companyId}`);
                      }}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {(currentPage - 1) * rowsPerPage + idx + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {i.companyName || ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {i.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {userNames[i.userId] || i.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {i.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(i.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default InteractionsTable;
