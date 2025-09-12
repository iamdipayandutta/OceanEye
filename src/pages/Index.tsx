import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";
import AdminPanel from "@/components/AdminPanel";
import { ThemeProvider } from "@/components/ThemeProvider";

const Index = () => {
  const [currentView, setCurrentView] = useState<"landing" | "dashboard" | "admin">("landing");
  const navigate = useNavigate();

  const navigateToDashboard = () => {
    setCurrentView("dashboard");
  };
  const navigateToLanding = () => setCurrentView("landing");
  const navigateToAdmin = () => setCurrentView("admin");
  const navigateBackFromAdmin = () => setCurrentView("dashboard");
  const navigateToHazardReport = () => {
    navigate('/citizenhazardreport');
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="oceaneye-ui-theme">
      {currentView === "admin" && (
        <AdminPanel onBack={navigateBackFromAdmin} />
      )}
      {currentView === "dashboard" && (
        <Dashboard 
          onNavigateToLanding={navigateToLanding} 
          onOpenAdmin={navigateToAdmin}
          onNavigateToHazardReport={navigateToHazardReport}
        />
      )}
      {currentView === "landing" && (
        <LandingPage 
          onNavigateToDashboard={navigateToDashboard} 
          onNavigateToHazardReport={navigateToHazardReport}
        />
      )}
    </ThemeProvider>
  );
};

export default Index;
