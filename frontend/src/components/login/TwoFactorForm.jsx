const TwoFactorForm = ({
  inputRefs,
  handlePaste,
  handleInput,
  handleKeyDown,
  loginHandler,
  error,
  shake,
  setShake,
  totpActive,
  handleTotpLost,
}) => (
  <form onSubmit={loginHandler}>
    <p className="mb-6 text-black-500">
      Please fill in your two-factor authentication code.
    </p>
    <div className="flex justify-start gap-2 mb-6" onPaste={handlePaste}>
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength="1"
            key={index}
            className="w-10 h-10 bg-[#E0E7FF] text-[#1E1E1E] text-center text-xl rounded-md border border-gray-300"
            ref={(e) => (inputRefs.current[index] = e)}
            onInput={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
    </div>

    {error && (
      <p
        className={`mb-3 text-sm text-red-600 ${shake ? "animate-shake" : ""}`}
        onAnimationEnd={() => setShake(false)}
      >
        {error}
      </p>
    )}

    <button
      className="w-full bg-[#150958] text-white py-2 rounded hover:bg-blue-700 transition"
      type="submit"
    >
      Login
    </button>

    {!totpActive && (
      <p
        className="mt-6 text-sm text-gray-500 cursor-pointer underline"
        onClick={handleTotpLost}
      >
        Did the two-authentication code setup fail? To setup again, click here.
      </p>
    )}
  </form>
);

export default TwoFactorForm;
