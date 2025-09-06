import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  getPumpDashboardData,
  getPumpIotDeviceIdByPlant,
} from "../../../api/organization/internal";
import { io } from "socket.io-client";
import PumpPerformance from "../../../components/customer/dashboard/pumpRoom/PumpPerformance";
import TrendsPerformance from "../../../components/customer/dashboard/pumpRoom/TrendsPerformance";
import SupportSystemStatus from "../../../components/customer/dashboard/pumpRoom/SupportSystemStatus";
import SystemOverview from "../../../components/customer/dashboard/pumpRoom/SystemOverview";
import MaintenanceDashboard from "../../../components/customer/dashboard/pumpRoom/MaintenanceDashboard";
// import DieselStatusHistory from "../../../components/customer/dashboard/pumpRoom/DieselStatusHistory";

const PumpRoom = ({ selectedPlant, categoryId }) => {
  const [pumpIotData, setPumpIotData] = useState({});
  const [timestamp, setTimestamp] = useState({});
  const [pumpData, setPumpData] = useState({});
  const [assets, setAssets] = useState([]);
  const [pumpIotDeviceId, setPumpIotDeviceId] = useState("");
  useEffect(() => {
    const fetchPumpIotDeviceId = async () => {
      const response = await getPumpIotDeviceIdByPlant(selectedPlant);
      if (response.status == 200) {
        setPumpIotDeviceId(response.data.pumpIotDeviceId);
      }
    };
    fetchPumpIotDeviceId();
  }, [selectedPlant]);
  useEffect(() => {
    const socket = io(import.meta.env.VITE_INTERNAL_API_PATH);

    socket.on("connect", () => {
      socket.emit("subscribe:device", { device_id: pumpIotDeviceId });
    });

    socket.on("live-data", (data) => {
      setPumpIotData(data?.device_data);
      setTimestamp(data?.timestamp);
    });

    return () => socket.disconnect();
  }, [pumpIotDeviceId]);

  useEffect(() => {
    const fetchPumpData = async () => {
      try {
        const response = await getPumpDashboardData({ plantId: selectedPlant });
        if (response.status === 200) {
          setPumpData(response.data?.plantData);
          setAssets(response.data?.assets);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPumpData();
  }, [selectedPlant]);

  return (
    <>
      {/* <Grid container spacing={3} pl={0.5} justifyContent="space-around">
        <Grid item sm={12}>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            justifyContent={"flex-end"}
          >
            <Typography variant="body2">
              {new Date(timestamp).toLocaleString()}
            </Typography>
          </Box>
          <PumpDashboard
            totalPumpAssets={totalPumpAssets}
            totalPumpHealthyAssets={totalPumpHealthyAssets}
            lapsedServiceCount={lapsedServiceCount}
            totalServiceCount={totalServiceCount}
            serviceCompletedPercentage={
              dashboardData?.serviceCompletedPercentage
            }
            waterTankCapacity={pumpData?.mainWaterStorage}
            waterAvailable={pumpIotData?.WLS}
            dieselTankCapacity={pumpData?.dieselStorage}
            dieselAvailable={pumpIotData?.DLS}
          />
        </Grid>
        <Grid item sm={12} md={10}>
          <AssetsTab
            assets={assets}
            pumpIotData={pumpIotData}
            timestamp={timestamp}
          />
        </Grid>
        <Grid item xs={12} md={3} sx={{ display: "flex", flexGrow: 1 }}>
          <DashboardCard title="Water Storage">
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
                <Liquidgauge
                  value={
                    (pumpIotData?.WLS / pumpData?.mainWaterStorage) * 100 || 0
                  }
                  radius={50}
                  liquidcolor="#3b82f6"
                />
              </Box>

              <Stack spacing={0.3}>
                <Typography variant="body2" fontSize={14}>
                  <strong className="text-nowrap">Capacity:</strong>
                  <span style={{ fontWeight: 400 }}>
                    {pumpData?.mainWaterStorage} Ltrs
                  </span>
                </Typography>
                <Typography variant="body2" fontSize={14}>
                  <strong className="text-nowrap">Present:</strong>
                  <span style={{ fontWeight: 400 }}>
                    {pumpIotData?.WLS ?? 0} Ltrs
                  </span>
                </Typography>
                <Typography
                  variant="body2"
                  fontSize={14}
                  className="text-nowrap"
                >
                  <strong>Status: </strong>
                  <span
                    style={{
                      fontWeight: 400,
                      color: pumpIotData?.WLS < "50" ? "red" : "blue",
                    }}
                  >
                    {(pumpIotData?.WLS / pumpData?.mainWaterStorage) * 100 <
                    "50"
                      ? " Need Attention"
                      : "Satisfactory"}
                  </span>
                </Typography>
              </Stack>
            </Stack>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} md={3} sx={{ display: "flex", flexGrow: 1 }}>
          <DashboardCard title={"Diesel Storage"}>
            <Stack
              direction={{ xs: "column" }}
              spacing={2}
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
                <Liquidgauge
                  value={
                    (pumpIotData?.DLS / pumpData?.dieselStorage) * 100 || 0
                  }
                  radius={50}
                  liquidcolor="#ff5733"
                />
              </Box>

              <Stack spacing={0.3}>
                <Typography
                  variant="body2"
                  fontSize={14}
                  className="text-nowrap"
                >
                  <strong>Capacity:</strong>
                  <span style={{ fontWeight: 400 }}>
                    {pumpData?.dieselStorage} Ltrs
                  </span>
                </Typography>
                <Typography
                  variant="body2"
                  fontSize={14}
                  className="text-nowrap"
                >
                  <strong>Present:</strong>
                  <span style={{ fontWeight: 400 }}>
                    {pumpIotData?.DLS ?? 0} Ltrs
                  </span>
                </Typography>
                <Typography
                  variant="body2"
                  fontSize={14}
                  className="text-nowrap"
                >
                  <strong>Status: </strong>
                  <span
                    style={{
                      fontWeight: 400,
                      color: pumpIotData?.DLS < "50" ? "red" : "blue",
                    }}
                  >
                    {(pumpIotData?.DLS / pumpData?.dieselStorage) * 100 < "50"
                      ? " Need Attention"
                      : "Satisfactory"}
                  </span>
                </Typography>
              </Stack>
            </Stack>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} md={3} sx={{ display: "flex", flexGrow: 1 }}>
          <BatteryStatusCard voltage={pumpIotData?.BAT1} />
        </Grid>
        <Grid
          item
          sm={12}
          md={3}
          display="flex"
          sx={{ display: "flex", flexGrow: 1 }}
        >
          <PressureCard
            pressureUnit={pumpData?.pressureUnit}
            goodPressure={pumpData?.headerPressure}
            currentPressure={pumpIotData?.PLS}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: "flex", flexGrow: 1 }}>
          <DieselStatusHistory />
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: "flex", flexGrow: 1 }}>
          <WaterStatusHistory />
        </Grid>
        <Grid item xs={12}>
          <InspectionTrend
            datas={dashboardData?.inspectionCountByMonth}
            inspectionserviceCompletedPercentage={Math.round(
              dashboardData?.inspectionserviceCompletedPercentage
            )}
          />
        </Grid>
      </Grid> */}
      <div className="space-y-4">
        <SystemOverview
          plantId={selectedPlant}
          categoryId={categoryId}
          timestamp={timestamp}
        />
        <PumpPerformance
          timestamp={timestamp}
          assets={assets}
          pumpIotData={pumpIotData}
        />
        <SupportSystemStatus
          timestamp={timestamp}
          pumpIotData={pumpIotData}
          pumpData={pumpData}
        />
        <TrendsPerformance
          lastWaterLevel={pumpIotData?.WLS}
          lastDieselLevel={pumpIotData?.DLS}
          lastHeaderPressureLevel={pumpIotData?.PLS}
          timestamp={timestamp}
          plantId={selectedPlant}
          categoryId={categoryId}
        />
        <MaintenanceDashboard
          timestamp={timestamp}
          plantId={selectedPlant}
          categoryId={categoryId}
        />
      </div>
    </>
  );
};

PumpRoom.propTypes = {
  categoryId: PropTypes.string,
  selectedPlant: PropTypes.string,
  dashboardData: PropTypes.object,
  row2CardData: PropTypes.array,
};

export default PumpRoom;
