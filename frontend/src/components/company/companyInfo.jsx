import {
  EnvelopeIcon,
  BuildingOfficeIcon,
  ChatBubbleOvalLeftIcon,
  PhoneIcon,
  UserIcon,
  MapPinIcon,
  TagIcon,
  PencilSquareIcon,
  TrashIcon,
  LinkIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AppContext } from "../../context/AppContext";
import WarningModel from "../company/warning";
import { useNavigate } from "react-router-dom";

const CompanyInfo = ({ company }) => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [shake, setShake] = useState(false);
  const [formData, setFormData] = useState({
    companyId: company._id || "",
    name: company.name || "",
    industry: company.industry || "",
    description: company.description || "",
    website: company.website || "",
    phone: company.phone || "",
    email: company.email || "",
    updatedAt: new Date().toISOString(),
    address: {
      street: company.address?.street || "",
      zip: company.address?.zip || "",
      city: company.address?.city || "",
    },
    contactPerson: {
      name: company.contactPerson?.name || "",
      phone: company.contactPerson?.phone || "",
      email: company.contactPerson?.email || "",
    },
    tags: company.tags?.join(",") || "",
  });

  const triggerError = (msg) => {
    setError(msg);
    setShake(false);
    requestAnimationFrame(() => setShake(true));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else if (name.startsWith("contactPerson.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contactPerson: { ...prev.contactPerson, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name.trim() === "") {
      return triggerError("Company name is required");
    }

    // Update tags field before sending
    formData.tags = (formData.tags || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/company/data`,
        formData
      );
      if (!data.success) {
        return triggerError(data.message);
      }

      setEdit(false);
      window.location.reload();
    } catch (error) {
      return triggerError(error.message);
    }
  };

  const cancelEdit = () => {
    setError("");
    setFormData({
      companyId: company._id || "",
      name: company.name || "",
      industry: company.industry || "",
      description: company.description || "",
      website: company.website || "",
      phone: company.phone || "",
      email: company.email || "",
      updatedAt: new Date().toISOString(),
      address: {
        street: company.address?.street || "",
        zip: company.address?.zip || "",
        city: company.address?.city || "",
      },
      contactPerson: {
        name: company.contactPerson?.name || "",
        phone: company.contactPerson?.phone || "",
        email: company.contactPerson?.email || "",
      },
      tags: company.tags?.join(",") || "",
    });
  };

  const statusHandler = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const newStatus = company.status === "active" ? "inactive" : "active";

    try {
      const { data } = await axios.patch(`${backendUrl}/api/company/data`, {
        companyId: company._id,
        status: newStatus,
      });

      if (!data.success) {
        return triggerError(data.message);
      }

      window.location.reload();
    } catch (error) {
      return triggerError(error.message);
    }
  };

  const deleteHandler = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    try {
      const { data } = await axios.delete(`${backendUrl}/api/company/data`, {
        data: { companyId: company._id },
      });

      if (!data.success) {
        return triggerError(data.message);
      }

      navigate("/dashboard");
    } catch (error) {
      return triggerError(error.message);
    }
  };

  useEffect(() => {
    if (company) {
      cancelEdit();
    }
  }, [company]);

  return (
    <>
      <section className="bg-white p-6 rounded-lg shadow space-y-4">
        {!edit ? (
          <>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {company.name}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {company.description ? company.description : "unknown"}
                </p>
                <div className="mt-2 flex items-center space-x-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      company.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {company.status ? company.status : "inactive"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {company.industry ? company.industry : "Unknown"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowConfirm(true);
                    setWarningMessage(
                      company.status === "active"
                        ? "This will change the company status to inactive. Companies with an inactive status are not approached as they are not interested in a collaboration."
                        : "This will change the company status to active. Companies with active status can be approached as they are possibly interested in a collaboration."
                    );
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ArrowsUpDownIcon className="h-4 w-4" />
                  Change status
                </button>
                <button
                  onClick={() => {
                    setEdit(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirm(true);
                    setWarningMessage(
                      `This will permanently delete "${company.name}". This action cannot be undone.`
                    );
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 items-start">
              <div>
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />
                  Company Information
                </h2>
                <ul className="text-gray-700 space-y-1">
                  <li className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-blue-600"
                      >
                        {company.website}
                      </a>
                    ) : (
                      "Unknown"
                    )}
                  </li>
                  <li className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4" />{" "}
                    {company.phone ? company.phone : "Unknown"}
                  </li>
                  <li className="flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4" />{" "}
                    {company.email ? company.email : "Unknown"}
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    {company.address?.street &&
                    company.address?.zip &&
                    company.address?.city
                      ? `${company.address.street}, ${company.address.zip} ${company.address.city}`
                      : "Unknown"}
                  </li>
                </ul>
              </div>
              <div className="min-h-[150px]">
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <ChatBubbleOvalLeftIcon className="h-5 w-5 text-gray-500" />
                  Contact Person
                </h2>
                <div className="h-full flex align-left text-left">
                  {!company.contactPerson?.name &&
                  !company.contactPerson?.phone &&
                  !company.contactPerson?.email ? (
                    <div className="flex items-start gap-3">
                      <UserIcon className="h-6 w-6 mt-1 text-gray-300" />
                      <div className="text-sm text-gray-400 space-y-0.5">
                        <p className="font-medium">
                          Contact person information not yet available
                        </p>
                        <p className="text-xs">
                          Click edit to add contact person details
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ul className="text-gray-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        {company.contactPerson?.name
                          ? company.contactPerson.name
                          : "Unknown"}
                      </li>
                      <li className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4" />
                        {company.contactPerson?.phone
                          ? company.contactPerson.phone
                          : "Unknown"}
                      </li>
                      <li className="flex items-center gap-2">
                        <EnvelopeIcon className="h-4 w-4" />
                        {company.contactPerson?.email
                          ? company.contactPerson.email
                          : "Unknown"}
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TagIcon className="h-5 w-5 text-gray-500" />
              Tags
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {(company?.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-sm px-3 py-1 rounded-full flex items-center space-x-1"
                >
                  <span>{tag}</span>
                </span>
              ))}
              {(company?.tags || []).length === 0 && (
                <span className="text-sm text-gray-400 italic">No tags</span>
              )}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Edit Company Info
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <h3 className="text-md font-semibold mt-6">Company</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Street
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address?.street}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Zipcode
                  </label>
                  <input
                    type="text"
                    name="address.zip"
                    value={formData.address?.zip}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address?.city}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <h3 className="text-md font-semibold mt-6">Contact Person</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="contactPerson.name"
                    value={formData.contactPerson?.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="contactPerson.phone"
                    value={formData.contactPerson?.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="contactPerson.email"
                    value={formData.contactPerson?.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <h3 className="text-md font-semibold mt-6">Tags</h3>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {error && (
                <p
                  className={`mt-2 mb-4 text-sm text-red-600 ${
                    shake ? "animate-shake" : ""
                  }`}
                  onAnimationEnd={() => setShake(false)}
                >
                  {error}
                </p>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#150958] text-white rounded-md shadow hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEdit(false);
                    cancelEdit();
                  }}
                  className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </section>
      <WarningModel
        isOpen={showConfirm}
        message={warningMessage}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          if (
            warningMessage ===
              "This will change the company status to inactive. Companies with an inactive status are not approached as they are not interested in a collaboration." ||
            warningMessage ===
              "This will change the company status to active. Companies with active status can be approached as they are possibly interested in a collaboration."
          ) {
            statusHandler();
          } else {
            deleteHandler();
          }
        }}
      />
    </>
  );
};

export default CompanyInfo;
