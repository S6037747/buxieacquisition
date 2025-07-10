import { assets } from "../../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";
import { useContext } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4">
      {/* Logo + Title */}
      <div className="flex items-center gap-3">
        <img
          src={assets.buixie_logo}
          onClick={() => navigate("/dashboard")}
          alt="Buixie logo"
          className="w-12 h-12 object-contain cursor-pointer"
        />
        <span className="text-2xl font-semibold text-[#150958]">
          Buixie Dashboard
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-8 text-[#150958] font-medium">
        <button
          onClick={() => navigate("/dashboard")}
          className="hover:text-[#4338CA] transition"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate("/reminders")}
          className="hover:text-[#4338CA] transition"
        >
          Reminders
        </button>
        <button
          onClick={() => navigate("/interactions")}
          className="hover:text-[#4338CA] transition"
        >
          Interactions
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="hover:text-[#4338CA] transition"
        >
          Profile
        </button>
        {userData.role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="hover:text-[#4338CA] transition"
          >
            Admin
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
