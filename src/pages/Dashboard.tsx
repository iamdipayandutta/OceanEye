import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import AdminPanel from "@/components/AdminPanel";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const navigate = useNavigate();

  const navigateToLanding = () => {
    navigate('/');
  };

  const navigateToAdmin = () => {
    setShowAdmin(true);
  };

  const navigateBackFromAdmin = () => {
    setShowAdmin(false);
  };

  const navigateToHazardReport = () => {
    navigate('/citizenhazardreport');
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="oceaneye-ui-theme">
      {showAdmin ? (
        <AdminPanel onBack={navigateBackFromAdmin} />
      ) : (
        <Dashboard 
          onNavigateToLanding={navigateToLanding} 
          onOpenAdmin={navigateToAdmin}
          onNavigateToHazardReport={navigateToHazardReport}
        />
      )}
    </ThemeProvider>
  );
};

export default DashboardPage;