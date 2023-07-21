import React, { useEffect, createContext, ReactNode, useContext, useState } from "react";
import * as SecureStore from "expo-secure-store";
import LoadingScreen from "../screens/Loading";

type AuthContextValue = {
  access_token: string | null;
  refresh_token: string | null;
  isLoading: boolean;
  setTokens: (access_token: string, refresh_token: string) => Promise<void>;
  removeTokens: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [access_token, setAccessToken] = useState<string | null>(null);
  const [refresh_token, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Simulate a 4-second delay for token retrieval
        await new Promise((resolve) => setTimeout(resolve, 4000));

        const userAccessToken = await SecureStore.getItemAsync("userAccessToken");
        const userRefreshToken = await SecureStore.getItemAsync("userRefreshToken");

        if (userAccessToken && userRefreshToken) {
          setAccessToken(userAccessToken);
          setRefreshToken(userRefreshToken);
        }
      } catch (error) {
        console.error("Error retrieving tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const setStoredTokens = async (newAccessToken: string, newRefreshToken: string) => {
    try {
      await SecureStore.setItemAsync("userAccessToken", newAccessToken);
      await SecureStore.setItemAsync("userRefreshToken", newRefreshToken);
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
    } catch (error) {
      console.error("Error setting tokens:", error);
    }
  };

  const removeTokens = async () => {
    try {
      await SecureStore.deleteItemAsync("userAccessToken");
      await SecureStore.deleteItemAsync("userRefreshToken");
      setAccessToken(null);
      setRefreshToken(null);
    } catch (error) {
      console.error("Error removing tokens:", error);
    }
  };

  const authContext: AuthContextValue = {
    access_token,
    refresh_token,
    isLoading,
    setTokens: setStoredTokens,
    removeTokens,
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
