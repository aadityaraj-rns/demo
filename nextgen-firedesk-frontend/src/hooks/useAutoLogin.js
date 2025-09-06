import { useState, useEffect } from "react";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

function useAutoLogin() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // IIFE
    (async function autoLoginApiCall() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_INTERNAL_API_PATH}/refresh`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          // Set user data
          const user = {
            _id: response.data.user._id,
            userType: response.data.user.userType,
            name: response.data.user.name,
            phone: response.data.user.phone,
            email: response.data.user.email,
            profile: response.data.user.profile,
            displayName: response.data.user.displayName || "",
            auth: response.data.auth,
          };
          dispatch(setUser(user));
        }
      } catch (error) {
        console.error("Auto-login failed", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  return loading;
}

export default useAutoLogin;
