import axios from "axios";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const TableLogs = ({ error, logs, loading, currentPage, rowsPerPage }) => {
  const [userNames, setUserNames] = useState({});
  const { backendUrl } = useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredLogs = logs
    ?.filter((log) => {
      const userName = log.actionBy
        ? userNames[log.actionBy]?.toLowerCase() || "loading"
        : "automated";
      return userName.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === "name") {
        aValue = userNames[a.actionBy]?.toLowerCase() || "automated";
        bValue = userNames[b.actionBy]?.toLowerCase() || "automated";
      } else {
        aValue = aValue?.toString().toLowerCase() || "";
        bValue = bValue?.toString().toLowerCase() || "";
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  useEffect(() => {
    const fetchNames = async () => {
      const ids = new Set();

      (logs ?? []).forEach((log) => {
        if (log.actionBy) {
          ids.add(log.actionBy);
        }
      });

      const namesObj = {};
      for (let id of ids) {
        try {
          const { data } = await axios.get(
            `${backendUrl}/api/company/data/user/${id}`
          );
          if (data.success) {
            namesObj[id] = data.name;
          } else {
            namesObj[id] = "Automated";
          }
        } catch (err) {
          toast.error("Error fetching user name", err);
        }
      }

      (logs ?? []).forEach((log) => {
        if (!log.actionBy) {
          namesObj["Automated"] = "Automated";
        }
      });

      setUserNames(namesObj);
    };

    fetchNames();
  }, [logs]);

  return (
    <>
      <main className="flex-1 relative p-6">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-semibold text-[#150958]">
            Logs{" "}
            <span className="text-sm font-normal text-gray-500">
              ({logs.length} results found)
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
                  onClick={() => handleSort("type")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    Type
                    {sortField === "type" &&
                      (sortOrder === "asc" ? (
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
                    {sortField === "description" &&
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
                    Date
                    {sortField === "date" &&
                      (sortOrder === "asc" ? (
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
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No logs found. This means something went seriosuly wrong.
                    Contact me when you see this.
                  </td>
                </tr>
              ) : (
                filteredLogs
                  .slice(
                    (currentPage - 1) * rowsPerPage,
                    currentPage * rowsPerPage
                  )
                  .map((log, idx) => (
                    <tr key={idx} className="cursor-pointer hover:bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {((currentPage || 1) - 1) * (rowsPerPage || 10) +
                          idx +
                          1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {log.actionBy
                          ? userNames[log.actionBy] || "Loading..."
                          : "Automated"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {log.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {log.description.length > 75
                          ? log.description.slice(0, 75) + "..."
                          : log.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(log.date).toLocaleString()}
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

export default TableLogs;
