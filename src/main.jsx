import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SpeedInsights } from "@vercel/speed-insights/react";
import LicensePlateHunt from "./LicensePlateHunt.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LicensePlateHunt />
    <SpeedInsights />
  </StrictMode>
);
