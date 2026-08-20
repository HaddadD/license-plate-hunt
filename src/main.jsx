import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LicensePlateHunt from "./LicensePlateHunt.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LicensePlateHunt />
  </StrictMode>
);
