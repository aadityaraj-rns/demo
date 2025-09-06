import DashboardCard from "../../../../../components/customer/dashboard/DashboardCard";
import PropTypes from "prop-types";
import { Box, Stack, Typography } from "@mui/material";
import {
  BatteryChargingFullOutlined,
  BatteryAlertOutlined,
} from "@mui/icons-material";

const BatteryStatusCard = ({ voltage = 0 }) => {
  const health = voltage < 12 ? "Need Attention" : "Satisfactory";
  const isLowBattery = voltage < 12;

  return (
    <DashboardCard title={"Battery Status"}>
      <Stack
        direction={{ xs: "column" }}
        spacing={1}
        alignItems="center"
        justifyContent="center"
        sx={{ width: "100%", px: 2, py: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isLowBattery ? (
            <BatteryAlertOutlined sx={{ color: "#ea5312aa", fontSize: 80 }} />
          ) : (
            <BatteryChargingFullOutlined
              sx={{ color: "#2bd319aa", fontSize: 80 }}
            />
          )}
        </Box>

        <Stack spacing={0.3}>
          <Typography variant="body2" fontSize={14} className="text-nowrap">
            <strong>Required: </strong>{" "}
            <span style={{ fontWeight: 400 }}>12 Volts</span>
          </Typography>
          <Typography variant="body2" fontSize={14} className="text-nowrap">
            <strong>Present:</strong>{" "}
            <span style={{ fontWeight: 400 }}>{voltage} Volts</span>
          </Typography>
          <Typography variant="body2" fontSize={14} className="text-nowrap">
            <strong>Status: </strong>
            <span
              style={{
                fontWeight: 400,
                color: health == "Need Attention" ? "red" : "blue",
              }}
            >
              {health}
            </span>
          </Typography>
        </Stack>
      </Stack>
    </DashboardCard>
  );
};

BatteryStatusCard.propTypes = {
  voltage: PropTypes.number,
};
export default BatteryStatusCard;
