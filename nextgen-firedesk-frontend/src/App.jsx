import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeSettings } from "./theme/Theme";
import RTL from "./layouts/full/shared/customizer/RTL";
import ScrollToTop from "./components/shared/ScrollToTop";
import Router from "./routes/Router";
import CustomerRoutes from "./routes/CustomerRoutes";
import { CssBaseline, ThemeProvider } from "@mui/material";
import TechnicianRoutes from "./routes/TechnicianRoutes";
import PartnerRoutes from "./routes/PartnerRoutes";

function App() {
  const theme = ThemeSettings();
  const customizer = useSelector((state) => state.customizer);
  const location = useLocation();

  const isCustomerPath = location.pathname.startsWith("/customer");
  const isTechnicianPath = location.pathname.startsWith("/technician");
  const isPartnerPath = location.pathname.startsWith("/partner");

  return (
    <ThemeProvider theme={theme}>
      <RTL direction={customizer.activeDir}>
        <CssBaseline />
        <ScrollToTop>
          {isCustomerPath ? (
            <CustomerRoutes />
          ) : isTechnicianPath ? (
            <TechnicianRoutes />
          ) : isPartnerPath ? (
            <PartnerRoutes />
          ) : (
            <Router />
          )}
        </ScrollToTop>
      </RTL>
    </ThemeProvider>
  );
}

export default App;
