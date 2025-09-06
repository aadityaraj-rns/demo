import { useEffect, useState } from "react";
import PageContainer from "/src/components/container/PageContainer";
import { Box, CardContent, Grid, Typography } from "@mui/material";
import WelcomeCard from "src/components/dashboard/WelcomeCard";
import { getDashboardData } from "../../api/admin/internal";
import WebAssetOutlinedIcon from "@mui/icons-material/WebAssetOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import WarehouseIcon from "@mui/icons-material/Warehouse";

const Dashboard = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await getDashboardData();
      if (response.status === 200) {
        setData(response.data);
      }
    };
    fetchData();
  }, []);
  return (
    <PageContainer
      title="Firedesk Dashboard"
      description="this is Dashboard page"
    >
      <Box m={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <WelcomeCard />
          </Grid>
          <Grid item xs={12} sm={4} lg={3}>
            <Box bgcolor="#59d739" textAlign="center">
              <CardContent>
                <WebAssetOutlinedIcon />
                <Typography mt={1} variant="subtitle1" fontWeight={600}>
                  Products
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  {data.totalProducts}
                </Typography>
              </CardContent>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} lg={3}>
            <Box bgcolor="#d7d739" textAlign="center">
              <CardContent>
                <PeopleOutlineIcon />
                <Typography mt={1} variant="subtitle1" fontWeight={600}>
                  Clients
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  {data.totalClients}
                </Typography>
              </CardContent>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} lg={3}>
            <Box bgcolor="#39cad7" textAlign="center">
              <CardContent>
                <LocationCityIcon />
                <Typography mt={1} variant="subtitle1" fontWeight={600}>
                  Cites
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  {data.totalCitys}
                </Typography>
              </CardContent>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} lg={3}>
            <Box bgcolor="#a539d7" textAlign="center">
              <CardContent>
                <WarehouseIcon />
                <Typography mt={1} variant="subtitle1" fontWeight={600}>
                  industries
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  {data.totalIndustry}
                </Typography>
              </CardContent>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
