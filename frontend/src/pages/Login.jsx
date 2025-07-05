import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [passwordState, setPasswordState] = useState("hidden");

  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Panel */}
      <div className="relative w-full md:w-1/2 flex flex-col justify-center items-center px-4 sm:px-10">
        <img
          src={assets.buixie_logo}
          alt="Logo"
          className="absolute top-10 left-10 w-28"
        />

        {/* Form Container */}
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Login</h1>
          <p className="mb-6 text-gray-500">
            Buixie Business Relationship Management System
          </p>

          <form className="space-y-4">
            {/* E-mail */}
            <div>
              <label className="text-sm text-black">E-mail</label>
              <div className="flex items-center border rounded px-3 py-2">
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="bg-transparent outline-none w-full"
                />
                <img src={assets.mail_icon} className="w-4" alt="mail" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-black">Password</label>
              <div className="flex items-center border rounded px-3 py-2">
                <input
                  type={passwordState === "hidden" ? "password" : "text"}
                  placeholder="Password"
                  className="bg-transparent outline-none w-full"
                />
                <img
                  src={
                    passwordState === "hidden"
                      ? assets.password_show
                      : assets.password_hide
                  }
                  className="w-4 cursor-pointer"
                  alt="toggle password"
                  onClick={() =>
                    setPasswordState(
                      passwordState === "hidden" ? "show" : "hidden"
                    )
                  }
                />
              </div>
            </div>

            {/* Login Button */}
            <button className="w-full bg-[#150958] text-white py-2 rounded hover:bg-blue-700 transition">
              Login
            </button>
          </form>

          <p
            onClick={() => {
              navigate("reset-password");
            }}
            className="mt-4 text-sm text-[#150958] cursor-pointer"
          >
            Forgot password?
          </p>

          <p className="mt-6 text-sm text-gray-500">
            Don’t have an account? Contact the system administrator.
          </p>
        </div>
      </div>

      {/* Right Image */}
      <div className="hidden md:block w-1/2 h-screen">
        <img
          src="/francken.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
