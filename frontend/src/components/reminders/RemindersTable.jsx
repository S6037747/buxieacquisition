import axios from "axios";
import { useContext, useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const RemindersTable = ({
  error,
  companies,
  loading,
  currentPage,
  rowsPerPage,
}) => {
  const [view, setView] = useState("mine");
  const [userNames, setUserNames] = useState({});
  const { backendUrl, userData } = useContext(AppContext);

  const reminders = useMemo(() => {
    const allReminders = companies.flatMap((company) =>
      company.reminders
        .filter((reminder) => reminder.completed === false)
        .map((reminder) => ({
          ...reminder,
          companyName: company.name,
          companyId: company._id,
        }))
    );
    return Array.from(new Set(allReminders));
  }, [companies]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("due");
  const [sortDir, setSortDir] = useState("desc");

  const [sortedReminders, setSortedReminders] = useState(reminders);

  const navigate = useNavigate();

  const handleSort = (key) => {
    const nextDir = sortKey === key && sortDir === "asc" ? "desc" : "asc";
    const sorted = [...reminders].sort((a, b) => {
      const valA = key === "due" ? a["dueDate"] : a[key];
      const valB = key === "due" ? b["dueDate"] : b[key];
      if (valA < valB) return nextDir === "asc" ? -1 : 1;
      if (valA > valB) return nextDir === "asc" ? 1 : -1;
      return 0;
    });

    setSortedReminders(sorted);
    setSortKey(key);
    setSortDir(nextDir);
  };

  useEffect(() => {
    const sorted = [...reminders].sort((a, b) => {
      const valA = a["dueDate"];
      const valB = b["dueDate"];
      if (valA < valB) return -1;
      if (valA > valB) return 1;
      return 0;
    });
    setSortedReminders(sorted);
  }, [reminders]);

  useEffect(() => {
    const fetchNames = async () => {
      const ids = new Set();

      (reminders ?? []).forEach((reminder) => {
        ids.add(reminder.userId);
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
  }, [reminders]);

  // Filter reminders based on view
  let filteredUsers = sortedReminders;
  if (view === "mine") {
    filteredUsers = filteredUsers.filter(
      (i) => i.userId?.toString() === userData?.userId
    );
  } else if (view === "overdue") {
    filteredUsers = filteredUsers.filter(
      (i) => new Date(i.dueDate) < new Date()
    );
  }
  // Apply search filter
  filteredUsers = filteredUsers.filter(
    (i) =>
      i.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <main className="flex-1 relative p-6">
        <div className="inline-flex py-1 rounded-md" role="group">
          <button
            className={`px-4 py-2 text-sm font-medium border rounded-l-md ${
              view === "mine"
                ? "bg-[#150958] text-white"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => setView("mine")}
          >
            My Reminders
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-t border-b border-r rounded-r-md ${
              view === "overdue"
                ? "bg-[#150958] text-white"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => setView("overdue")}
          >
            Overdue
          </button>
        </div>

        <div className="flex items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-semibold text-[#150958]">
            Reminders{" "}
            <span className="text-sm font-normal text-gray-500">
              ({filteredUsers.length} results found)
            </span>
          </h2>
          <div className="flex items-center">
            <input
              id="filter"
              type="text"
              placeholder="Find reminder"
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
                {view === "overdue" && (
                  <th
                    onClick={() => handleSort("by")}
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
                )}
                <th
                  onClick={() => handleSort("created")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    Created
                    {sortKey === "created" &&
                      (sortDir === "asc" ? (
                        <ChevronUpIcon className="w-4 h-4 inline" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 inline" />
                      ))}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("due")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    Due
                    {sortKey === "due" &&
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
                    No reminders found.
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
                        {i.description}
                      </td>
                      {view === "overdue" && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {userNames[i.userId] || i.userId}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {i.created
                          ? new Date(i.created).toLocaleDateString()
                          : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {i.dueDate
                          ? new Date(i.dueDate).toLocaleDateString()
                          : ""}
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

export default RemindersTable;
