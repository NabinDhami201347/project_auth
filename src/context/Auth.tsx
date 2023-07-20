import React, { useEffect, createContext, ReactNode, useContext, useState } from "react";
import * as SecureStore from "expo-secure-store";
import LoadingScreen from "../screens/Loading";

type AuthContextValue = {
  token: string | null;
  isLoading: boolean;
  setToken: (token: string) => Promise<void>;
  removeToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  //   useEffect(() => {
  //     const bootstrapAsync = async () => {
  //       try {
  //         const userToken = await SecureStore.getItemAsync("userToken");
  //         if (userToken) {
  //           setToken(userToken);
  //         }
  //       } catch (error) {
  //         console.error("Error retrieving token:", error);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     };

  //     bootstrapAsync();
  //   }, []);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Simulate a 4-second delay for token retrieval
        await new Promise((resolve) => setTimeout(resolve, 4000));

        const userToken = await SecureStore.getItemAsync("userToken");
        if (userToken) {
          setToken(userToken);
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const setStoredToken = async (newToken: string) => {
    try {
      await SecureStore.setItemAsync("userToken", newToken);
      setToken(newToken);
      scheduleTokenExpiration(); // Schedule token expiration after 1 hour
    } catch (error) {
      console.error("Error setting token:", error);
    }
  };

  const removeToken = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");
      setToken(null);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  };

  const scheduleTokenExpiration = () => {
    // Set the token expiration timer for 1 hour (3600 seconds)
    setTimeout(() => {
      console.log("Time is up");
      removeToken(); // Remove the token after 1 hour
    }, 3600000); // 1 hour = 3600 seconds * 1000 milliseconds
  };

  const authContext: AuthContextValue = {
    token,
    isLoading,
    setToken: setStoredToken,
    removeToken,
  };

  return (
    <AuthContext.Provider value={isLoading ? null : authContext}>
      {isLoading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
