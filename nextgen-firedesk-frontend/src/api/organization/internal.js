import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_INTERNAL_API_PATH,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const customerLogin = async (data) => {
  try {
    const response = await api.post("/organization/login", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const forgotPassword = async (loginID) => {
  try {
    const response = await api.get(`/organization/forgot-password/${loginID}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const verifyOtp = async (data) => {
  try {
    const response = await api.post("/organization/verify-otp", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const changePassword = async (data) => {
  try {
    const response = await api.post("/organization/change-password", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getMyNotification = async () => {
  try {
    const response = await api.get("/my-notifications");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const setMarkAsReadAllNotification = async () => {
  try {
    console.log("hi");

    const response = await api.put("/notification-mark-as-read");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getDashboardData = async (data) => {
  try {
    const response = await api.post("/organization/dashboard-data", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getPumpDashboardData = async (data) => {
  try {
    const response = await api.post(
      "/organization/get-pump-dashboard-data",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getBuildingsByPlantAndCategory = async (data) => {
  try {
    const response = await api.post(
      "/organization/get-buildings-by-plant-and-category",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getProductsByPlantAndCategory = async (data) => {
  try {
    const response = await api.post(
      "/organization/get-products-by-plant-and-category",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getTypesByPlantAndCategory = async (data) => {
  try {
    const response = await api.post(
      "/organization/get-types-by-plant-and-category",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getCapacitysByPlantAndCategory = async (data) => {
  try {
    const response = await api.post(
      "/organization/get-capacitys-by-plant-and-category",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getHydrostaticTestOverview = async (data) => {
  try {
    const response = await api.post(
      "/organization/get-hydrostatic-test-overview",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getRefillTestOverview = async (data) => {
  try {
    const response = await api.post(
      "/organization/get-refill-test-overview",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getAssetDistributionOverview = async (data) => {
  try {
    const response = await api.post(
      "/organization/get-asset-distribution-overview",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getPumpMaintenanceOverviewData = async (data) => {
  try {
    const response = await api.post(
      "/organization/get-pump-maintenance-overview-data",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getHpTestDates = async (plantId) => {
  try {
    const response = await api.get(
      `/organization/get-hp-test-dates/${plantId}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getRefillDates = async (plantId) => {
  try {
    const response = await api.get(`/organization/get-refill-dates/${plantId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getOrgProfile = async () => {
  try {
    const response = await api.get("/organization/profile");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const editCustomerProfile = async (formData) => {
  try {
    const response = await api.put("/edit-org-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating admin profile:", error);
  }
};

export const SaveHeaderFooterImage = async (formData) => {
  try {
    const response = await api.post(
      "/organization/save-header-footer-images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating admin profile:", error);
  }
};

export const getAllTechnicians = async () => {
  try {
    const response = await api.get("/organization/technicians");
    return response;
  } catch (error) {
    console.log(error);
    return { error: error };
  }
};
export const getAllTechnicianNames = async () => {
  try {
    const response = await api.get("/organization/technician-names");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const AddTechnician = async (data) => {
  try {
    const response = await api.post("/organization/technician", data);
    return response;
  } catch (error) {
    console.log(error);
    return { error: error };
  }
};

export const editTechnician = async (data) => {
  try {
    const response = await api.put("/organization/technician", data);
    return response;
  } catch (error) {
    console.log(error);
    return { error: error };
  }
};
export const bulkUpload = async (formData) => {
  try {
    const response = await api.post(
      "/organization/assets/bulk-upload",
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
export const updateLayoutMarkers = async (data) => {
  try {
    const response = await api.post("/organization/update-layout-marker", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getFilteredAssetsByMultiCategorySinglePlant = async (data) => {
  const response = await api.post(
    "/organization/get-filtered-assets-by-multi-category-single-plant",
    data
  );
  return response;
};
export const getLayoutMarkers = async (data) => {
  const response = await api.post("/organization/layout-markers", data);
  return response;
};
export const getAllAsset = async () => {
  try {
    const response = await api.get("/organization/assets");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getAssetById = async (assetId) => {
  try {
    const response = await api.get(`/organization/assets/${assetId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getDetailsForAddServices = async (assetId) => {
  try {
    const response = await api.get(
      `/organization/assets/${assetId}/get-details-for-add-services`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getServiceFormByAssetIdServiceTypeServiceFrequency = async ({
  assetId,
  serviceType,
  serviceFrequency,
}) => {
  try {
    const response = await api.get(
      `/organization/assets/get-service-form/${assetId}/${serviceType}/${serviceFrequency}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const createOldService = async (data) => {
  try {
    const response = await api.post(
      "/organization/assets/create-old-service",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getAssetServiceDetails = async (assetId) => {
  try {
    const response = await api.get(
      `/organization/asset/${assetId}/service-details`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const refillAndHpTest = async (data) => {
  try {
    const response = await api.post(
      "/organization/asset/refill-and-hp-test",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getServiceSchedules = async (year, month) => {
  try {
    const response = await api.get(
      `/organization/service-schedules?month=${month + 1}&year=${year}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getAllServiceDue = async () => {
  try {
    const response = await api.get("/organization/get-service-due");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getAllCompletedServices = async () => {
  try {
    const response = await api.get("/organization/get-completed-services");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getLapsedServices = async () => {
  try {
    const response = await api.get("/organization/get-lapsed-services");
    return response;
  } catch (error) {
    console.log(error);
  }
};
// export const getServicesByDate = async (targetDate, assetIds) => {
//   try {
//     const response = await api.post(`/organization/get-services-by-date`, {
//       targetDate,
//       assetIds,
//     });
//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// };
export const getServicesResponseById = async (serviceTicketId) => {
  try {
    const response = await api.get(
      `/organization/get-service-response-by-id/${serviceTicketId}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getRejectedFormById = async (serviceId) => {
  try {
    const response = await api.get(
      `/organization/get-rejected-service-forms/${serviceId}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const updateServicesResponseStatus = async (
  serviceTicketId,
  status,
  remark
) => {
  try {
    const response = await api.patch(
      `/organization/update-service-response-status/${serviceTicketId}`,
      { status, remark }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const updateTicketResponseStatus = async (serviceId, status, remark) => {
  try {
    const response = await api.put(
      `/organization/update-ticket-response-status/${serviceId}`,
      { status, remark }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getMyAllServiceNames = async () => {
  try {
    const response = await api.get("/organization/getMyAllServiceNames");
    return response;
  } catch (error) {
    console.log(error);
  }
};

// audit
export const auditForm = async (data) => {
  try {
    const response = await api.post("/organization/audit", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getAuditForm = async () => {
  try {
    const response = await api.get("/organization/audit");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getAudits = async () => {
  try {
    const response = await api.get("/organization/get-audits");
    return response;
  } catch (error) {
    console.log(error);
  }
};
// tickets
export const getAllTickets = async () => {
  try {
    const response = await api.get("/organization/tickets");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getAllAssetCategories = async () => {
  try {
    const response = await api.get("/organization/get-asset-categories");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const addTicket = async (data) => {
  try {
    const response = await api.post("/organization/ticket", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const editTicket = async (data) => {
  try {
    const response = await api.put("/organization/ticket", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const addSelfAuditForm = async (data) => {
  try {
    const response = await api.post("/organization/add-self-audit-form", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getSelfAudits = async () => {
  try {
    const response = await api.get("/organization/get-self-audits");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getAuditDetailsById = async (auditId) => {
  try {
    const response = await api.get(`/organization/self-audit/${auditId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const createArchive = async (data) => {
  try {
    const response = await api.post("/organization/archive-create", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const editArchive = async (data) => {
  try {
    const response = await api.put("/organization/edit-archive", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const deleteArchive = async (_id) => {
  try {
    const response = await api.delete(`/organization/delete-archive/${_id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const fetchArchives = async () => {
  try {
    const response = await api.get("/organization/archives-fetch");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const ticketDetails = async (ticketid) => {
  try {
    const response = await api.get(`/organization/ticket-details/${ticketid}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const fetchTicketResponse = async (responseId) => {
  try {
    const response = await api.get(
      `/organization/ticket-response/${responseId}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getMyCategories = async () => {
  try {
    const response = await api.get(`/organization/get-categories`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getMyCategorieNames = async () => {
  try {
    const response = await api.get("/organization/get-categorie-names");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const editMyCategory = async (data) => {
  try {
    const response = await api.put(`/organization/update-categories`, data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const assetLatLongRemark = async (data) => {
  try {
    const response = await api.post(
      "/organization/asset/lat-long-remark",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const myCategories = async () => {
  try {
    const response = await api.get("/organization/get-my-categories");
    return response;
  } catch (error) {
    console.log(error);
  }
};

// reports
export const customerReports = async (data) => {
  try {
    const response = await api.post("/organization/reports", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// edit plantImage
export const editPlantImage = async (data) => {
  try {
    const response = await api.put("/organization/edit-plant-image", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

// addLayoutInplant
export const addLayoutInplant = async (data) => {
  try {
    const response = await api.put("/organization/add-plant-layout", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getLayoutsByPlant = async (plantId) => {
  try {
    const response = await api.get(
      `/organization/get-layouts-by-plant/${plantId}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

//group-service
export const createGroupService = async (data) => {
  try {
    const response = await api.post("/organization/group-service/create", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const editGroupService = async (data) => {
  try {
    const response = await api.put("/organization/group-service/edit", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getGroupServices = async () => {
  try {
    const response = await api.get("/organization/group-service/get");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getFormIds = async () => {
  try {
    const response = await api.get("/organization/form/get-form-ids");
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getGroupServiceDetails = async (_id) => {
  try {
    const response = await api.get(
      `/organization/group-service/${_id}/details`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getPumpSystamOverview = async (data) => {
  try {
    const response = await api.post(
      "/organization/get-pump-systam-overview",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getWaterLevelTrend = async (data) => {
  try {
    const response = await api.post(
      "/organization/get-water-level-trend",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getDieselLevelTrend = async (data) => {
  try {
    const response = await api.post(
      "/organization/get-diesel-level-trend",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getHeaderPressureTrend = async (data) => {
  try {
    const response = await api.post(
      "/organization/get-headerpressure-level-trend",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getPumpIotDeviceIdByPlant = async (id) => {
  try {
    const response = await api.get(
      `/organization/get-pump-iot-device-id-by-plant/${id}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getPumpKnowMoreData = async (data) => {
  try {
    const response = await api.post(
      "/organization/dashboard/pump-room/know-more-data",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getPumpModeStatusTrend = async (data) => {
  try {
    const response = await api.post(
      "/organization/dashboard/get-pump-mode-status-trend",
      data
    );
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
        await api.post("/logout");
        return error;
      }
    } else {
      return error.response;
    }
  }
);
