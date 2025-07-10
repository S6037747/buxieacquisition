import Header from "../components/dashboard/header";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import AddCompany from "../components/company/addCompany.jsx";

const NewCompany = () => {
  const navigate = useNavigate();
  const {
    backendUrl,
    isLoggedin,
    loading: authLoading,
  } = useContext(AppContext);

  useEffect(() => {
    // Block until auth check is complete
    if (authLoading) return;

    // Redirect if user is not logged in
    if (!isLoggedin) {
      navigate("/", { replace: true });
      return;
    }
  }, [authLoading, isLoggedin, backendUrl]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <AddCompany />
      </main>
      <div className="mb-4 flex justify-center items-center">
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <span>&copy;</span> 2025 Jeremy Zhou. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default NewCompany;
