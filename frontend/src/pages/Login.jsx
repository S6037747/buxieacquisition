import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useEffect } from "react";
import LoginForm from "../components/login/LoginForm";
import QrcodeSetup from "../components/login/QrcodeSetup";
import TwoFactorForm from "../components/login/TwoFactorForm";
import { toast } from "react-toastify";

const Login = () => {
  const { backendUrl, isLoggedin } = useContext(AppContext);
  const [passwordState, setPasswordState] = useState("hidden");
  const [qrCode, setQrcode] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [email, setEmail] = useState("");
  const [totp, setTotp] = useState("");
  const [totpReq, setTotpReq] = useState(false);
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");
  const [totpActive, setTotpActive] = useState(false);

  const triggerError = (msg) => {
    setError(msg);
    setShake(false);
    requestAnimationFrame(() => setShake(true));
  };

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // keep only digits
    e.target.value = val;
    if (val && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    paste
      .split("")
      .slice(0, 6)
      .forEach((char, idx) => {
        if (inputRefs.current[idx]) inputRefs.current[idx].value = char;
      });
  };

  const navigate = useNavigate();

  const loginHandler = async (e) => {
    if (e) e.preventDefault();

    const localEnteredCode = inputRefs.current
      .map((ref) => ref?.value)
      .join("");

    if (!password || !email) {
      return triggerError("Fill in login credentials");
    }

    setEmail(email.trim().toLowerCase());

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return triggerError("Please enter a valid email address.");

    if (totpReq && localEnteredCode.length < 6) {
      return triggerError("2FA code must be filled in.");
    }
    setTotp(localEnteredCode);

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
        totp: localEnteredCode,
      });

      if (data.totpReq && !totpReq) {
        setTotpReq(true);
      }

      if (data.totpActive) {
        setTotpActive(true);
      }

      if (!data.success && !data.qrCode && totpReq) {
        return triggerError(data.message);
      }

      if (data.qrCode) {
        setTotpSecret(data.totpSecret);
        setQrcode(data.qrCode);
        return;
      }

      if (!data.success) {
        return triggerError(data.message);
      }

      if (data.success) {
        window.location.reload();
      }
    } catch (error) {
      return triggerError(error.message || "Something went wrong.");
    }
  };

  const handleTotpLost = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
        totp,
        totpLost: true,
      });

      if (data.qrCode) {
        setTotpSecret(data.totpSecret);
        setQrcode(data.qrCode);
        setTotpReq(false);
        setError("");
      } else if (data.totpReq) {
        setTotpReq(true);
      } else if (data.message) {
        triggerError(data.message);
      }
    } catch (error) {
      triggerError(error.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    if (totpReq && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    setError("");
  }, [totpReq, qrCode]);

  useEffect(() => {
    if (isLoggedin) {
      navigate("/dashboard");
    }
  }, [isLoggedin]);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.toast) {
      toast.success(location.state.toast);
    }
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Panel */}
      <div className="relative w-full md:w-1/2 flex flex-col justify-center items-center px-4 sm:px-10 pt-20">
        <img
          src={assets.buixie_logo}
          alt="Logo"
          className="absolute top-10 left-10 w-28"
        />

        {/* Form Container */}
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Login</h1>
          <p className="mb-6 text-black-500">
            Buixie Business Relationship Management System
          </p>
          {!totpReq && qrCode !== "" && (
            <QrcodeSetup
              qrCode={qrCode}
              totpSecret={totpSecret}
              error={error}
              shake={shake}
              setQrcode={setQrcode}
              setTotpReq={setTotpReq}
            />
          )}

          {!totpReq && qrCode === "" && (
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              passwordState={passwordState}
              setPasswordState={setPasswordState}
              error={error}
              shake={shake}
              loginHandler={loginHandler}
              navigate={navigate}
            />
          )}

          {totpReq && (
            <TwoFactorForm
              inputRefs={inputRefs}
              handlePaste={handlePaste}
              handleInput={handleInput}
              handleKeyDown={handleKeyDown}
              loginHandler={loginHandler}
              error={error}
              shake={shake}
              setShake={setShake}
              totpActive={totpActive}
              handleTotpLost={handleTotpLost}
            />
          )}
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
