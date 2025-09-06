import React, { useEffect, useState } from "react";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import * as Yup from "yup";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
  Paper,
  Stack,
  FormLabel,
  Autocomplete,
  Checkbox,
} from "@mui/material";
import Toaster from "../../../components/toaster/Toaster";
import { useFormik } from "formik";
import {
  getMyPlantNames,
  serviceReport,
} from "../../../api/technician/internal";
import { useNavigate } from "react-router-dom";
import Reports from "./Reports";

const BCrumb = [
  {
    to: "/technician",
    title: "Home",
  },
  {
    title: "service-report",
  },
];

const ServiceReport = () => {
  const [error, setError] = useState(false);
  const [plants, setPlants] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMyPlantNames();
      if (response.status === 200) {
        setPlants(response.data);
      }
    };
    fetchData();
  }, []);

  const serviceReportSchema = Yup.object().shape({
    startDate: Yup.string().required("Start Date is required"),
    endDate: Yup.string().required("End Date is required"),
    plantsId: Yup.array()
      .min(1, "At least one plant must be selected")
      .required("Plant Name is required"),
    serviceType: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
      plantsId: [],
      serviceType: "",
    },
    validationSchema: serviceReportSchema,
    onSubmit: async (values, actions) => {
      const data = {
        startDate: values.startDate,
        endDate: values.endDate,
        plantsId: values.plantsId,
        serviceType: values.serviceType,
      };
      const response = await serviceReport(data);
      if (response.status === 200) {
        setReports(response.data);
      } else {
        setError(response.data.message);
        setTimeout(() => setError(false), 6000);
      }
    },
  });

  return (
    <PageContainer
      title="Service report"
      description="this is service report page"
    >
      <Breadcrumb title="Service report" items={BCrumb} />
      <form onSubmit={formik.handleSubmit}>
        <Paper sx={{ my: 1, mx: "auto", p: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl fullWidth margin="normal">
              <FormLabel>
                Start Date <span className="text-danger">*</span>
              </FormLabel>
              <TextField
                type="date"
                InputLabelProps={{ shrink: true }}
                name="startDate"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                error={
                  formik.touched.startDate && Boolean(formik.errors.startDate)
                }
                helperText={formik.touched.startDate && formik.errors.startDate}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>
                End Date <span className="text-danger">*</span>
              </FormLabel>
              <TextField
                type="date"
                InputLabelProps={{ shrink: true }}
                name="endDate"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                helperText={formik.touched.endDate && formik.errors.endDate}
              />
            </FormControl>
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl
              fullWidth
              margin="normal"
              error={
                formik.touched.serviceType && Boolean(formik.errors.serviceType)
              }
            >
              <FormLabel>
                Service Type <span className="text-danger">*</span>
              </FormLabel>
              <Select
                labelId="serviceType-label"
                name="serviceType"
                value={formik.values.serviceType}
                onChange={formik.handleChange}
                label="Service Type"
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select One
                </MenuItem>

                <MenuItem value="inspection">Inspection</MenuItem>
                <MenuItem value="testing">Testing</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
              </Select>
              {formik.touched.serviceType && formik.errors.serviceType && (
                <FormHelperText>{formik.errors.serviceType}</FormHelperText>
              )}
            </FormControl>
            <FormControl
              variant="outlined"
              fullWidth
              error={formik.touched.plantsId && Boolean(formik.errors.plantsId)}
            >
              <FormLabel>
                Plant <span className="text-danger">*</span>
              </FormLabel>
              <Autocomplete
                multiple
                id="plantsId"
                name="plantsId"
                options={plants}
                getOptionLabel={(option) => `${option.plantName}`}
                value={plants.filter((plant) =>
                  formik.values.plantsId?.includes(plant._id)
                )}
                onChange={(event, newValue) => {
                  formik.setFieldValue(
                    "plantsId",
                    newValue.map((option) => option._id)
                  );
                }}
                onBlur={formik.handleBlur}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Select Plants"
                    error={
                      formik.touched.plantsId && Boolean(formik.errors.plantsId)
                    }
                    helperText={
                      formik.touched.plantsId && formik.errors.plantsId
                    }
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <li
                    {...props}
                    key={option._id}
                    style={{ marginBottom: "5px", padding: "4px 0px" }}
                  >
                    <Checkbox checked={selected} />
                    {`${option.plantName}`}
                  </li>
                )}
              />
            </FormControl>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{ marginTop: "20px" }}
              >
                Submit
              </Button>
            </Box>
          </Stack>
        </Paper>
      </form>
      <Reports reports={reports} />
      {error && <Toaster title="Client" message={error} color="error" />}
    </PageContainer>
  );
};

export default ServiceReport;
