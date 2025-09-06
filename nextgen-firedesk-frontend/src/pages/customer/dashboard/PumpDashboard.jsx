import { Grid } from "@mui/material";

import PropTypes from "prop-types";
import PumpRoomCard from "../../../components/customer/dashboard/pumpRoom/PumpRoomCard";
import {
  MiscellaneousServicesOutlined,
  OilBarrel,
  SettingsInputComponentOutlined,
  WaterDrop,
} from "@mui/icons-material";

const PumpDashboard = ({
  totalPumpAssets,
  totalPumpHealthyAssets,
  totalServiceCount,
  lapsedServiceCount,
  waterAvailable,
  waterTankCapacity,
  dieselAvailable,
  dieselTankCapacity,
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4} lg={3} sx={{ display: "flex", flexGrow: 1 }}>
        <PumpRoomCard
          header={"SYSTEM OVERALL HEALTH"}
          level1={"Total asset"}
          value1={totalPumpAssets}
          level2={"Total healthy asset"}
          value2={totalPumpHealthyAssets}
          percent={
            totalPumpAssets
              ? (totalPumpHealthyAssets / totalPumpAssets) * 100
              : 0
          }
          icon={<SettingsInputComponentOutlined fontSize="small" />}
        />
      </Grid>
      <Grid item xs={12} sm={4} lg={3} sx={{ display: "flex", flexGrow: 1 }}>
        <PumpRoomCard
          header={"Service Summary"}
          level1={"Service Due"}
          value1={totalServiceCount}
          level2={"Completed"}
          value2={totalServiceCount - lapsedServiceCount}
          percent={
            ((totalServiceCount - lapsedServiceCount) / totalServiceCount) *
              100 || 0
          }
          icon={<MiscellaneousServicesOutlined fontSize="small" />}
        />
      </Grid>
      <Grid item xs={12} sm={4} lg={3} sx={{ display: "flex", flexGrow: 1 }}>
        <PumpRoomCard
          header={"Water Management"}
          level1={"Tank capacity"}
          value1={waterTankCapacity}
          level2={"Available"}
          value2={waterAvailable ?? 0}
          percent={(waterAvailable / waterTankCapacity) * 100 || 0}
          icon={<WaterDrop fontSize="small" />}
        />
      </Grid>
      <Grid item xs={12} sm={4} lg={3} sx={{ display: "flex", flexGrow: 1 }}>
        <PumpRoomCard
          header={"Diesel Management"}
          level1={"Tank capacity"}
          value1={dieselTankCapacity}
          level2={"Available"}
          value2={dieselAvailable ?? 0}
          percent={(dieselAvailable / dieselTankCapacity) * 100 || 0}
          icon={<OilBarrel fontSize="small" />}
        />
      </Grid>
    </Grid>
  );
};
PumpDashboard.propTypes = {
  totalPumpAssets: PropTypes.any,
  totalPumpHealthyAssets: PropTypes.any,
  waterAvailable: PropTypes.any,
  waterTankCapacity: PropTypes.any,
  dieselAvailable: PropTypes.any,
  dieselTankCapacity: PropTypes.any,
  lapsedServiceCount: PropTypes.any,
  totalServiceCount: PropTypes.any,
};
export default PumpDashboard;
