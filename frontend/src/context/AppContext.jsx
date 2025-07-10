import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [userData, setUserData] = useState(false);
  const [loading, setLoading] = useState(true);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/verify-auth");

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      } else {
        setIsLoggedin(false);
      }
    } catch (error) {
      setIsLoggedin(false);
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      data.success ? setUserData(data.userData) : window.location.reload();
    } catch (error) {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    loading,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
