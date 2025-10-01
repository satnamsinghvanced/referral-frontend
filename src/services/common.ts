import axios from "./axios";

export const fetchSpecialties = async () => {
  const response = await axios.get("/practice");
  return response.data;
};

// You can add more similar requests here
