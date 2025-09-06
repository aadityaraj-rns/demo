import { Grid } from "@mui/material";
import PropTypes from "prop-types";
import SystemOverview from "../../../components/customer/dashboard/pumpRoom/SystemOverview";
import AssetDistributionOverview from "../../../components/customer/dashboard/fireExtinguishers/AssetDistributionOverview";
import MaintenanceDashboard from "../../../components/customer/dashboard/pumpRoom/MaintenanceDashboard";

const FireHydrant = ({
  categoryId,
  selectedPlant,
  timestamp,
}) => {
  return (
    <Grid container spacing={3} display="flex" justifyContent="space-around">
      <Grid item xs={12}>
        <SystemOverview
          plantId={selectedPlant}
          categoryId={categoryId}
          timestamp={timestamp}
        />
      </Grid>
      <Grid item xs={12}>
        <AssetDistributionOverview
          plantId={selectedPlant}
          categoryId={categoryId}
        />
      </Grid>
      <Grid item xs={12}>
        <MaintenanceDashboard
          timestamp={timestamp}
          plantId={selectedPlant}
          categoryId={categoryId}
        />
      </Grid>
    </Grid>
  );
};

FireHydrant.propTypes = {
  category: PropTypes.any,
  dashboardData: PropTypes.any,
  plantId: PropTypes.any,
  categoryId: PropTypes.any,
  selectedPlant: PropTypes.any,
  timestamp: PropTypes.any,
};
export default FireHydrant;
