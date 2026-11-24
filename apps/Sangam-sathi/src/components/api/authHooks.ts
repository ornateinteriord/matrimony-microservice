import axios from "axios";

import TokenService from "../token/tokenService";
 
const api = axios.create({

  baseURL: import.meta.env.VITE_API_URL,

  headers: {
    "Content-Type": "application/json",
    "x-project": "sangamsathi",
    "x-project-name": "Sangam-Sathi",
  },

});
 
// Request interceptor to attach token

api.interceptors.request.use(

  (config) => {

    const token = TokenService.getToken();

    if (token && config.headers) {

      config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || "";
    const isAuthEndpoint =
      url.includes("/api/auth/login") ||
      url.includes("/api/auth/signup") ||
      url.includes("/api/promoter/register");

    // Only redirect and clear token on 401 Unauthorized (unauthenticated/expired session)
    // 403 Forbidden indicates permission/business denial and should NOT log the user out
    if (
      !isAuthEndpoint &&
      error.response?.status === 401 &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true;
      TokenService.removeToken();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
 


export const post = async (path: string, data?: any) => {

  try {

    const response = await api.post(path, data);

    return response.data;

  } catch (error) {

    throw error;

  }

};
 
export const get = async (path: string, params?: any) => {

  try {

    const response = await api.get(path, { params });

    return response.data;

  } catch (error) {

    throw error;

  }

};
 
export const put = async (path: string, data?: any) => {

  try {

    const response = await api.put(path, data);

    return response.data;

  } catch (error) {

    throw error;

  }

};
export const del = async (path: string, data?: any) => {

  try {

    const response = await api.delete(path, data);

    return response.data;

  } catch (error) {

    throw error;

  }

};
 