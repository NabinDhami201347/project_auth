


```ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";

// Create Axios defaults for both instances
const axiosDefaults = {
  baseURL: "http://192.168.1.75:1337/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
};

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
```

In this code snippet, the goal is to create two Axios instances: `publicInstance` and `protectedInstance`. The `publicInstance` is intended for making requests to public routes, while the `protectedInstance` is for accessing protected routes that require authentication.

Summary of the code:

1. Import libraries: The code imports the necessary modules, including `axios` for making HTTP requests and `SecureStore` from "expo-secure-store" to securely store user access tokens.

2. Set Axios defaults: The `axiosDefaults` object contains the common configuration options for both instances, including the base URL, timeout, and headers.

3. Create Axios instances: Two Axios instances are created using `axios.create()` with the `axiosDefaults`. These instances will be used to make API calls to different endpoints.

4. Implement functions for working with user access tokens: The code defines functions `getUserAccessToken()` and `setUserAccessToken()` for retrieving and storing the user's access token securely in the device.

5. Refresh access token: The `refreshAccessToken()` function is used to refresh the user access token by making a POST request to the `/auth/refresh` endpoint. If the refresh is successful, the new access token is stored securely using `setUserAccessToken()`.

6. Interceptors for protectedInstance: Two interceptors are set for the `protectedInstance`. The first one is a request interceptor that automatically attaches the user's access token to the request's headers if available.

7. Interceptor for token expiration and refresh: The second interceptor is a response interceptor. If the `protectedInstance` receives a 401 (Unauthorized) response, it means the token has expired. The interceptor then tries to refresh the access token using the `refreshAccessToken()` function.

8. Retry original request with the new token: After successfully refreshing the access token, the interceptor updates the `Authorization` header with the new token and retries the original request using the `axios()` function.

9. Error handling: If the token refresh fails or the user is not authenticated, appropriate error messages are thrown. Other errors are also handled and rejected accordingly.

In summary, this code sets up two Axios instances, handles authentication using interceptors, and provides a mechanism to refresh access tokens when they expire, ensuring secure and seamless communication with a backend API for both public and protected routes.