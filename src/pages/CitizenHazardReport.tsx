import CitizenHazardReport from "@/components/CitizenHazardReport";
import { ThemeProvider } from "@/components/ThemeProvider";

const CitizenHazardReportPage = () => {
  const handleNavigateBack = () => {
    // Navigate back to citizen dashboard or home page
    window.location.href = '/citizendashboard';
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="oceaneye-ui-theme">
      <CitizenHazardReport onNavigateBack={handleNavigateBack} />
    </ThemeProvider>
  );
};

export default CitizenHazardReportPage;