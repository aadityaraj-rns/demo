// import {
//   Box,
//   Button,
//   CardMedia,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   FormLabel,
//   Grid,
//   IconButton,
//   Tab,
//   TextField,
//   Typography,
// } from "@mui/material";
// import * as Yup from "yup";
// import CloseIcon from "@mui/icons-material/Close";
// import { useEffect, useState } from "react";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import LineChart from "../../../components/customer/assets/LineChart";
// import ServiceRecord from "../../../components/customer/assets/ServiceRecord";
// import EditIcon from "@mui/icons-material/Edit";
// import {
//   getAssetServiceDetails,
//   refillAndHpTest,
// } from "../../../api/organization/internal";
// import { useParams } from "react-router-dom";
// import Spinner from "../../admin/spinner/Spinner";
// import { formatDate } from "../../../utils/helpers/formatDate";
// import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
// import { useFormik } from "formik";
// import Toaster from "../../../components/toaster/Toaster";
// import { formatCalenderDate } from "../../../utils/helpers/formatCalenderDate";

// const ServiceDetails = () => {
//   const [value, setValue] = useState("1");
//   const [modal, setModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [serviceDetails, setServiceDetailsl] = useState([]);
//   const [assetDetail, setAssetDetail] = useState({});
//   const { assetId } = useParams();
//   const [error, setError] = useState("");
//   const [addSuccess, setAddSuccess] = useState(false);
//   const [healthGraph, setHealthGraph] = useState([]);

