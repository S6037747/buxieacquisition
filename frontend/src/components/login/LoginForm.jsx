import { assets } from "../../assets/assets";

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  passwordState,
  setPasswordState,
  error,
  loginHandler,
  shake,
  setShake,
  navigate,
}) => (
  <form className="space-y-4" onSubmit={loginHandler}>
    {/* E-mail */}
    <div>
      <label className="text-sm text-black">E-mail</label>
      <div className="flex items-center border rounded px-3 py-2">
        <input
          type="text"
          placeholder="example@email.com"
          className="bg-transparent outline-none w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
            setPasswordState(passwordState === "hidden" ? "show" : "hidden")
          }
        />
      </div>
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

    {/* Login Button */}
    <button className="w-full bg-[#150958] text-white py-2 rounded hover:bg-blue-700 transition">
      Login
    </button>

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
  </form>
);

export default LoginForm;
