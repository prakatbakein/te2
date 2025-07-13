import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

// Apply dark theme immediately
const savedTheme = localStorage.getItem("theme");
if (!savedTheme) {
  localStorage.setItem("theme", "dark");
  document.documentElement.classList.add("dark");
} else if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
