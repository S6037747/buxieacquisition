import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import Header from "../components/dashboard/header.jsx";
import { toast } from "react-toastify";

const Export = () => {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();
  const {
    backendUrl,
    isLoggedin,
    loading: authLoading,
  } = useContext(AppContext);

  const [selectedFields, setSelectedFields] = useState([
    "name",
    "description",
    "website",
    "phone",
    "email",
    "industry",
    "status",
    "createdAt",
    "updatedAt",
    "contactPerson.name",
    "contactPerson.phone",
    "contactPerson.email",
    "address",
    "tags",
  ]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTagQuery, setSearchTagQuery] = useState("");

  // =======================================RENDER ON REFRESH============================================== //

  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedin) {
      navigate("/", { replace: true });
      return;
    }

    const fetchCompanies = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/company/data`);
        const comps = data.companies || [];
        setCompanies(comps);
        // derive tag list
        const normalizedTagMap = new Map();
        comps.forEach((c) => {
          (c.tags || []).forEach((tag) => {
            const key = tag.toLowerCase();
            if (!normalizedTagMap.has(key)) {
              normalizedTagMap.set(key, tag);
            }
          });
        });
        setAvailableTags([...normalizedTagMap.values()]);
      } catch (err) {
        toast.error("Failed to fetch companies. " + err.message);
      }
    };

    fetchCompanies();
  }, [authLoading, isLoggedin, backendUrl]);

  const filteredCompanies = companies.filter((c) => {
    const companyTags = (c.tags || []).map((t) => t.toLowerCase());
    return (
      selectedTags.length === 0 ||
      selectedTags.every((tag) => companyTags.includes(tag.toLowerCase()))
    );
  });

  const getValueByPath = (obj, path) =>
    path.split(".").reduce((o, key) => (o ? o[key] : ""), obj) || "";
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    const aVal = getValueByPath(a, sortField).toString().toLowerCase();
    const bVal = getValueByPath(b, sortField).toString().toLowerCase();
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const tagSuggestions = searchTagQuery
    ? availableTags
        .filter(
          (tag) =>
            tag.toLowerCase().includes(searchTagQuery.toLowerCase()) &&
            !selectedTags.some((t) => t.toLowerCase() === tag.toLowerCase())
        )
        .slice(0, 10)
    : [];

  const handleExportCSV = () => {
    if (sortedCompanies.length === 0) return;
    const headers = selectedFields.map((f) => {
      switch (f) {
        case "address":
          return "Address";
        case "tags":
          return "Tags";
        case "email":
          return "Email";
        case "phone":
          return "Phone";
        default:
          return f.charAt(0).toUpperCase() + f.slice(1);
      }
    });
    const rows = sortedCompanies.map((c) =>
      selectedFields
        .map((f) => {
          let val = "";
          if (f === "address") {
            const a = c.address || {};
            val = `${a.street || ""}, ${a.city || ""}, ${a.zip || ""}`
              .trim()
              .replace(/^,|,$/g, "");
          } else if (f === "tags") {
            val = (c.tags || []).join("; ");
          } else {
            // support nested fields
            val = getValueByPath(c, f).toString();
          }
          // if date fields, format
          if (f === "createdAt" || f === "updatedAt") {
            val = val.slice(0, 10);
          }
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "contacts_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =====================================MAIN HTML WEBSITE================================================== //

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Header />

      <div className="px-6 py-6 text-4xl font-semibold text-[#150958]">
        Exporting contacts info
      </div>
      <p className="text-sm text-gray-500 mt-1 px-6">
        You are about to export the current bussiness relation data known in the
        Buixie Dashboard. The exported data will be in the CSV format, which can
        be further manipulated in Google Sheets or excel. This is mainly a
        usefull function to share contacts we have to people who do not have
        access to this application or for example transfers meetings, to show
        which company in what year have been contacted.
      </p>
      <div className="mx-6 my-4 bg-white shadow-md rounded-lg p-6 space-y-6">
        {/* Sort controls */}
        <fieldset className="space-y-2">
          <legend className="font-semibold">Sort options:</legend>
          <div className="flex flex-wrap gap-4 items-center">
            <label className="inline-flex items-center space-x-2">
              <span>Sort by:</span>
              <select
                className="border rounded px-2 py-1"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="description">Description</option>
                <option value="website">Website</option>
                <option value="industry">Industry</option>
                <option value="status">Status</option>
                <option value="createdAt">Created At</option>
                <option value="updatedAt">Updated At</option>
                <option value="address">Address</option>
              </select>
            </label>
            <label className="inline-flex items-center space-x-2">
              <span>Order:</span>
              <select
                className="border rounded px-2 py-1"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </div>
        </fieldset>
        {/* Field selectors */}
        <fieldset className="space-y-2">
          <legend className="font-semibold">Select fields to export:</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Name", value: "name" },
              { label: "Description", value: "description" },
              { label: "Website", value: "website" },
              { label: "Phone", value: "phone" },
              { label: "Email", value: "email" },
              { label: "Industry", value: "industry" },
              { label: "Status", value: "status" },
              { label: "Created At", value: "createdAt" },
              { label: "Updated At", value: "updatedAt" },
              { label: "Contact Name", value: "contactPerson.name" },
              { label: "Contact Phone", value: "contactPerson.phone" },
              { label: "Contact Email", value: "contactPerson.email" },
              { label: "Address", value: "address" },
              { label: "Tags", value: "tags" },
            ].map((field) => (
              <label
                key={field.value}
                className="inline-flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  value={field.value}
                  checked={selectedFields.includes(field.value)}
                  onChange={(e) => {
                    const v = field.value;
                    setSelectedFields((prev) =>
                      e.target.checked
                        ? [...prev, v]
                        : prev.filter((x) => x !== v)
                    );
                  }}
                />
                <span>{field.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Tag filter with autocomplete */}
        <fieldset className="relative">
          <legend className="font-semibold">Filter by tags:</legend>
          <div className="flex flex-wrap flex-col gap-2 mt-2">
            <input
              type="text"
              value={searchTagQuery}
              onChange={(e) => setSearchTagQuery(e.target.value)}
              placeholder="Search tags..."
              className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#150958]"
            />
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center bg-[#150958] text-white px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedTags((prev) => prev.filter((t) => t !== tag))
                    }
                    className="ml-1 focus:outline-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
          {searchTagQuery && tagSuggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg mt-1 max-h-40 overflow-auto z-10">
              {tagSuggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.some(
                        (t) => t.toLowerCase() === suggestion.toLowerCase()
                      )
                        ? prev
                        : [...prev, suggestion]
                    );
                    setSearchTagQuery("");
                  }}
                  className="px-4 py-2 cursor-pointer text-[#150958] hover:bg-[#150958] hover:text-white"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        {/* Export summary and button */}
        <div className="flex items-center justify-between">
          <p>
            {sortedCompanies.length} compan
            {sortedCompanies.length !== 1 ? "ies" : "y"} selected for export
          </p>
          <button
            onClick={handleExportCSV}
            className="bg-[#150958] text-white px-4 py-2 rounded hover:bg-[#4338CA]"
          >
            Export CSV
          </button>
        </div>
      </div>
      {/* ---------- Main ---------- */}
    </div>
  );
};

export default Export;
