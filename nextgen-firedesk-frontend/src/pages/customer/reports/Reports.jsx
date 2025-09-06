import { useEffect, useState } from "react";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  Button,
  Grid,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { getAllPlantNames } from "../../../api/admin/internal";
import {
  customerReports,
  getMyCategorieNames,
} from "../../../api/organization/internal";
import ReportsDetails from "./ReportsDetails";
import { DateRangePicker } from "rsuite";
import subDays from "date-fns/subDays";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addMonths from "date-fns/addMonths";
import { showAlert } from "../../../components/common/showAlert";

const BCrumb = [
  {
    to: "/customer",
    title: "Home",
  },
  {
    title: "Reports",
  },
];

const Reports = () => {
  const [plants, setPlants] = useState([]);
  const [myCategories, setMyCategories] = useState([]);
  const [reports, setReports] = useState([]);
  // const [client, setClient] = useState("");
  // const [reportStartDate, setReportStartDate] = useState("");
  // const [reportEndDate, setReportEndDate] = useState("");
  // const [reportServiceType, setReportServiceType] = useState("");
  // const [reportServiceName, setReportServiceName] = useState("");

  // ✅ Now tracked by Formik instead of useState
  const predefinedRanges = [
    { label: "Today", value: [new Date(), new Date()], placement: "left" },
    {
      label: "Yesterday",
      value: [addDays(new Date(), -1), addDays(new Date(), -1)],
      placement: "left",
    },
    {
      label: "This week",
      value: [startOfWeek(new Date()), endOfWeek(new Date())],
      placement: "left",
    },
    {
      label: "Last 7 days",
      value: [subDays(new Date(), 6), new Date()],
      placement: "left",
    },
    {
      label: "Last 30 days",
      value: [subDays(new Date(), 29), new Date()],
      placement: "left",
    },
    {
      label: "This month",
      value: [startOfMonth(new Date()), new Date()],
      placement: "left",
    },
    {
      label: "Last month",
      value: [
        startOfMonth(addMonths(new Date(), -1)),
        endOfMonth(addMonths(new Date(), -1)),
      ],
      placement: "left",
    },
    {
      label: "This year",
      value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
      placement: "left",
    },
    {
      label: "Last year",
      value: [
        new Date(new Date().getFullYear() - 1, 0, 1),
        new Date(new Date().getFullYear(), 0, 0),
      ],
      placement: "left",
    },
  ];

  const fetchPlants = async () => {
    try {
      const response = await getAllPlantNames();
      if (response.status === 200) {
        setPlants(response.data.allPlants);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyService = async () => {
    try {
      const response = await getMyCategorieNames();
      if (response.status === 200) {
        setMyCategories(response.data?.categories?.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPlants();
    fetchMyService();
  }, []);

  // ✅ Updated Yup Schema to include `dateRange`
  const serviceReportSchema = Yup.object().shape({
    dateRange: Yup.array()
      .of(Yup.date().nullable()) // Ensures both values are valid dates or null
      .min(2, "Both start and end dates are required") // Ensures both dates are selected
      .required("Date range is required"),
    plantId: Yup.string().required("Plant Name is required"),
    serviceType: Yup.string().required("Service Type is required"),
    categoryId: Yup.string().required("Service Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      dateRange: [null, null], // ✅ Tracked inside Formik
      plantId: "",
      serviceType: "",
      categoryId: "",
    },
    validationSchema: serviceReportSchema,
    onSubmit: async (values) => {
      const data = {
        startDate: values.dateRange[0]
          ? values.dateRange[0].toISOString().split("T")[0]
          : "",
        endDate: values.dateRange[1]
          ? values.dateRange[1].toISOString().split("T")[0]
          : "",
        plantId: values.plantId,
        serviceType: values.serviceType,
        categoryId: values.categoryId,
      };

      try {
        const response = await customerReports(data);
        if (response.status == 200) {
          setReports(response.data);
          // setClient(response.data.client);
          // setReportServiceName(values.categoryId);
          // setReportServiceType(values.serviceType);
          // setReportStartDate(data.startDate);
          // setReportEndDate(data.endDate);
          if (!response.data?.length) {
            showAlert({
              text: "No reports found",
              icon: "error",
            });
          }
        } else {
          showAlert({
            text: response?.data?.message,
            icon: "error",
          });
        }
      } catch (error) {
        showAlert({
          text: error.message,
          icon: "error",
        });
      }
    },
  });

  return (
    <PageContainer title="Reports" description="This is the reports page">
      <Breadcrumb title="Reports" items={BCrumb} />
      <form onSubmit={formik.handleSubmit}>
        <Grid container mx={1} spacing={1}>
          <Grid item md={5}>
            <FormControl
              fullWidth
              margin="normal"
              error={
                formik.touched.categoryId && Boolean(formik.errors.categoryId)
              }
            >
              <FormLabel>
                Category <span className="text-danger">*</span>
              </FormLabel>
              <Select
                size="small"
                name="categoryId"
                value={formik.values.categoryId}
                onChange={formik.handleChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select One
                </MenuItem>
                {myCategories.map((category) => (
                  <MenuItem
                    key={category?.categoryId?._id}
                    value={category?.categoryId?._id}
                  >
                    {category?.categoryId?.categoryName}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.categoryId && formik.errors.categoryId && (
                <FormHelperText>{formik.errors.categoryId}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item md={5}>
            <FormControl
              fullWidth
              margin="normal"
              error={
                formik.touched.serviceType && Boolean(formik.errors.serviceType)
              }
            >
              <FormLabel>
                Report <span className="text-danger">*</span>
              </FormLabel>
              <Select
                size="small"
                name="serviceType"
                value={formik.values.serviceType}
                onChange={formik.handleChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select One
                </MenuItem>
                <MenuItem value="Inspection">Inspection</MenuItem>
                <MenuItem value="Testing">Testing</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
              </Select>
              {formik.touched.serviceType && formik.errors.serviceType && (
                <FormHelperText>{formik.errors.serviceType}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item md={5}>
            <FormControl
              fullWidth
              margin="normal"
              error={formik.touched.plantId && Boolean(formik.errors.plantId)}
            >
              <FormLabel>
                Plant <span className="text-danger">*</span>
              </FormLabel>
              <Select
                size="small"
                name="plantId"
                value={formik.values.plantId}
                onChange={formik.handleChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Plant Name
                </MenuItem>
                {plants.map((plant, index) => (
                  <MenuItem key={index} value={plant._id}>
                    {plant.plantName}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.plantId && formik.errors.plantId && (
                <FormHelperText>{formik.errors.plantId}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item md={5}>
            <FormControl fullWidth margin="normal">
              <FormLabel>
                Date Range <span className="text-danger">*</span>
              </FormLabel>
              <DateRangePicker
                size="small"
                ranges={predefinedRanges}
                showOneCalendar
                value={formik.values.dateRange}
                onChange={(range) =>
                  formik.setFieldValue("dateRange", range || [null, null])
                }
                placeholder="Select Date Range"
                style={{ width: 300, marginLeft: 10 }}
                cleanable
              />
              {formik.touched.dateRange && formik.errors.dateRange && (
                <FormHelperText>{formik.errors.dateRange}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              type="submit"
              disabled={formik.isSubmitting}
            >
              Report
            </Button>
          </Grid>
        </Grid>
      </form>
      <ReportsDetails
        reports={reports}
        serviceType={formik.values.serviceType}
        startDate={formik.values.dateRange[0]}
        endDate={formik.values.dateRange[1]}
        // serviceType={reportServiceType}
        // categoryId={reportServiceName}
        // startDate={reportStartDate}
        // endDate={reportEndDate}
        // client={client}
      />
    </PageContainer>
  );
};

export default Reports;
