import { assets } from "../../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";
import { useContext, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex flex-wrap items-center justify-between bg-white shadow px-6 py-4">
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

      {/* Hamburger for mobile */}
      <button
        className="sm:hidden text-[#150958] text-2xl"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>

      {/* Navigation */}
      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        } w-full mt-4 sm:mt-0 sm:flex sm:w-auto items-center gap-6 text-[#150958] font-medium`}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="hover:text-[#4338CA] transition block"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate("/reminders")}
          className="hover:text-[#4338CA] transition block"
        >
          Reminders
        </button>
        <button
          onClick={() => navigate("/interactions")}
          className="hover:text-[#4338CA] transition block"
        >
          Interactions
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="hover:text-[#4338CA] transition block"
        >
          Profile
        </button>
        {userData.role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="hover:text-[#4338CA] transition block"
          >
            Admin
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
