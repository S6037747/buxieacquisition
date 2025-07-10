import { useNavigate } from "react-router-dom";

const TableCompanies = ({
  companies,
  loading,
  error,
  currentPage,
  rowsPerPage,
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Industry
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last update
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
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
                  className="cursor-pointer hover:bg-gray-100"
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
