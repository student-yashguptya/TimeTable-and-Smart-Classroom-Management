// src/components/ui/Spinner.jsx
import React from "react";

const Spinner = ({ size = "32" }) => (
  <div className="flex items-center justify-center">
    <div
      className="animate-spin rounded-full border-2 border-primary border-t-transparent"
      style={{ width: size + "px", height: size + "px" }}
    />
  </div>
);

export default Spinner;
