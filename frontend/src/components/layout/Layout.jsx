import React from "react";
import { motion } from "framer-motion";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { ThemeProvider } from "../ui/ThemeProvider";

const Layout = ({ children }) => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-professional transition-colors duration-300">
        <Navigation />
        <motion.main
          className="pt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export { Layout };
