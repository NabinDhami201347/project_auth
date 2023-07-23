import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";

// Create Axios defaults for both instances
const axiosDefaults = {
  baseURL: "http://192.168.1.73:1337/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
};
export const imageuri = "http://192.168.1.73:1337/public/images/";
export const fileuri = "http://192.168.1.73:1337/public/files/";

// Create a new Axios instance for public routes
const publicInstance: AxiosInstance = axios.create(axiosDefaults);

// Create a new Axios instance for protected routes
const protectedInstance: AxiosInstance = axios.create(axiosDefaults);

// Function to get the user access token from secure storage
async function getUserAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync("userAccessToken");
}

// Function to set the user access token in secure storage
async function setUserAccessToken(token: string): Promise<void> {
  return SecureStore.setItemAsync("userAccessToken", token);
}

// Function to refresh the access token
async function refreshAccessToken(userRefreshToken: string): Promise<string> {
  try {
    const response = await publicInstance.post("/auth/refresh", {
      refreshToken: userRefreshToken,
    });
    const accessToken = response.data.access_token;
    await setUserAccessToken(accessToken);
    console.log("Refreshed access token");
    return accessToken;
  } catch (error) {
    throw new Error("Failed to refresh access token.");
  }
}

// Interceptor for protectedInstance to handle authentication
protectedInstance.interceptors.request.use(
  async (config) => {
    console.log("ProtectedInstance request interceptor!!");
    const userAccessToken = await getUserAccessToken();
    if (userAccessToken) {
      config.headers.Authorization = `Bearer ${userAccessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for protectedInstance to handle token expiration and refresh
protectedInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      console.log("ProtectedInstance response interceptor!!");

      const userRefreshToken = await SecureStore.getItemAsync("userRefreshToken");

      if (userRefreshToken) {
        try {
          console.log("ProtectedInstance response interceptor calling refresh token");
          const accessToken = await refreshAccessToken(userRefreshToken);

          if (error.config && error.config.headers) {
            error.config.headers.Authorization = `Bearer ${accessToken}`;
            return axios(error.config); // Retry the original request with the new token
          } else {
            // Handle the case where error.config or error.config.headers is undefined
            throw new Error("Invalid request configuration.");
          }
        } catch (refreshError) {
          // Token refresh failed, handle accordingly (e.g., redirect to login)
          throw new Error("Failed to refresh access token.");
        }
      } else {
        // User is not logged in or has no refresh token, handle accordingly (e.g., redirect to login)
        throw new Error("User is not authenticated.");
      }
    }
    // Handle other errors
    return Promise.reject(error);
  }
);

export { publicInstance, protectedInstance };
