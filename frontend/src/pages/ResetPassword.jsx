import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const PasswordReset = () => {
  const { backendUrl, isLoggedin } = useContext(AppContext);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  /* -------------------------------------------------------------------------- */
  /* State                                                                      */
  /* -------------------------------------------------------------------------- */
  const urlToken = params.get("token");
  const [email, setEmail] = useState("");
  const [requestDone, setRequestDone] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [checkingToken, setCheckingToken] = useState(!!urlToken);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [passwordResetDone, setPasswordResetDone] = useState(false);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");
  const [passwordState, setPasswordState] = useState("hidden");

  /* -------------------------------------------------------------------------- */
  /* Helpers                                                                    */
  /* -------------------------------------------------------------------------- */
  const triggerError = (msg) => {
    setError(msg);
    setShake(false);
    requestAnimationFrame(() => setShake(true));
  };

  /* -------------------------------------------------------------------------- */
  /* Validate token in URL (if present)                                         */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!urlToken) return;

    (async () => {
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/auth/reset-password`,
          { token: urlToken }
        );
        setTokenValid(Boolean(data.tokenAuth));
        if (!data.tokenAuth) triggerError(data.message || "Invalid token");
      } catch (err) {
        triggerError(err.response?.data?.message || "Error validating token");
      } finally {
        setCheckingToken(false);
      }
    })();
  }, [urlToken, backendUrl]);

  /* -------------------------------------------------------------------------- */
  /* Handlers                                                                   */
  /* -------------------------------------------------------------------------- */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean))
      return triggerError("Please enter a valid email address.");

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/request-reset-token`,
        { email: clean }
      );
      data.success
        ? (setRequestDone(true), setError(""))
        : triggerError(data.message || "Request failed.");
    } catch (err) {
      triggerError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password1 || !password2) {
      return triggerError("Fill in a password.");
    }

    if (password1 !== password2) {
      return triggerError("Passwords do not match.");
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { token: urlToken, newPassword: password1 }
      );
      if (data.success) {
        setPasswordResetDone(true);
        setError("");
      } else {
        triggerError(data.message || "Reset failed.");
      }
    } catch (err) {
      triggerError(err.response?.data?.message || "Something went wrong.");
    }
  };

  /* Redirect after actions --------------------------------------------------- */
  useEffect(() => {
    if (requestDone || passwordResetDone) {
      const t = setTimeout(() => navigate("/"), 5000);
      return () => clearTimeout(t);
    }

    if (isLoggedin && navigate("/dashboard"));
  }, [requestDone, passwordResetDone, isLoggedin]);

  /* -------------------------------------------------------------------------- */
  /* JSX                                                                        */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Panel */}
      <div className="relative w-full md:w-1/2 flex flex-col justify-center items-center px-4 sm:px-10">
        <img
          src={assets.buixie_logo}
          alt="Logo"
          className="absolute top-10 left-10 w-28 cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Card */}
        <div className="w-full max-w-md">
          {/* ======================= NO TOKEN – ask for email ====================== */}
          {!urlToken && (
            <>
              <h1 className="text-3xl font-bold mb-2">Password Reset</h1>

              {!requestDone ? (
                <>
                  <p className="mb-6 text-gray-500">
                    Forgot your password? No worries, it happens to the best of
                    us. Enter your email to receive a reset link.
                  </p>

                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm text-black">E-mail</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    {error && (
                      <p
                        className={`text-sm text-red-600 ${
                          shake ? "animate-shake" : ""
                        }`}
                        onAnimationEnd={() => setShake(false)}
                      >
                        {error}
                      </p>
                    )}

                    <button className="w-full bg-[#150958] text-white py-2 rounded">
                      Send reset link
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <p className="mb-4">
                    A reset link was sent to <strong>{email}</strong>.
                  </p>
                  <p className="text-gray-600">
                    You’ll be redirected automatically.&nbsp;
                    <span
                      className="text-[#150958] underline cursor-pointer"
                      onClick={() => navigate("/")}
                    >
                      Click here
                    </span>{" "}
                    if it doesn’t.
                  </p>
                </>
              )}
            </>
          )}

          {/* ======================= TOKEN PRESENT – set new password ============== */}
          {urlToken && (
            <>
              <h1 className="text-3xl font-bold mb-2">Set New Password</h1>

              {checkingToken && (
                <p className="text-gray-600">Validating token…</p>
              )}

              {!checkingToken && !tokenValid && (
                <>
                  <p className="text-red-600">
                    {error || "Invalid or expired token."}
                  </p>
                  <p className="text-gray-600 mt-4">
                    Something went wrong. Are you trying to hack us?? You should
                    not suppose to see this page. Request a new password reset
                    &nbsp;
                    <span
                      className="text-[#150958] underline cursor-pointer"
                      onClick={() => {
                        setError("");
                        navigate("/reset-password");
                      }}
                    >
                      here
                    </span>
                    .
                  </p>
                </>
              )}

              {!checkingToken && tokenValid && !passwordResetDone && (
                <>
                  <p className="text-gray-600 mb-6">
                    Wow! I'm amazed that you managed to find the correct link to
                    reset your password. For all the hard work done, you can now
                    fill in your new password.
                  </p>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    {/* New password ------------------------------------------------------- */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        New password
                      </label>

                      {/* ⬇︎ flex wrapper = input + icon side-by-side */}
                      <div className="flex items-center border rounded px-3 py-2">
                        <input
                          type={
                            passwordState === "hidden" ? "password" : "text"
                          }
                          placeholder="Password"
                          className="flex-1 bg-transparent outline-none"
                          value={password1}
                          onChange={(e) => setPassword1(e.target.value)}
                        />

                        <img
                          src={
                            passwordState === "hidden"
                              ? assets.password_show
                              : assets.password_hide
                          }
                          className="w-4 cursor-pointer ml-2"
                          alt="toggle password"
                          onClick={() =>
                            setPasswordState(
                              passwordState === "hidden" ? "show" : "hidden"
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Confirm password --------------------------------------------------- */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Confirm password
                      </label>

                      <div className="flex items-center border rounded px-3 py-2">
                        <input
                          type={
                            passwordState === "hidden" ? "password" : "text"
                          }
                          placeholder="Password"
                          className="flex-1 bg-transparent outline-none"
                          value={password2}
                          onChange={(e) => setPassword2(e.target.value)}
                        />

                        <img
                          src={
                            passwordState === "hidden"
                              ? assets.password_show
                              : assets.password_hide
                          }
                          className="w-4 cursor-pointer ml-2"
                          alt="toggle password"
                          onClick={() =>
                            setPasswordState(
                              passwordState === "hidden" ? "show" : "hidden"
                            )
                          }
                        />
                      </div>
                    </div>

                    {error && (
                      <p
                        className={`text-sm text-red-600 ${
                          shake ? "animate-shake" : ""
                        }`}
                        onAnimationEnd={() => setShake(false)}
                      >
                        {error}
                      </p>
                    )}

                    <button className="w-full bg-[#150958] text-white py-2 rounded">
                      Update password
                    </button>
                  </form>
                </>
              )}

              {!checkingToken && tokenValid && passwordResetDone && (
                <>
                  <p className="mb-4 text-black-600 font-medium">
                    Woohoo, your password has been successfully changed! You can
                    finally login again, and hopefully you never have to use
                    this password reset function again.
                  </p>
                  <p className="text-gray-600">
                    You’ll be redirected to the login page automatically.&nbsp;
                    <span
                      className="text-[#150958] underline cursor-pointer"
                      onClick={() => navigate("/")}
                    >
                      Click here
                    </span>{" "}
                    if it doesn’t.
                  </p>
                </>
              )}
            </>
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

export default PasswordReset;
