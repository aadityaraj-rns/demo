import React, { useEffect, useState } from "react";
import PageContainer from "../../components/container/PageContainer";
import { Box, CardContent, Grid, Typography } from "@mui/material";
import WelcomeCard from "../../components/dashboard/WelcomeCard";
import WebAssetOutlinedIcon from "@mui/icons-material/WebAssetOutlined";
import { dashboardData } from "../../api/partner/internal";

const Dashboard = () => {
  const [data, setData] = useState("");
  const fetchData = async () => {
    const response = await dashboardData();
    if (response.status === 200) {
      setData(response.data);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <PageContainer
      title="Firedesk Dashboard"
      description="this is Dashboard page"
    >
      <Grid container spacing={3} display="flex" justifyContent="center">
        <Grid item xs={12}>
          <WelcomeCard />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box bgcolor="#f1f5b5" textAlign="center">
            <CardContent>
              <WebAssetOutlinedIcon />
              <Typography mt={1} variant="subtitle1" fontWeight={600}>
                Customers
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {data.totalCustomer}
              </Typography>
            </CardContent>
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Dashboard;
