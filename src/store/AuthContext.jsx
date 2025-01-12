import { createContext, useState, useContext } from "react";

// Create the context
const AuthContext = createContext();

// Provide the context to components
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to toggle authentication based on password
  const authenticate = (password) => {
    if (password === 111000) {
      setIsAuthenticated((prev) => !prev);
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
