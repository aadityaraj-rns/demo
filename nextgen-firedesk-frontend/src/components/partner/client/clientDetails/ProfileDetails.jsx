import React, { useEffect, useState } from "react";
import Spinner from "../../../../pages/admin/spinner/Spinner";
import { getCustomerProfile } from "../../../../api/admin/internal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box } from "@mui/system";
import { FormLabel, Grid, Paper, TextField } from "@mui/material";

const customerDetails = ({ orgUserId }) => {
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCustomerProfile(orgUserId);
        if (response.status === 200) {
          setCustomer(response.data.customer);
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orgUserId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Paper variant="outlined">
      <Box mt={3} p={2}>
        <Grid spacing={3} container>
          <Grid item xs={3} className="mb-4 fw-bold">
            Full Name
          </Grid>
          <Grid item xs={1} className="mb-4 fw-bold">
            :
          </Grid>
          <Grid item xs={8} className="mb-4 fw-bold">
            {customer.userId.name}
          </Grid>

          <Grid item xs={3} className="mb-4 fw-bold">
            Email
          </Grid>
          <Grid item xs={1} className="mb-4 fw-bold">
            :
          </Grid>
          <Grid item xs={8} className="mb-4 fw-bold">
            {customer.userId.email}
          </Grid>

          <Grid item xs={3} className="mb-4 fw-bold">
            Phone
          </Grid>
          <Grid item xs={1} className="mb-4 fw-bold">
            :
          </Grid>
          <Grid item xs={8} className="mb-4 fw-bold">
            {customer.userId.phone}
          </Grid>

          <Grid item xs={3} className="mb-4 fw-bold">
            City Name
          </Grid>
          <Grid item xs={1} className="mb-4 fw-bold">
            :
          </Grid>
          <Grid item xs={8} className="mb-4 fw-bold">
            {customer.cityId.cityName}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default customerDetails;
