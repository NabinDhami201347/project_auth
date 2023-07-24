import React, {
  useEffect,
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { protectedInstance } from "../api";
import { UserData } from "../types";
import LoadingScreen from "../screens/Loading";

type AuthContextValue = {
  user: UserData | null;
  access_token: string | null;
  refresh_token: string | null;
  isLoading: boolean;
  setTokens: (access_token: string, refresh_token: string) => Promise<void>;
  removeTokens: () => Promise<void>;
  updateUser: (userData: UserData) => void;
};

enum ActionTypes {
  SetTokens,
  RemoveTokens,
  SetUser,
  SetLoading,
  UpdateUser,
}

interface Action {
  type: ActionTypes;
  payload?: any;
}

const initialState: AuthContextValue = {
  user: null,
  access_token: null,
  refresh_token: null,
  isLoading: true,
  setTokens: async (_access_token, _refresh_token) => {},
  removeTokens: async () => {},
  updateUser: (userData: UserData) => {},
};

const authReducer = (state: AuthContextValue, action: Action): AuthContextValue => {
  switch (action.type) {
    case ActionTypes.SetTokens:
      return { ...state, access_token: action.payload.access_token, refresh_token: action.payload.refresh_token };

    case ActionTypes.RemoveTokens:
      return { ...state, access_token: null, refresh_token: null };

    case ActionTypes.SetUser:
      return { ...state, user: action.payload };

    case ActionTypes.SetLoading:
      return { ...state, isLoading: action.payload };

    case ActionTypes.UpdateUser: // Step 3
      return { ...state, user: action.payload };

    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextValue | null>(initialState);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Simulate a 4-second delay for token retrieval
        await new Promise((resolve) => setTimeout(resolve, 4000));

        const userAccessToken = await SecureStore.getItemAsync("userAccessToken");
        const userRefreshToken = await SecureStore.getItemAsync("userRefreshToken");

        if (userAccessToken && userRefreshToken) {
          // If access_token exists, make the API request
          const { data } = await protectedInstance.get("auth/profile");
          dispatch({ type: ActionTypes.SetUser, payload: data });
        }

        dispatch({
          type: ActionTypes.SetTokens,
          payload: { access_token: userAccessToken || null, refresh_token: userRefreshToken || null },
        });
      } catch (error) {
        console.error("Error retrieving tokens:", error);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const updateUser = (userData: UserData) => {
    dispatch({ type: ActionTypes.UpdateUser, payload: userData });
  };

  const setStoredTokens = useCallback(async (newAccessToken: string, newRefreshToken: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync("userAccessToken", newAccessToken);
      await SecureStore.setItemAsync("userRefreshToken", newRefreshToken);
      dispatch({
        type: ActionTypes.SetTokens,
        payload: { access_token: newAccessToken, refresh_token: newRefreshToken },
      });
    } catch (error) {
      console.error("Error setting tokens:", error);
    }
  }, []);

  const removeTokens = useCallback(async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync("userAccessToken");
      await SecureStore.deleteItemAsync("userRefreshToken");
      dispatch({ type: ActionTypes.RemoveTokens });
    } catch (error) {
      console.error("Error removing tokens:", error);
    }
  }, []);

  const authContextValue = useMemo(
    () => ({
      ...state,
      setTokens: setStoredTokens,
      removeTokens,
      updateUser,
    }),
    [state, setStoredTokens, removeTokens]
  );

  return <AuthContext.Provider value={authContextValue}>{loading ? <LoadingScreen /> : children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
