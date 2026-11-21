import type { Metadata } from "next";
import HospitalDashboard from "./HospitalDashboard";
import "./dashboard.css";
import "./console.css";

export const metadata: Metadata = {
  title: "Hospital dashboard",
  description: "Simulated StrideLung fleet, interactive device console, and hospital alert inbox.",
};

export default HospitalDashboard;

