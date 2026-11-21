import type { Metadata } from "next";
import { TrolleyFigure } from "@/trolley/TrolleyFigure";
import HospitalDashboard from "./HospitalDashboard";
import "./dashboard.css";
import "./console.css";

export const metadata: Metadata = {
  title: "Hospital dashboard",
  description: "Simulated StrideLung fleet, a mirrored trolley command panel, and a hospital alert inbox driven by the trolleys' own alarm checks.",
};

export default function SimulatorPage() {
  // The trolley model is server-rendered markup; the dashboard mounts it in the command panel.
  return <HospitalDashboard model={<TrolleyFigure variant="console" />} />;
}
