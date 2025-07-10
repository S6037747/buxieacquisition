import axios from "axios";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AppContext } from "../../context/AppContext";
import WarningModel from "../company/warning";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddCompany = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    description: "",
    website: "",
    phone: "",
    email: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    address: {
      street: "",
      zip: "",
      city: "",
    },
    contactPerson: {
      name: "",
      phone: "",
      email: "",
    },
    tags: "",
  });

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
      return toast.error("Company name is required");
    }

    // Update tags field before sending
    formData.tags = (formData.tags || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      const { data } = await axios.post(`${backendUrl}/api/company/data`, {
        company: formData,
      });
      if (!data.success) {
        return toast.error(data.message);
      }

      navigate("/company/?id=" + data.companyId);
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const cancelEdit = () => {
    setWarningMessage("Are you sure you do not want to save this company?");
    setShowConfirm(true);
  };

  return (
    <>
      <section className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Add a new Company
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
                cancelEdit();
              }}
              className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
      <WarningModel
        isOpen={showConfirm}
        message={warningMessage}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          navigate("/dashboard");
        }}
      />
    </>
  );
};

export default AddCompany;
