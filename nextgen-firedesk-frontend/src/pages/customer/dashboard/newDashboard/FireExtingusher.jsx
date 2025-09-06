// import StatusChart from "../../../../components/customer/dashboard/fireExtinguishers/StatusChart";
import { Grid } from "@mui/material";
// import LineChartGraph from "../../../../components/customer/dashboard/fireExtinguishers/LineChartGraph";
// import TickPlacementBar from "../../../../components/customer/dashboard/fireExtinguishers/BasicBars";
// import MultiBars from "../../../../components/customer/dashboard/fireExtinguishers/MultiBars";
// import HpTestDatesChart from "../../../../components/customer/dashboard/fireExtinguishers/HpTestDatesChart";
// import DashboardCard from "../../../../components/customer/dashboard/DashboardCard";
// import RefillDatesChart from "../../../../components/customer/dashboard/fireExtinguishers/RefillDatesChart";
import PropTypes from "prop-types";
import SystemOverview from "../../../../components/customer/dashboard/pumpRoom/SystemOverview";
import HydrostaticTestOverview from "../../../../components/customer/dashboard/fireExtinguishers/HydrostaticTestOverview";
import RefillStatusSummary from "../../../../components/customer/dashboard/fireExtinguishers/RefillStatusSummary";
import AssetDistributionOverview from "../../../../components/customer/dashboard/fireExtinguishers/AssetDistributionOverview";
import MaintenanceDashboard from "../../../../components/customer/dashboard/pumpRoom/MaintenanceDashboard";

const FireExtingusher = ({
  // category,
  // dashboardData,
  // plantId,
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
      <Grid item xs={12} md={6}>
        <HydrostaticTestOverview
          plantId={selectedPlant}
          categoryId={categoryId}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <RefillStatusSummary plantId={selectedPlant} categoryId={categoryId} />
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
      {/* <Grid item xs={12} md={6}>
        <DashboardCard title={`Overall Health Status ${category}`}>
          <StatusChart
            labels={["Not Working", "Attention Required", "Healthy"]}
            colors={["#FF0000", "#FFA500", "#008000"]}
            series={[
              dashboardData?.overalHealthStatus?.totalNotWorkingAssets ?? 0,
              dashboardData?.overalHealthStatus?.totalAttentionRequiredAssets ??
                0,
              dashboardData?.overalHealthStatus?.totalHealthyRequiredAssets ??
                0,
            ]}
          />
        </DashboardCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <DashboardCard title={`Overall Status ${category}`}>
          <StatusChart
            labels={["Warranty", "AMC", "In-House", "Deactive"]}
            colors={["#0c98d9", "#FFA500", "#008000", "#FF0000"]}
            series={[
              dashboardData?.overalStatusCounts?.totalWarrantyAssets ?? 0,
              dashboardData?.overalStatusCounts?.totalAMCAssets ?? 0,
              dashboardData?.overalStatusCounts?.totalInHouseAssets ?? 0,
              dashboardData?.overalStatusCounts?.totalDeactiveAssets ?? 0,
            ]}
          />
        </DashboardCard>
      </Grid>
      <Grid item xs={12}>
        <DashboardCard title={`Inspection Service ${category}`}>
          <Grid container spacing={1} flex="center" alignItems="center">
            <Grid item xs={12} md={8}>
              {dashboardData?.lastSixMonthsServiceCounts && (
                <LineChartGraph
                  lebel={"Service Activity"}
                  lastSixMonthData={dashboardData?.lastSixMonthsServiceCounts}
                />
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              <StatusChart
                labels={["Completed", "Pending"]}
                colors={["#FFA500", "#005380"]}
                series={[
                  100 - (dashboardData?.servicePendingPercentage ?? 100),
                  dashboardData?.servicePendingPercentag ?? 0,
                ]}
              />
            </Grid>
          </Grid>
        </DashboardCard>
      </Grid>
      <Grid item xs={12}>
        <DashboardCard title={`Tickets ${category}`}>
          <Grid container spacing={1} flex="center" alignItems="center">
            <Grid item xs={12} md={8}>
              {dashboardData?.lastSixMonthsTicketCounts && (
                <LineChartGraph
                  lebel={"Ticket Activity"}
                  lastSixMonthData={dashboardData?.lastSixMonthsTicketCounts}
                />
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              <StatusChart
                title={"Ticket Status"}
                labels={["Completed", "Pending"]}
                colors={["#FFA500", "#005380"]}
                series={[
                  dashboardData?.ticketCompletePercentage ?? 0,
                  100 - (dashboardData?.ticketCompletePercentage ?? 100),
                ]}
              />
            </Grid>
          </Grid>
        </DashboardCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <TickPlacementBar title={"Type"} counts={dashboardData?.typeCounts} />
      </Grid>
      <Grid item xs={12} md={6}>
        <TickPlacementBar
          title={"Building"}
          counts={dashboardData?.buildingCounts}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <MultiBars
          title={"Health Status-Type Wise"}
          countsByStatus={dashboardData?.typeCountsByHealthStatus}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <MultiBars
          title={"Health Status-Building Wise"}
          countsByStatus={dashboardData?.buildingCountsByHealthStatus}
        />
      </Grid>
      {category == "Fire Extinguishers" && (
        <>
          <Grid item xs={12} md={6} display="flex" justifyContent="center">
            <HpTestDatesChart plantId={plantId} />
          </Grid>
          <Grid item xs={12} md={6} display="flex" justifyContent="center">
            <RefillDatesChart plantId={plantId} />
          </Grid>
        </>
      )} */}
    </Grid>
  );
};

FireExtingusher.propTypes = {
  // category: PropTypes.any,
  // dashboardData: PropTypes.any,
  // plantId: PropTypes.any,
  categoryId: PropTypes.any,
  selectedPlant: PropTypes.any,
  timestamp: PropTypes.any,
};
export default FireExtingusher;
