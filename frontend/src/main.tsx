import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RoutesAll from "./Routes/RoutesAll.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RoutesAll></RoutesAll>
  </StrictMode>,
);
