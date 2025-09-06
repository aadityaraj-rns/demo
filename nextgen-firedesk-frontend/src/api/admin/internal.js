import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_INTERNAL_API_PATH,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (data) => {
  try {
    const response = await api.post("/login", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (data) => {
  try {
    const response = await api.post("/logout", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getDashboardData = async () => {
  try {
    const response = await api.get("/dashboard");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getAdminProfile = async () => {
  try {
    const response = await api.get("/get-admin-profile");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const editAdmin = async (formData) => {
  try {
    const response = await api.put("/editAdmin", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating admin profile:", error);
  }
};

export const getAllState = async () => {
  try {
    const response = await api.get("/masterData/state/all");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getAllActiveState = async () => {
  try {
    const response = await api.get("/masterData/state/allActives");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const addStateName = async (data) => {
  try {
    const response = await api.post("/masterData/state", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const editStateName = async (data) => {
  try {
    const response = await api.put("/masterData/state", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getAllCity = async () => {
  try {
    const response = await api.get("/masterData/city/all");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const addCity = async (data) => {
  try {
    const response = await api.post("/masterData/city", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const editCity = async (data) => {
  try {
    const response = await api.put("/masterData/city", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const createIndustry = async (data) => {
  try {
    const response = await api.post("/masterData/industry", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getAllIndustries = async () => {
  try {
    const response = await api.get("/masterData/industry/all");
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getAllActiveIndustries = async () => {
  try {
    const response = await api.get("/masterData/industry/allActives");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const editIndustry = async (data) => {
  try {
    const response = await api.put("/masterData/industry", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getAllCategories = async () => {
  try {
    const response = await api.get("/masterData/category/all");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getAllActiveCategories = async () => {
  try {
    const response = await api.get("/masterData/category/allActives");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const addCategory = async (data) => {
  try {
    const response = await api.post("/masterData/category", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const editCategory = async (data) => {
  try {
    const response = await api.put("/masterData/category", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getAllSelfAudits = async () => {
  try {
    const response = await api.get("/masterData/selfAudit/all");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const addSelfAudit = async (data) => {
  try {
    const response = await api.post("/masterData/selfAudit", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const editSelfAudit = async (_id, data) => {
  try {
    const response = await api.put(`/masterData/selfAudit/${_id}`, data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getCitiesByStateName = async (stateName) => {
  try {
    const response = await api.get(`/masterData/citys/${stateName}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getActiveCitiesByStateName = async (stateName) => {
  try {
    const response = await api.get(`/masterData/activeCitys/${stateName}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getCitiesByStateId = async (stateId) => {
  try {
    const response = await api.get(`/masterData/city/${stateId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getActiveCitiesByStateId = async (stateId) => {
  try {
    const response = await api.get(`/masterData/city/${stateId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getActiveCities = async () => {
  try {
    const response = await api.get("masterData/activeCities");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const addClient = async (data) => {
  try {
    const response = await api.post("/client", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const editClient = async (data) => {
  try {
    const response = await api.put("/client", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getAllClients = async () => {
  try {
    const response = await api.get("/client/getAll");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getTechnicianByOrgUserId = async (orgUserId) => {
  try {
    const response = await api.get(`/client/technician/${orgUserId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getAssetsByOrgUserId = async (orgUserId) => {
  try {
    const response = await api.get(`/client/assets/${orgUserId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getTicketsByOrgUserId = async (orgUserId) => {
  try {
    const response = await api.get(`/client/tickets/${orgUserId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getPlantsByOrgUserId = async (orgUserId) => {
  try {
    const response = await api.get(`client/plants/${orgUserId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getCustomerProfile = async (orgUserId) => {
  try {
    const response = await api.get(`client/org/profile/${orgUserId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getAllProducts = async () => {
  try {
    const response = await api.get("/products");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const addProduct = async (data) => {
  try {
    console.log(data);

    const response = await api.post("/product", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const editProduct = async (data) => {
  try {
    const response = await api.put("/product", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getProductsByCategory = async (productCategoryId) => {
  try {
    const response = await api.get(`/products/${productCategoryId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// from here organization api start

// technician
export const addTechnician = async (data) => {
  try {
    const response = await api.post("organization/technician", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// plant
export const getAllPlant = async () => {
  try {
    const response = await api.get("/organization/plant");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getAllPlantNames = async () => {
  try {
    const response = await api.get("/organization/plant-names");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getUniqueTagName = async () => {
  try {
    const response = await api.get("/organization/asset/unique-tag-names");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const addPlant = async (formData) => {
  try {
    const response = await api.post("/organization/plant", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const editPlant = async (formData) => {
  try {
    const response = await api.put(
      `/organization/plant/${formData.get("_id")}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
// manager
export const getAllManager = async () => {
  try {
    const response = await api.get("organization/manager");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getAllManagerName = async () => {
  try {
    const response = await api.get("organization/manager-name");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const addManager = async (data) => {
  try {
    const response = await api.post("organization/manager", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const editManager = async (data) => {
  try {
    const response = await api.put("organization/manager", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

//assets
export const getAllAssets = async () => {
  try {
    const response = await api.get("/organization/assets");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getAllAssetNamesByCategoryPlantId = async (
  categoryId,
  plantId
) => {
  try {
    const response = await api.get(
      `/organization/get-assets-by-category-id/${categoryId}/${plantId}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const addAsset = async (formData) => {
  try {
    const response = await api.post("/organization/assets", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const editAsset = async (formData) => {
  try {
    const response = await api.put("/organization/assets", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

// service
export const getAllServiceNames = async () => {
  try {
    const response = await api.get("/getAllServiceNames");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getServiceById = async (id) => {
  try {
    const response = await api.get(`/form/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const addQuestionsToSection = async (payload) => {
  try {
    const response = await api.post("/form/add-questions-to-section", payload);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const removeQuestionsFromSection = async (payload) => {
  try {
    const response = await api.delete("/form/remove-questions", {
      data: payload,
    });
    return response;
  } catch (error) {
    console.error("Error removing questions from section:", error);
    throw error;
  }
};
export const getAllServiceForm = async () => {
  try {
    const response = await api.get("/forms");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const uploadFileInCloudinary = async (data) => {
  try {
    const response = await api.post("/upload-file", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
