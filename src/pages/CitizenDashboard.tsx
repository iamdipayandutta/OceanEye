import { useState } from "react";
import CitizenDashboard from "@/components/CitizenDashboard";
import LandingPage from "@/components/LandingPage";
import { ThemeProvider } from "@/components/ThemeProvider";

const CitizenDashboardPage = () => {
  const [showLanding, setShowLanding] = useState(false);

  const navigateToLanding = () => setShowLanding(true);
  const navigateBackToDashboard = () => setShowLanding(false);

  return (
    <ThemeProvider defaultTheme="light" storageKey="oceaneye-ui-theme">
      {showLanding ? (
        <LandingPage onNavigateToDashboard={navigateBackToDashboard} />
      ) : (
        <CitizenDashboard onNavigateToLanding={navigateToLanding} />
      )}
    </ThemeProvider>
  );
};

export default CitizenDashboardPage;