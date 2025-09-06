import { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../container/PageContainer";
import { useNavigate, useParams } from "react-router-dom";
import { getGroupServiceDetails } from "../../../api/organization/internal";
import { formatDate } from "../../../utils/helpers/formatDate";
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { DownloadOutlined } from "@mui/icons-material";
import html2pdf from "html2pdf.js";

const BCrumb = [
  {
    to: "/customer",
    title: "Home",
  },
  {
    to: "/customer/group-service",
    title: "Group-Service",
  },
  {
    title: "View",
  },
];
const ViewGroupService = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [groupServiceData, setGroupServiceData] = useState([]);
  const [groupDetails, setGroupDetails] = useState({});
  const [nextInspection, setNextInspection] = useState("");
  const [nextTesting, setNextTesting] = useState("");
  const [nextMaintenence, setNextMaintenence] = useState({});
  const componentRef = useRef();

  useEffect(() => {
    if (!_id) {
      return navigate("/customer/group-service");
    }
    const fetchData = async () => {
      const response = await getGroupServiceDetails(_id);
      if (response.status == 200) {
        setGroupServiceData(response?.data?.serviceDetails);
        setGroupDetails(response?.data?.groupDetilas);
        setNextInspection(response?.data?.nextInspection.date);
        setNextTesting(response?.data?.nextTesting.date);
        setNextMaintenence(response?.data?.nextMaintenence.date);
      }
    };
    fetchData();
  }, [_id]);

  const handleDownload = () => {
    const element = componentRef.current;
    const opt = {
      margin: 0.3,
      filename: "GroupDetails.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <PageContainer
      title="Group service details"
      description="this is Group service details page"
    >
      <Breadcrumb title="Asset" items={BCrumb} />
      <Grid spacing={3} container justifyContent="center">
        <Grid item xs={12} lg={12}>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            mr={3}
            mt={1}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleDownload}
              startIcon={<DownloadOutlined />}
              size="small"
            >
              DOWNLOAD
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} lg={10}>
          <Box ref={componentRef}>
            <Grid container spacing={1} sx={{ height: "70px" }}>
              <Grid
                item
                xs={6}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                sx={{ height: "100%" }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {groupDetails?.groupName?.toUpperCase()}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  GROUP INFORMATION
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                {groupDetails?.qrCodeUrl ? (
                  <img
                    src={groupDetails?.qrCodeUrl}
                    alt="QR Code"
                    style={{
                      width: "auto",
                      maxHeight: "80px",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                    }}
                  />
                ) : (
                  <Typography variant="subtitle1">QR Not Available</Typography>
                )}
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <Stack spacing={1}>
                  <Box>
                    <Typography variant="body2">GROUP ID</Typography>
                    <Typography>{groupDetails?.groupId}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2">PRODUCT CATEGORY</Typography>
                    <Typography>
                      {" "}
                      {[
                        ...new Set(
                          groupDetails?.assetsId?.map(
                            (a) => a?.productCategoryId?.categoryName
                          )
                        ),
                      ].join(", ")}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={5}>
                <Stack spacing={1}>
                  <Box>
                    <Typography variant="body2">BUILDING</Typography>
                    <Typography>
                      {[
                        ...new Set(
                          groupDetails?.assetsId?.map((a) => a?.building)
                        ),
                      ].join(", ")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2">PLANT NAME</Typography>
                    <Typography>{groupDetails?.plantId?.plantName}</Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
            <Divider sx={{ my: 1, borderColor: "blue" }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              ASSET INFORMATION
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} spacing={1}>
                <Typography>
                  {groupDetails?.assetsId
                    ?.map((a, index) => `${index + 1}. ${a?.assetId}`)
                    .join(", ")}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 1, borderColor: "blue" }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              SERVICE DETAILS
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2">SERVICE START DATE</Typography>
                  <Typography>{formatDate(groupDetails?.startDate)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2">SERVICE END DATE</Typography>
                  <Typography>{formatDate(groupDetails?.endDate)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2">NEXT INSPECTION</Typography>
                  <Typography>{formatDate(nextInspection)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2">NEXT TESTING</Typography>
                  <Typography>{formatDate(nextTesting)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2">NEXT MAINTENANCE</Typography>
                  <Typography>{formatDate(nextMaintenence)}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ my: 1, borderColor: "blue" }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              SERVICE HISTORY
            </Typography>
            {groupServiceData?.length === 0 ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100px"
              >
                <Typography>No Service Records</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>SR NO</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>DUE</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        FREQUENCY
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>TYPE</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupServiceData?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{formatDate(item?.date)}</TableCell>
                        <TableCell>{item?.serviceFrequency}</TableCell>
                        <TableCell>{item?.serviceType}</TableCell>
                        <TableCell>{item?.completedStatus}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ViewGroupService;
