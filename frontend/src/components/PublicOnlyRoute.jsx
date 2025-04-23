import React from "react";
import { Navigate } from "react-router-dom";

const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/home" /> : children;
};

export default PublicOnlyRoute;
