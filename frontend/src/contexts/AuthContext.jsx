import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { auth, signInWithGoogle, signOutUser } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Configure axios defaults
  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.REACT_APP_BACKEND_URL ||
    "http://localhost:8001";

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error("Auth check failed:", error);
      logout(); // Clear invalid token
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    // Set up axios interceptor for authorization
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Check if user is already logged in
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }

    // Firebase Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && !user) {
        // User signed in with Firebase but not authenticated with our backend
        console.log("Firebase user detected:", firebaseUser);
      }
    });

    // Cleanup interceptor and listener
    return () => {
      axios.interceptors.request.eject(interceptor);
      unsubscribe();
    };
  }, [token, checkAuthStatus, user]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { access_token, ...userData } = response.data;

      if (access_token) {
        localStorage.setItem("token", access_token);
        setToken(access_token);
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Login failed",
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/signup`,
        userData
      );

      const { access_token, ...userInfo } = response.data;

      if (access_token) {
        localStorage.setItem("token", access_token);
        setToken(access_token);
        setUser(userInfo);
        return { success: true, user: userInfo };
      }
    } catch (error) {
      console.error("Signup failed:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Signup failed",
      };
    }
  };

  const signInWithGoogleAuth = async (role = "candidate") => {
    try {
      // Sign in with Google Firebase
      const result = await signInWithGoogle();
      const firebaseUser = result.user;

      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();

      // Send token to backend for authentication
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/firebase-auth`,
        {
          firebase_token: idToken,
          role: role,
        }
      );

      const { access_token, ...userData } = response.data;

      if (access_token) {
        localStorage.setItem("token", access_token);
        setToken(access_token);
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (error) {
      console.error("Google sign in failed:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Google sign in failed",
      };
    }
  };

  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOutUser();
    } catch (error) {
      console.error("Firebase sign out error:", error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    signInWithGoogleAuth,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