//   const fetchData = async () => {
//     setLoading(true);
//     const response = await getAssetServiceDetails(assetId);
//     if (response.status === 200) {
//       setServiceDetailsl(response.data.serviceDetails);
//       setAssetDetail(response.data.assetDetails);
//       setHealthGraph(response?.data?.healthGraph);
//     }
//     setLoading(false);
//   };
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const COMMON_TAB = [
//     {
//       value: "1",
//       label: "Service Records",
//       disabled: false,
//       content: <ServiceRecord services={serviceDetails} />,
//     },
//     ...(assetDetail?.productId?.categoryId?.categoryName ===
//     "Fire Extinguishers"
//       ? [
//           {
//             value: "2",
//             label: "Health Graph",
//             disabled: false,
//             content: <LineChart healthGraph={healthGraph} />,
//           },
//         ]
//       : []),
//   ];

//   const toggle = () => {
//     setModal(!modal);
//   };

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const setAddToaster = () => {
//     setAddSuccess(true);
//     setTimeout(() => setAddSuccess(false), 2500);
//   };

//   const formSchema = Yup.object().shape({
//     refilledOn: Yup.string().required("Required"),
//     hpTestOn: Yup.string().required("Required"),
//   });

//   const formik = useFormik({
//     initialValues: {
//       refilledOn: formatCalenderDate(assetDetail.refilledOn),
//       hpTestOn: formatCalenderDate(assetDetail.hpTestOn),
//       nextHpTestDue: formatCalenderDate(assetDetail.nextHpTestDue),
//     },
//     enableReinitialize: true,
//     validationSchema: formSchema,
//     onSubmit: async (values, actions) => {
//       const data = {
//         _id: assetId,
//         refilledOn: values.refilledOn,
//         hpTestOn: values.hpTestOn,
//       };
//       const response = await refillAndHpTest(data);
//       if (response.status === 200) {
//         setModal(!modal);
//         fetchData();
//         setAddToaster();
//         actions.resetForm();
//       } else {
//         setError(response.data.message);
//         setTimeout(() => setError(false), 4500);
//       }
//     },
//   });

//   return (
//     <>
//       {loading ? (
//         <Spinner />
//       ) : (
//         <>
//           <Grid
//             container
//             spacing={2}
//             justifyContent="space-between"
//             display="flex"
//             alignItems="center"
//           >
//             <Grid item sm={5} display={"flex"} justifyContent={"center"}>
//               <Box>
//                 <CardMedia
//                   component="img"
//                   image={assetDetail.productId?.image2}
//                   alt="products"
//                   sx={{
//                     maxHeight: "400px",
//                     width: "90%",
//                     objectFit: "contain",
//                   }}
//                 />
//                 <Typography variant="h4" p={2} className="text-center">
//                   {assetDetail.assetId}
//                 </Typography>
//               </Box>
//             </Grid>
//             <Grid item sm={7}>
//               <Grid item sm={12}>
//                 <Typography variant="h4">
//                   {assetDetail.productId?.productName?.toUpperCase()}
//                 </Typography>
//               </Grid>
//               {[
//                 {
//                   label: "LAST INSPECTION:",
//                   value: assetDetail.serviceDates?.lastServiceDates?.inspection
//                     ? formatDate(
//                         assetDetail.serviceDates.lastServiceDates.inspection
//                       )
//                     : "-",
//                 },
//                 {
//                   label: "NEXT INSPECTION:",
//                   value: assetDetail.serviceDates?.nextServiceDates?.inspection
//                     ? formatDate(
//                         assetDetail.serviceDates.nextServiceDates.inspection
//                       )
//                     : "-",
//                 },
//                 {
//                   label: "LAST TESTING:",
//                   value: assetDetail.serviceDates?.lastServiceDates?.testing
//                     ? formatDate(
//                         assetDetail.serviceDates?.lastServiceDates?.testing
//                       )
//                     : "-",
//                 },
//                 {
//                   label: "NEXT TESTING:",
//                   value: assetDetail.serviceDates?.nextServiceDates?.testing
//                     ? formatDate(
//                         assetDetail.serviceDates?.nextServiceDates?.testing
//                       )
//                     : "-",
//                 },
//                 {
//                   label: "LAST MAINTENANCE:",
//                   value: assetDetail.serviceDates?.lastServiceDates?.maintenance
//                     ? formatDate(
//                         assetDetail.serviceDates?.lastServiceDates?.maintenance
//                       )
//                     : "-",
//                 },
//                 {
//                   label: "NEXT MAINTENANCE:",
//                   value: assetDetail.serviceDates?.nextServiceDates?.maintenance
//                     ? formatDate(
//                         assetDetail.serviceDates?.nextServiceDates?.maintenance
//                       )
//                     : "-",
//                 },
//                 {
//                   label: "Health Status:",
//                   value: assetDetail.healthStatus,
//                 },
//                 {
//                   label: "Remarks:",
//                   value: serviceDetails[0]?.managerRemark
//                     ? serviceDetails[0]?.managerRemark
//                     : "-",
//                 },
//                 {
//                   label: "Service By:",
//                   value: serviceDetails[0]?.technicianUserId?.name
//                     ? serviceDetails[0]?.technicianUserId?.name
//                     : "-",
//                 },
//               ].map((item, index) => (
//                 <Grid container key={index} spacing={1} alignItems="center">
//                   <Grid item xs={4}>
//                     <Typography variant="subtitle1" fontWeight="bold">
//                       {item?.label?.toUpperCase()}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={8}>
//                     <Typography variant="body2">{item?.value}</Typography>
//                   </Grid>
//                 </Grid>
//               ))}
//               {assetDetail?.productId?.categoryId?.categoryName ==
//                 "Fire Extinguishers" && (
//                 <Grid container direction="row" spacing={0} alignItems="center">
//                   <Grid item sm={4}>
//                     <Typography variant="subtitle1" fontWeight="bold">
//                       Refilled On:
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={8}>
//                     <Typography variant="body2">
//                       {formatDate(assetDetail.refilledOn)}{" "}
//                       <EditIcon fontSize="small" onClick={toggle} />
//                       <Dialog
//                         open={modal}
//                         onClose={toggle}
//                         fullWidth
//                         aria-labelledby="alert-dialog-title"
//                         aria-describedby="alert-dialog-description"
//                       >
//                         <DialogTitle
//                           id="alert-dialog-title"
//                           variant="h5"
//                           sx={dialogTitleStyles}
//                         >
//                           {"Refilled/HP-Test"}
//                           <IconButton aria-label="close" onClick={toggle}>
//                             <CloseIcon sx={{ color: "white" }} />
//                           </IconButton>
//                         </DialogTitle>
//                         <DialogContent>
//                           <Box mt={2}>
//                             <form onSubmit={formik.handleSubmit}>
//                               <Grid spacing={2} container>
//                                 <Grid item xs={12}>
//                                   <FormLabel>
//                                     Refilled On
//                                     <span className="text-danger">*</span>
//                                   </FormLabel>
//                                   <TextField
//                                     type="date"
//                                     id="refilledOn"
//                                     name="refilledOn"
//                                     size="large"
//                                     placeholder="Enter refilledOn"
//                                     variant="outlined"
//                                     fullWidth
//                                     value={formik.values.refilledOn}
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     error={
//                                       formik.touched.refilledOn &&
//                                       Boolean(formik.errors.refilledOn)
//                                     }
//                                     helperText={
//                                       formik.touched.refilledOn &&
//                                       formik.errors.refilledOn
//                                     }
//                                   />
//                                 </Grid>
//                                 <Grid item xs={12}>
//                                   <FormLabel>
//                                     HP Test On
//                                     <span className="text-danger">*</span>
//                                   </FormLabel>
//                                   <TextField
//                                     type="date"
//                                     id="hpTestOn"
//                                     name="hpTestOn"
//                                     size="large"
//                                     placeholder="Enter hpTestOn"
//                                     variant="outlined"
//                                     fullWidth
//                                     value={formik.values.hpTestOn}
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     error={
//                                       formik.touched.hpTestOn &&
//                                       Boolean(formik.errors.hpTestOn)
//                                     }
//                                     helperText={
//                                       formik.touched.hpTestOn &&
//                                       formik.errors.hpTestOn
//                                     }
//                                   />
//                                 </Grid>
//                                 <Grid item xs={12}>
//                                   <FormLabel>
//                                     Next HP Test Due
//                                     <span className="text-danger">*</span>
//                                   </FormLabel>
//                                   <TextField
//                                     type="date"
//                                     id="nextHpTestDue"
//                                     name="nextHpTestDue"
//                                     size="large"
//                                     placeholder="Enter nextHpTestDue"
//                                     variant="outlined"
//                                     fullWidth
//                                     value={formik.values.nextHpTestDue}
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     error={
//                                       formik.touched.nextHpTestDue &&
//                                       Boolean(formik.errors.nextHpTestDue)
//                                     }
//                                     helperText={
//                                       formik.touched.nextHpTestDue &&
//                                       formik.errors.nextHpTestDue
//                                     }
//                                     InputProps={{
//                                       readOnly: true,
//                                     }}
//                                   />
//                                 </Grid>
//                               </Grid>
//                             </form>
//                           </Box>
//                           {/* <ul>
//                               <li>23 jan 2024</li>
//                               <li>24 jan 2024</li>
//                               <li>27 feb 2024</li>
//                             </ul> */}
//                         </DialogContent>
//                         <DialogActions>
//                           <Button onClick={toggle} color="primary">
//                             Close
//                           </Button>
//                           <Button
//                             onClick={formik.handleSubmit}
//                             color="secondary"
//                             variant="contained"
//                           >
//                             Submit
//                           </Button>
//                         </DialogActions>
//                         {error != "" ? (
//                           <Toaster
//                             title="Service Dates"
//                             message={error}
//                             color="error"
//                           />
//                         ) : (
//                           ""
//                         )}
//                       </Dialog>
//                     </Typography>
//                   </Grid>

//                   <Grid item sm={4}>
//                     <Typography variant="subtitle1" fontWeight="bold">
//                       HP Tested On:
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={8}>
//                     <Typography variant="body2">
//                       {formatDate(assetDetail.hpTestOn)}
//                     </Typography>
//                   </Grid>

//                   <Grid item sm={4}>
//                     <Typography variant="subtitle1" fontWeight="bold">
//                       Next HP Test Due:
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={8}>
//                     <Typography variant="body2">
//                       {formatDate(assetDetail.nextHpTestDue)}
//                     </Typography>
//                   </Grid>
//                 </Grid>
//               )}
//             </Grid>
//           </Grid>
//           <Divider />
//           <TabContext value={value}>
//             <Box>
//               <TabList
//                 variant="scrollable"
//                 scrollButtons="auto"
//                 onChange={handleChange}
//                 aria-label="lab API tabs example"
//               >
//                 {COMMON_TAB.map((tab, index) => (
//                   <Tab
//                     key={tab.value}
//                     label={tab.label}
//                     value={String(index + 1)}
//                   />
//                 ))}
//               </TabList>
//             </Box>
//             {COMMON_TAB.map((panel, index) => (
//               <TabPanel key={panel.value} value={String(index + 1)}>
//                 {panel.content}
//               </TabPanel>
//             ))}
//           </TabContext>
//           {addSuccess && (
//             <Toaster
//               title="Service"
//               message="Refilled & HP Test data updated successfully"
//               color="success"
//             />
//           )}
//         </>
//       )}
//     </>
//   );
// };

// export default ServiceDetails;
