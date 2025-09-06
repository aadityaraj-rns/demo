import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_NQTT_API_PATH,
  headers: {
    "Content-Type": "application/json",
  },
});

export const items = async () => {
  try {
    const response = await api.get("/items/123456AB");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const diesel = async () => {
  try {
    const response = await api.post("/diesel", {
      deviceId: "123456AB",
      start: new Date(new Date().setDate(new Date().getDate() - 7)).getTime(),
      end: new Date().getTime(),
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const water = async () => {
  try {
    const response = await api.post("/water", {
      deviceId: "123456AB",
      start: new Date(new Date().setDate(new Date().getDate() - 7)).getTime(),
      end: new Date().getTime(),
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
