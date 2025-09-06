import React from "react";
import { Card, CardContent, Typography, Switch, Box } from "@mui/material";
import { blue, yellow, green, red } from "@mui/material/colors";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import ManualIcon from "@mui/icons-material/Settings";

const PumpStatusCard = ({ name, status }) => {
  const isOff = status === "OFF CONDITION";
  const isOn = status === "MANUAL" || status === "AUTO";

  return (
    <Card
      sx={{
        backgroundColor: isOff ? blue[100] : yellow[100],
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        {name}
      </Typography>

      <Box mt={2} display="flex" alignItems="center">
        {isOff ? (
          <AutoModeIcon color="primary" />
        ) : (
          <ManualIcon color="secondary" />
        )}
        <Typography variant="body1" ml={1}>
          Mode: <span style={{ fontWeight: 600 }}>{status}</span>
        </Typography>
      </Box>

      <Box mt={2} display="flex" alignItems="center">
        <PowerSettingsNewIcon sx={{ color: isOn ? green[500] : red[500] }} />
        <Typography variant="body1" ml={1}>
          Status:{" "}
          <span
            style={{ fontWeight: 600, color: isOn ? green[500] : red[500] }}
          >
            {isOn ? "On" : "Off"}
          </span>
        </Typography>
        <Switch
          checked={isOn}
          color={isOn ? "success" : "error"}
          sx={{ ml: 2 }}
        />
      </Box>
    </Card>
  );
};

const PumpStatus = ({ pumps = [] }) => {
  return (
    <Box
      display="grid"
      width="100%"
      gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
      gap={2}
    >
      {pumps.length > 0 ? (
        pumps.map((pump) => (
          <PumpStatusCard
            key={pump._id}
            name={pump.assetId.assetId}
            status={pump.pumpDetails.pumpStatus}
          />
        ))
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          No pumps data available.
        </Box>
      )}
    </Box>
  );
};

export default PumpStatus;
