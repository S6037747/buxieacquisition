import React from "react";

const QrcodeSetup = ({
  qrCode,
  totpSecret,
  error,
  shake,
  setQrcode,
  setTotpReq,
}) => (
  <>
    <p className="mb-6 text-black-500">
      Looks like you haven't set up your two-factor authentication yet. Scan the
      following QR code to set it up:
    </p>
    <img src={qrCode} alt="QR Code" />
    <p className="mb-6 text-gray-500">
      If you are really that incompetent, then try manualy adding two-factor
      authentication through this key: {totpSecret}
    </p>

    {error && (
      <p
        className={`mt-2 text-sm text-red-600 ${shake ? "animate-shake" : ""}`}
        onAnimationEnd={() => setShake(false)}
      >
        {error}
      </p>
    )}

    <button
      onClick={() => {
        setQrcode("");
        setTotpReq(true);
      }}
      className="w-full bg-[#150958] text-white py-2 rounded hover:bg-blue-700 transition"
    >
      Next step
    </button>
  </>
);

export default QrcodeSetup;
