import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Invite = () => {
  const { backendUrl, isLoggedin } = useContext(AppContext);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  /* -------------------------------------------------------------------------- */
  /* State                                                                      */
  /* -------------------------------------------------------------------------- */
  const urlToken = params.get("token");
  const [name, setName] = useState("");
  const [tokenValid, setTokenValid] = useState(false);
  const [checkingToken, setCheckingToken] = useState(!!urlToken);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
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

  /* Redirect after actions --------------------------------------------------- */
  useEffect(() => {
    if (accountCreated) {
      const t = setTimeout(() => navigate("/"), 5000);
      return () => clearTimeout(t);
    }
    if (isLoggedin && navigate("/dashboard"));
  }, [accountCreated, isLoggedin]);

  /* -------------------------------------------------------------------------- */
  /* Validate token in URL (if present)                                         */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!urlToken) return;

    (async () => {
      try {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          token: urlToken,
        });
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

  const createAccountHandler = async () => {
    if (!name) {
      return triggerError("Fill in a name.");
    }

    if (!password1 || !password2) {
      return triggerError("Fill in a password.");
    }

    if (password1 !== password2) {
      return triggerError("Passwords do not match.");
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
        token: urlToken,
        name: name,
        password: password1,
      });

      if (data.success) {
        setAccountCreated(true);
        setError("");
      } else {
        return triggerError(data.message || "Account creation failed.");
      }
    } catch (err) {
      triggerError(err.response?.data?.message || "Something went wrong.");
    }
  };

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
          {/* ======================= TOKEN PRESENT – register ============== */}
          {urlToken && (
            <>
              <h1 className="text-3xl font-bold mb-2">Create your account</h1>

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
                    not suppose to see this page. Request a new invite from a
                    admin.
                  </p>
                </>
              )}

              {!checkingToken && tokenValid && !accountCreated && (
                <>
                  <p className="text-gray-600 mb-6">
                    You are one step closer to getting a account! Are you
                    getting nervous yet? Please fill in your details to create
                    your account.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      createAccountHandler();
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Name
                      </label>

                      {/* flex wrapper = input + icon side-by-side */}
                      <div className="flex items-center border rounded px-3 py-2">
                        <input
                          placeholder="Name"
                          className="flex-1 bg-transparent outline-none"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* New password ------------------------------------------------------- */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        password
                      </label>

                      {/* flex wrapper = input + icon side-by-side */}
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
                      Create account
                    </button>
                  </form>
                </>
              )}

              {!checkingToken && tokenValid && accountCreated && (
                <>
                  <p className="mb-4 text-black-600 font-medium">
                    Woohoo, your account has been created! You can finally
                    login.
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

export default Invite;
