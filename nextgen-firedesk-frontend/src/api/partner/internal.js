import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_INTERNAL_API_PATH,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const partnerLogin = async (data) => {
  try {
    const response = await api.post("/partner-login", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const addClientByPartner = async (data) => {
  try {
    const response = await api.post("/partner/client", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const editClient = async (data) => {
  try {
    const response = await api.put("/partner/client", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getAllClients = async () => {
  try {
    const response = await api.get("/partner/clients");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getActiveCategoriesForPartner = async () => {
  try {
    const response = await api.get("/partner/getActiveCategoriesForPartner");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getPartnerProfile = async () => {
  try {
    const response = await api.get("/partner/profile");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const editPartnerProfile = async (formData) => {
  try {
    const response = await api.put("/partner/edit-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure correct content type for file upload
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating admin profile:", error);
  }
};

export const dashboardData = async () => {
  try {
    const response = await api.get("/partner/dashboard-data");
    return response;
  } catch (error) {
    console.log(error);
  }
};

// auto token refresh
api.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalReq = error.config;

    if (error.response.status === 401 && !originalReq._isRetry) {
      originalReq._isRetry = true;
      try {
        await api.get("/refresh");

        return api.request(originalReq);
      } catch (error) {
        return error;
      }
    } else {
      return error.response;
    }
  }
);
