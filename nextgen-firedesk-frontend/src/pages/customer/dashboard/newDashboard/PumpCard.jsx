import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  Grid,
  Switch,
} from "@mui/material";
import { formatDate } from "../../../../utils/helpers/formatDate";

const PumpCard = ({ inspectionFrequency, ...data }) => {
  return (
    <Card
      sx={{
        padding: "16px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography fontWeight="bold">
            {data.productId.productName}
          </Typography>
          <Typography fontWeight="bold" color="textSecondary">
            TYPE: {data.productId.type}
          </Typography>
        </Box>

        {/* Pump Image */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <img
              src={data.productId.image1}
              alt={data.productId.productName}
              style={{ maxWidth: "100%" }}
            />
          </Grid>

          {/* Status and Condition Switches */}
          <Grid item xs={8}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="body2" fontWeight="bold" mb={1}>
                CONDITION
              </Typography>
              {/* <Switch
                checked={
                  !(
                    data.pumpStatus === "OFF CONDITION" ||
                    data.pumpStatus === ""
                  )
                }
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "white" },
                  "& .MuiSwitch-thumb": { backgroundColor: "#00C853" },
                  "& .MuiSwitch-track": { backgroundColor: "#00C853" },
                }}
              /> */}
              {/* <input
                style={{
                  height: 0,
                  width: 0,
                  visibility: "hidden",
                }}
                id="react-switch-new"
                type="checkbox"
                checked={
                  !(
                    data.pumpStatus === "OFF CONDITION" ||
                    data.pumpStatus === ""
                  )
                }
              /> */}
              <label
                htmlFor="react-switch-new"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  width: "80px", // Reduced width
                  height: "40px", // Reduced height
                  background: !(
                    data.pumpStatus === "OFF CONDITION" ||
                    data.pumpStatus === ""
                  )
                    ? "#00C853"
                    : "#FF1744", // Green for ON, Red for OFF
                  borderRadius: "80px", // Adjusted for smaller size
                  position: "relative",
                  transition: "background-color 0.2s",
                }}
              >
                <span
                  style={{
                    content: "",
                    position: "absolute",
                    top: "2px",
                    left: !(
                      data.pumpStatus === "OFF CONDITION" ||
                      data.pumpStatus === ""
                    )
                      ? "calc(100% - 2px)"
                      : "2px",
                    transform: !(
                      data.pumpStatus === "OFF CONDITION" ||
                      data.pumpStatus === ""
                    )
                      ? "translateX(-100%)"
                      : "translateX(0)",
                    width: "35px", // Reduced width for the toggle button
                    height: "35px", // Reduced height for the toggle button
                    borderRadius: "50%", // Keep it circular
                    transition: "0.2s",
                    background: "#fff",
                    boxShadow: "0 0 2px 0 rgba(10, 10, 10, 0.29)",
                  }}
                />
              </label>

              <Typography fontWeight="bold" color="#00C853">
                {data.pumpStatus === "OFF CONDITION" || data.pumpStatus === ""
                  ? "OFF"
                  : "ON"}
              </Typography>
            </Box>

            <Box
              mt={2}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Typography variant="body2" fontWeight="bold" mb={1}>
                STATUS
              </Typography>
              <label
                htmlFor="react-switch-new"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  width: "80px",
                  height: "40px",
                  background:
                    data.pumpStatus === "AUTO" ? "#00C853" : "#FF1744",
                  borderRadius: "80px",
                  position: "relative",
                  transition: "background-color 0.2s",
                }}
              >
                <span
                  style={{
                    content: "",
                    position: "absolute",
                    top: "2px",
                    left:
                      data.pumpStatus === "AUTO" ? "calc(100% - 2px)" : "2px",
                    transform:
                      data.pumpStatus === "AUTO"
                        ? "translateX(-100%)"
                        : "translateX(0)",
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    transition: "0.2s",
                    background: "#fff",
                    boxShadow: "0 0 2px 0 rgba(10, 10, 10, 0.29)",
                  }}
                />
              </label>
              <Typography fontWeight="bold" color="#00C853">
                {data.pumpStatus === "AUTO"
                  ? "AUTO"
                  : data.pumpStatus === "AUTO"
                  ? "MANUAL"
                  : "-"}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Details */}
        <Box display="flex" justifyContent={"space-between"}>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              ASSET ID: {data?.assetId}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              LAST SERVICE:{" "}
              {formatDate(data?.serviceDates?.lastServiceDates?.inspection)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              NEXT SERVICE DUE:{" "}
              {formatDate(data?.serviceDates?.nextServiceDates?.inspection)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              FREQUENCY: {inspectionFrequency}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: "12px",
                height: "12px",
                backgroundColor: "#00C853",
                marginRight: "8px",
              }}
            />
            <Typography variant="body2">{data?.healthStatus}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PumpCard;
