import axios from "axios";

const API_URL = "http://localhost:5000";

export const loginUser = async (employeeID, password) => {
  return axios.post(`${API_URL}/auth/login`, { employeeID, password });
};
