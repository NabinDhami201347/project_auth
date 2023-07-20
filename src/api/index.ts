import axios, { type AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";

// http://192.168.1.67:1337/api/subjects

// Create a new Axios instance for public routes
const publicInstance: AxiosInstance = axios.create({
  baseURL: "http://192.168.1.67:1337/api",
  timeout: 5000, // Set the request timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a new Axios instance for protected routes
const protectedInstance: AxiosInstance = axios.create({
  baseURL: "http://192.168.1.67:1337/api",
  timeout: 5000, // Set the request timeout in milliseconds
});

// Add an interceptor to the protectedInstance for handling authentication
protectedInstance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("userToken");
    if (token) {
      // @ts-ignore
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export { publicInstance, protectedInstance };
