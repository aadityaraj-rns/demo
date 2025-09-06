import { Box, Stack, Typography } from "@mui/material";
import DashboardCard from "../../../../../../components/customer/dashboard/DashboardCard";
import PropTypes from "prop-types";

const PressureCard = ({ goodPressure, currentPressure = 0, pressureUnit }) => {
  let status = "LOW";
  let color = "red";
  let angle = -70;

  if (Number(currentPressure) > Number(goodPressure) + 2) {
    status = "HIGH";
    color = "red";
    angle = 70;
  } else if (
    Number(currentPressure) >= Number(goodPressure) - 2 &&
    Number(currentPressure) <= Number(goodPressure) + 2
  ) {
    status = "MEDIUM";
    color = "yellow";
    angle = 0;
  }

  return (
    <DashboardCard title="Header Pressure">
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
          <svg viewBox="0 0 100 50" width="100%" height="100%">
            <path
              d="M10 50 A40 40 0 0 1 90 58"
              fill="none"
              stroke="#ddd"
              strokeWidth="8"
            />
            <path
              d="M10 50 A40 40 0 0 1 40 15"
              fill="none"
              stroke="green"
              strokeWidth="8"
            />
            <path
              d="M40 15 A40 40 0 0 1 60 15"
              fill="none"
              stroke="yellow"
              strokeWidth="8"
            />
            <path
              d="M60 15 A40 40 0 0 1 90 50"
              fill="none"
              stroke="red"
              strokeWidth="8"
            />
            <line
              x1="50"
              y1="50"
              x2={50 + 40 * Math.cos((angle - 90) * (Math.PI / 180))}
              y2={50 + 40 * Math.sin((angle - 90) * (Math.PI / 180))}
              stroke="black"
              strokeWidth="2"
            />
            <circle cx="50" cy="50" r="3" fill="black" />
          </svg>
        </Box>

        <Stack spacing={0.3}>
          <Typography variant="body2" fontSize={14} className="text-nowrap">
            <strong>Required:</strong>{" "}
            <span style={{ fontWeight: 400 }}>
              {" "}
              {goodPressure} {pressureUnit}
            </span>
          </Typography>
          <Typography variant="body2" fontSize={14} className="text-nowrap">
            <strong>Present:</strong>{" "}
            <span style={{ fontWeight: 400 }}>
              {" "}
              {currentPressure} {pressureUnit}
            </span>
          </Typography>
          <Typography variant="body2" fontSize={14} className="text-nowrap">
            <strong>Status:</strong>
            <span style={{ fontWeight: 400, color }}>
              {" "}
              {status === "HIGH"
                ? "Critical"
                : status === "LOW"
                ? "Need Attention"
                : "Good"}
            </span>
          </Typography>
        </Stack>
      </Stack>
    </DashboardCard>
  );
};

PressureCard.propTypes = {
  pressureUnit: PropTypes.any,
  goodPressure: PropTypes.any,
  currentPressure: PropTypes.any,
};

export default PressureCard;
