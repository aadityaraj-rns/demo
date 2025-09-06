import React from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { formatDate } from "../../../utils/helpers/formatDate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PropTypes from "prop-types";

const ReportsDetails = ({ reports, serviceType, startDate, endDate }) => {
  const componentRef = React.useRef();

  // const handleDownload = async () => {
  //   const input = componentRef.current;

  //   if (!input) return;

  //   const canvas = await html2canvas(input, {
  //     scale: 2,
  //     useCORS: true,
  //   });

  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF({
  //     orientation: "landscape",
  //     unit: "pt",
  //     format: [canvas.width, canvas.height],
  //   });

  //   const width = pdf.internal.pageSize.getWidth();
  //   const height = pdf.internal.pageSize.getHeight();

  //   pdf.addImage(imgData, "PNG", 0, 0, width, height);
  //   pdf.save("Service_Reports.pdf");
  // };
  const handleDownload = async () => {
    const input = componentRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("Service_Reports.pdf");
  };

  if (!reports?.length) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "100px",
        }}
      >
        No Data
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "lg", margin: "auto" }}>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={handleDownload}
        sx={{ my: 5 }}
      >
        Download PDF
      </Button>
      <div ref={componentRef}>
        <Container>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="16px"
          >
            {/* <img src={client.headerImage} alt="No Header Image" height="100px" /> */}
            <Typography variant="h5" component="div">
              {/* {serviceName} :*/} {serviceType?.toUpperCase()}{" "}
              {serviceType != "RE-FILLING REPORT" &&
                serviceType != "HP TEST REPORT" &&
                "REPORT"}
            </Typography>
          </Box>
          <Box
            padding="16px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography>
                <b>ORGANIZATION: </b>
                {[
                  ...new Set(
                    reports?.map((r) => r?.orgUserId?.name.toUpperCase())
                  ),
                ]}
              </Typography>
              <Typography>
                <b>TECHNICIAN: </b>{" "}
                {[
                  ...new Set(
                    reports
                      .map((report) =>
                        report?.serviceDoneBy?.name.toUpperCase()
                      )
                      .filter((name) => name)
                  ),
                ].join(", ")}
              </Typography>
              <Typography>
                <b>DATE FROM:</b> {formatDate(startDate)} <b>TO:</b>{" "}
                {formatDate(endDate)}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography>
                <b>SERVICE FREQUENCY: </b>{" "}
                {[
                  ...new Set(
                    reports
                      ?.map((r) => r?.serviceFrequency.toUpperCase())
                      ?.join(", ")
                  ),
                ]}
                {/* {(() => {
                const serviceMapping = {
                  "PUMP ROOM SERVICE": "Pump Room",
                  "FIRE EXTINGUSHER SERVICE": "Fire Extinguishers",
                  "FIRE HYDRANT SERVICE": "Fire Hydrant Service",
                };

                const categoryName = serviceMapping[serviceName];

                const selectedCategory = client?.categories?.find(
                  (category) =>
                    category.categoryId.categoryName === categoryName
                );

                const frequency =
                  selectedCategory?.serviceDetails?.serviceFrequency?.[
                    serviceType
                  ] || "N/A";

                return frequency;
              })()} */}
              </Typography>
              <Typography>
                <b>PLANT:</b>{" "}
                {[
                  ...new Set(
                    reports
                      .map((report) => report.plantId?.plantName?.toUpperCase())
                      .filter((plantName) => plantName)
                  ),
                ].join(", ")}
              </Typography>
              <Typography>
                <b>REPORT DATE: </b> {formatDate(new Date())}
              </Typography>
            </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="inspection report">
              <TableHead>
                <TableRow>
                  <TableCell align="right">ASSET ID</TableCell>
                  {serviceType != "Re-Filling Reports" &&
                    serviceType != "HP Test Reports" && (
                      <TableCell align="right">SERVICE DT</TableCell>
                    )}
                  <TableCell align="right">TYPE</TableCell>
                  <TableCell align="right">CAPACITY</TableCell>
                  <TableCell align="right">BUILDING</TableCell>
                  <TableCell align="right">LOCATION</TableCell>
                  <TableCell align="right">HEALTH</TableCell>
                  {/* {serviceName == "FIRE EXTINGUSHER SERVICE" &&
                  serviceType == "inspection" && (
                    <>
                      <TableCell align="right">PLACEMENT</TableCell>
                      <TableCell align="right">OBSTRUCTION</TableCell>
                      <TableCell align="right">PRESSURE</TableCell>
                    </>
                  )}
                {serviceName == "PUMP ROOM SERVICE" &&
                  serviceType == "inspection" && (
                    <>
                      <TableCell align="right">Pump Status</TableCell>
                      <TableCell align="right">Diesel Level</TableCell>
                      <TableCell align="right">Water Level</TableCell>
                      <TableCell align="right">Pressure</TableCell>
                      <TableCell align="right">Battery Volt</TableCell>
                    </>
                  )}
                {serviceName == "FIRE HYDRANT SERVICE" &&
                  serviceType == "inspection" && (
                    <>
                      <TableCell align="right">Clearance</TableCell>
                      <TableCell align="right">Completeness</TableCell>
                      <TableCell align="right">Leakage</TableCell>
                    </>
                  )}
                {serviceType != "Re-Filling Reports" &&
                  serviceType != "HP Test Reports" &&
                  serviceType != "Fire ExtingusherInventory Reports" && (
                    <TableCell align="right">STATUS</TableCell>
                  )}
                {serviceType == "HP Test Reports" && [
                  <TableCell key="hptest" align="right">
                    HP Test Date
                  </TableCell>,
                  <TableCell key="due" align="right">
                    Next HP Test Due
                  </TableCell>,
                ]}
                {serviceType == "Re-Filling Reports" && (
                  <TableCell align="right">Refilled On</TableCell>
                )}
                {(serviceType == "Re-Filling Reports" ||
                  serviceType == "HP Test Reports") && (
                  <TableCell align="right">Technician</TableCell>
                )} */}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {(serviceType == "HP Test Reports" ||
                serviceType == "Re-Filling Reports") &&
                reports.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="right">{row.assetId}</TableCell>

                    <TableCell align="right">{row.productId.type}</TableCell>
                    <TableCell align="right">
                      {row.capacity + " " + row.productId.capacity}
                    </TableCell>
                    <TableCell align="right">{row.building}</TableCell>
                    <TableCell align="right">{row.location}</TableCell>
                    {serviceType == "HP Test Reports" && [
                      <TableCell key="hpteston" align="right">
                        {formatDate(row.hpTestOn)}
                      </TableCell>,
                      <TableCell key="nextHpTestDue" align="right">
                        {formatDate(row.nextHpTestDue)}
                      </TableCell>,
                    ]}
                    {serviceType == "Re-Filling Reports" && (
                      <TableCell align="right">
                        {formatDate(row.refilledOn)}
                      </TableCell>
                    )}
                    <TableCell align="right">
                      {row.technicianUserId.name}
                    </TableCell>
                  </TableRow>
                ))} */}
                {serviceType != "HP Test Reports" &&
                  serviceType != "Re-Filling Reports" &&
                  reports?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="right">
                        {row.assetsId?.map((a) => a.assetId).join(", ")}
                      </TableCell>
                      <TableCell align="right">
                        {formatDate(row?.date)}
                      </TableCell>
                      <TableCell align="right">
                        {row.assetsId
                          ?.map((a) => a?.productId?.type)
                          .join(", ")}
                      </TableCell>
                      <TableCell align="right">
                        {row.assetsId?.map((a) => a?.capacity).join(", ") +
                          " " +
                          row.assetsId
                            ?.map((a) => a?.productId.capacity)
                            .join(", ")}
                      </TableCell>
                      <TableCell align="right">
                        {row.assetsId?.map((a) => a?.building).join(", ")}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        {row.assetsId?.map((a) => a?.location).join(", ")}
                      </TableCell>
                      {/* {serviceName == "FIRE EXTINGUSHER SERVICE" &&
                      serviceType == "inspection" && (
                        <>
                          <TableCell align="right">
                            {row?.questions[0]?.answer == "Satisfactory"
                              ? "YES"
                              : "NO"}
                          </TableCell>
                          <TableCell align="right">
                            {row?.questions[2]?.answer == "Satisfactory"
                              ? "YES"
                              : "NO"}
                          </TableCell>
                          <TableCell align="right">
                            {row?.questions[5]?.answer == "Satisfactory"
                              ? "YES"
                              : "NO"}
                          </TableCell>
                        </>
                      )} */}
                      {/* {serviceName == "PUMP ROOM SERVICE" &&
                      serviceType == "inspection" && (
                        <>
                          <TableCell align="right">
                            {row?.pumpDetails?.pumpStatus}
                          </TableCell>
                          <TableCell align="right">
                            {row?.pumpDetails?.dieselLevel}
                          </TableCell>
                          <TableCell align="right">
                            {row?.pumpDetails?.waterStorageLevel}
                          </TableCell>
                          <TableCell align="right">
                            {row?.pumpDetails?.dischargePressureGaugeReading}
                          </TableCell>
                          <TableCell align="right">
                            {row?.pumpDetails?.batteryStatusReading}
                          </TableCell>
                        </>
                      )} */}
                      {/* {serviceName == "FIRE HYDRANT SERVICE" &&
                      serviceType == "inspection" && (
                        <>
                          <TableCell align="right">
                            {row?.questions[0]?.answer == "Satisfactory"
                              ? "YES"
                              : "NO"}
                          </TableCell>
                          <TableCell align="right">
                            {row?.questions[1]?.answer == "Satisfactory"
                              ? "YES"
                              : "NO"}
                          </TableCell>
                          <TableCell align="right">
                            {row?.questions[2]?.answer == "Satisfactory"
                              ? "YES"
                              : "NO"}
                          </TableCell>
                        </>
                      )} */}
                      <TableCell align="right">
                        {row.assetsId?.map((a) => a?.healthStatus).join(", ")}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          marginTop="30px"
          padding="16px"
        >
          <Typography variant="subtitle1" align="center" gutterBottom>
            <b>{client?.userId?.name || "Client Name"}</b>
          </Typography>
          <Typography variant="body2" align="center">
            <b>Plant Name:</b>{" "}
            {[
              ...new Set(
                reports
                  .map((report) => report.plantId?.plantName)
                  .filter((plantName) => plantName)
              ),
            ].join(", ")}
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="textSecondary"
            marginTop="8px"
          >
            <b>Report generated on: </b>
            {new Date().toLocaleDateString()} at{" "}
            {new Date().toLocaleTimeString()}
          </Typography>
        </Box> */}
        </Container>
      </div>
    </Box>
  );
};
ReportsDetails.propTypes = {
  reports: PropTypes.array,
  startDate: PropTypes.any,
  endDate: PropTypes.any,
  serviceType: PropTypes.string,
};
export default ReportsDetails;
