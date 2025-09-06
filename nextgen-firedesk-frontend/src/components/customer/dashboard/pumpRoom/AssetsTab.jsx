import {
  Box,
  Card,
  CardHeader,
  Grid,
  Tab,
  Tabs,
  Typography,
  Divider,
  Tooltip,
  Stack,
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { useEffect, useState } from "react";
import { ThemeSettings } from "../../../../theme/Theme";
import PropTypes from "prop-types";
import {
  Autorenew,
  BatteryChargingFull,
  Opacity,
  PowerSettingsNew,
  Thermostat,
  ToggleOff,
  ToggleOn,
  WarningAmber,
} from "@mui/icons-material";

const AssetsTab = ({ assets, pumpIotData, timestamp }) => {
  const theme = ThemeSettings();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (assets?.length > 0) {
      setValue(assets[0]._id);
    }
  }, [assets]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <TabContext value={value}>
        <Card sx={{ padding: "0px", border: "1px solid #e1cfcf" }}>
          <CardHeader
            title={
              <>
                <Tabs
                  variant="scrollable"
                  scrollButtons="auto"
                  value={value}
                  onChange={handleChange}
                  aria-label="icon tabs example"
                  TabIndicatorProps={{ style: { display: "none" } }}
                  sx={{
                    minHeight: 32,
                    "& .MuiTab-root": {
                      minHeight: 32,
                      paddingTop: 0.5,
                      paddingBottom: 0.5,
                    },
                  }}
                >

                  {assets.map((tab, index) => (
                    <Tab
                      key={index}
                      label={
                        <Typography variant="body2">{tab.assetId}</Typography>
                      }
                      value={tab._id}
                      disabled={tab.disabled}
                    />
                  ))}
                </Tabs>
              </>
            }
            sx={{
              backgroundColor:
                theme.palette.mode === "dark" ? "#2a2a2a" : "#f5f5f5",
              color: theme.palette.mode === "dark" ? "#fff" : "#000",
              borderBottom: "1px solid #e1cfcf",
              paddingTop: 1,
              paddingBottom: 1,
              paddingLeft: 2,
              paddingRight: 2,
              "& .MuiCardHeader-content": {
                marginTop: 0,
                marginBottom: 0,
              },
              "& .MuiCardHeader-action": {
                alignSelf: "center",
                marginTop: 0,
                marginBottom: 0,
              },
            }}
          />
          {assets.map((panel, index) => {
            const iotNumber =
              panel.productId.productName.toString().toUpperCase() ==
              "ELECTRICAL DRIVEN PUMP"
                ? 2
                : panel.productId.productName.toString().toUpperCase() ==
                  "JOCKEY PUMP"
                ? 1
                : panel.productId.productName.toString().toUpperCase() ==
                  "DIESEL ENGINE"
                ? 3
                : 1;
            let AS = "AS1";
            let TS = "TS1";
            let PS = "PS1";
            if (iotNumber == 2) {
              AS = "AS2";
              TS = "TS2";
              PS = "PS2";
            } else if (iotNumber == 3) {
              AS = "AS3";
              TS = "TS3";
              PS = "PS3";
            }
            const isDieselEngine =
              panel.productId.productName.toString().toUpperCase() ===
              "DIESEL ENGINE";
            const needAttention =
              pumpIotData[PS] == 1 ||
              pumpIotData[AS] == 0 ||
              pumpIotData[TS] == 0 ||
              (isDieselEngine &&
                (pumpIotData?.WTP == 0 ||
                  pumpIotData?.OPR == 0 ||
                  pumpIotData?.BCH == 0));
            // Build the content of the tooltip
            const tooltipContent = (
              <Stack gap={1}>
                <Typography
                  variant="body2"
                  color={pumpIotData[PS] == 1 ? "error" : "secondary"}
                >
                  Condition :{" "}
                  {pumpIotData[PS] == 1
                    ? "ON"
                    : pumpIotData[PS] == 0
                    ? "OFF"
                    : "-"}
                </Typography>
                <Typography
                  variant="body2"
                  color={pumpIotData[AS] == 1 ? "secondary" : "error"}
                >
                  Status :{" "}
                  {pumpIotData[AS] == 1
                    ? "AUTO"
                    : pumpIotData[AS] == 0
                    ? "MANUAL"
                    : "-"}
                </Typography>
                {!isDieselEngine && (
                  <Typography
                    variant="body2"
                    color={pumpIotData[AS] == 1 ? "secondary" : "error"}
                  >
                    Trip Status :{" "}
                    {pumpIotData[TS] == 1
                      ? "NORMAL"
                      : pumpIotData[TS] == 0
                      ? "TRIPPED"
                      : "-"}
                  </Typography>
                )}
                {isDieselEngine && (
                  <>
                    <Typography
                      variant="body2"
                      color={pumpIotData?.BCH == 1 ? "secondary" : "error"}
                    >
                      Battery Charging :{" "}
                      {pumpIotData?.BCH == 1
                        ? "NORMAL"
                        : pumpIotData?.BCH == 0
                        ? "Fault"
                        : "-"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={pumpIotData?.WTP == 1 ? "secondary" : "error"}
                    >
                      Water Temp :{" "}
                      {pumpIotData?.WTP == 1
                        ? "NORMAL"
                        : pumpIotData?.WTP == 0
                        ? "HIGH"
                        : "-"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={pumpIotData?.OPR == 1 ? "secondary" : "error"}
                    >
                      Eng. Oil Pressure :{" "}
                      {pumpIotData?.OPR == 1
                        ? "NORMAL"
                        : pumpIotData?.OPR == 0
                        ? "LOW"
                        : "-"}
                    </Typography>
                  </>
    

                )}
              </Stack>
            );

            return (
              <TabPanel key={index} value={panel._id}>
                <Box elevation={3} sx={{ maxWidth: 700, margin: "auto" }}>
                  {/* Header */}
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid xs={7} item>
                      <Box display="flex" alignItems="center" gap={1}>
                        <img
                          src={panel?.productId?.image1}
                          alt="product image"
                          width={"40px"}
                        />
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {panel?.productId?.productName
                              ?.toString()
                              ?.toUpperCase()}{" "}
                            {panel?.assetId}
                          </Typography>
                          <Typography variant="body2">
                            {panel?.building?.toString()?.toUpperCase()}-
                            {panel?.location?.toString()?.toUpperCase()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid xs={5} item>
                      <Box textAlign="right">
                        <Typography variant="caption">
                          Last Updated:{" "}
                        </Typography>
                        <Typography variant="caption">
                          {new Date(timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                      {/* Health Status */}
                      <Box display={"flex"} justifyContent={"end"}>
                        <Typography
                          color={needAttention ? "red" : "blue"}
                          variant="caption"
                        >
                          Health Status :{" "}
                          {needAttention ? "Need Attention" : "Healthy"}
                        </Typography>
                        {needAttention && (
                          <Tooltip
                            title={tooltipContent}
                            arrow
                            enterTouchDelay={0}
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: "white",
                                  color: "black",
                                  boxShadow: 2,
                                  fontSize: 13,
                                  borderRadius: 1,
                                  maxWidth: 300, // optional, for better readability
                                },
                                // For the arrow color
                                arrow: {
                                  color: "white",
                                },
                              },
                            }}
                          >
                            <Box mt={0.5} ml={1} sx={{ cursor: "pointer" }}>
                              <WarningAmber color="warning" fontSize="" />
                            </Box>
                          </Tooltip>
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Status / Condition */}
                  <Box
                    mt={2}
                    p={2}
                    border="1px solid #ccc"
                    borderRadius={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {/* Status */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <Autorenew
                        sx={{
                          backgroundColor: "black",
                          color: "white",
                          bgcolor: pumpIotData[AS] == 1 ? "blue" : "red",
                          borderRadius: "50%",
                          p: 0.5,
                        }}
                      />
                      <Box>
                        <Typography variant="body2">STATUS</Typography>
                        <Typography
                          color={pumpIotData[AS] == 1 ? "blue" : "red"}
                          fontWeight="bold"
                        >
                          {pumpIotData[AS] == 1
                            ? "AUTO"
                            : pumpIotData[AS] == 0
                            ? "MANUAL"
                            : "-"}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    {!isDieselEngine && (
                      <>
                        <Box display="flex" alignItems="center" gap={1}>
                          {pumpIotData[TS] == 1 ? (
                            <ToggleOn
                              sx={{
                                color: "white",
                                bgcolor: "blue",
                                borderRadius: "50%",
                                p: 0.5,
                              }}
                            />
                          ) : (
                            <ToggleOff
                              sx={{
                                color: "white",
                                bgcolor: "red",
                                borderRadius: "50%",
                                p: 0.5,
                              }}
                            />
                          )}
                          <Box>
                            <Typography variant="body2">TRIP STATUS</Typography>
                            <Typography
                              color={pumpIotData[TS] == 1 ? "blue" : "red"}
                              fontWeight="bold"
                            >
                              {pumpIotData[TS] == 1
                                ? "NORMAL"
                                : pumpIotData[TS] == 0
                                ? "TRIPPED"
                                : "-"}
                            </Typography>
                          </Box>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                      </>
                    )}
                    {/* Condition */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <PowerSettingsNew
                        sx={{ color: pumpIotData[PS] == 1 ? "red" : "blue" }}
                      />
                      <Box>
                        <Typography variant="body2">CONDITION</Typography>
                        <Typography
                          color={pumpIotData[PS] == 1 ? "red" : "blue"}
                          fontWeight="bold"
                        >
                          {pumpIotData[PS] == 1
                            ? "ON"
                            : pumpIotData[PS] == 0
                            ? "OFF"
                            : "-"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  {/* Parameters */}
                  {isDieselEngine && (
                    <Box mt={3}>
                      {/* 1. Eng. Water Temperature */}
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                          <Thermostat color="error" />
                        </Grid>
                        <Grid item xs>
                          <Typography>Eng. Water Temperature</Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            color={
                              pumpIotData?.WTP == 1 ? "secondary" : "error"
                            }
                            fontWeight="bold"
                          >
                            {pumpIotData?.WTP == 1
                              ? "NORMAL"
                              : pumpIotData?.WTP == 0
                              ? "HIGH"
                              : "-"}
                          </Typography>
                          {/* <WarningAmber fontSize="inherit" color="error" /> */}
                        </Grid>
                      </Grid>
                      <Divider sx={{ my: 1 }} />

                      {/* 2. Engine Oil Pressure */}
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                          <Opacity color="action" />
                        </Grid>
                        <Grid item xs>
                          <Typography>Engine Oil Pressure</Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            color={
                              pumpIotData?.OPR == 1 ? "secondary" : "error"
                            }
                            fontWeight="bold"
                          >
                            {pumpIotData?.OPR == 1
                              ? "NORMAL"
                              : pumpIotData?.OPR == 0
                              ? "LOW"
                              : "-"}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Divider sx={{ my: 1 }} />

                      {/* 3. Battery Charger */}
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                          <BatteryChargingFull color="action" />
                        </Grid>
                        <Grid item xs>
                          <Typography>Battery Charger</Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            color={
                              pumpIotData?.BCH == 1 ? "secondary" : "error"
                            }
                            fontWeight="bold"
                          >
                            {pumpIotData?.BCH == 1
                              ? "NORMAL"
                              : pumpIotData?.BCH == 0
                              ? "Fault"
                              : "-"}

                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              </TabPanel>

            );

          })}
        </Card>
      </TabContext>
    </>
  );
};
AssetsTab.propTypes = {
  // fetchNqttData: PropTypes.func,
  timestamp: PropTypes.any,
  assets: PropTypes.array,
  pumpIotData: PropTypes.object,
  datas: PropTypes.array,
};
export default AssetsTab;
