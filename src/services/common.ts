import axios from "./axios";

export const fetchSpecialties = async () => {
  const response = await axios.get("/practice");
  return response.data;
};

export const fetchRoles = async () => {
  const response = await axios.get("/role");
  return response.data;
};

export const fetchPermissions = async () => {
  const response = await axios.get("/permission");
  return response.data;
};

export const fetchActivityTypes = async () => {
  const response = await axios.get("/activity-type");
  return response.data;
};



// You can add more similar requests here
