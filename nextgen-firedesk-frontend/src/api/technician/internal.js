import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_INTERNAL_API_PATH,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerCheck = async (data) => {
  // console.log(data);
  try {
    const response = await api.post("/technician/registerCheck", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const technicianLogin = async (data) => {
  try {
    const response = await api.post("/technician/login", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getMyPlants = async (technicianUserId) => {
  try {
    const response = await api.get(`/technician/my-plants/${technicianUserId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getMyPlantNames = async () => {
  try {
    const response = await api.get("/technician/get-my-plant-names");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const serviceReport = async (data) => {
  try {
    const response = await api.post("/technician/service-report", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getMyAssets = async (technicianUserId) => {
  try {
    const response = await api.get(`/technician/my-assets/${technicianUserId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getAssetDetails = async (assetId) => {
  try {
    const response = await api.post(`/technician/asset-detail/${assetId}`);
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

    if (
      (error.response.status === 401 || error.response.status === 500) &&
      !originalReq._isRetry
    ) {
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
