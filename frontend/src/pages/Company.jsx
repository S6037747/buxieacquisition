import Header from "../components/dashboard/header";
import CompanyInfo from "../components/company/companyInfo";
import Interactions from "../components/company/interactions";
import Reminders from "../components/company/reminders";
import Comments from "../components/company/comments";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const Company = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const companyId = params.get("id");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const {
    backendUrl,
    isLoggedin,
    loading: authLoading,
  } = useContext(AppContext);

  const fetchCompany = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/company/data/${companyId}`
      );
      setCompany(data.company || "");
      setError(null);
    } catch (err) {
      setError("Failed to fetch companies. " + err.message);
      console.error(err);
    }
  };

  useEffect(() => {
    // Block until auth check is complete
    if (authLoading) return;

    // Redirect if user is not logged in
    if (!isLoggedin) {
      navigate("/", { replace: true });
      return;
    }

    fetchCompany();
  }, [authLoading, isLoggedin, backendUrl]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <CompanyInfo company={company} fetchCompany={fetchCompany} />

        <Interactions company={company} fetchCompany={fetchCompany} />

        <Reminders company={company} fetchCompany={fetchCompany} />

        <Comments company={company} fetchCompany={fetchCompany} />
      </main>
      <div className="mb-4 flex justify-center items-center">
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <span>&copy;</span> 2025 Jeremy Zhou. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Company;
