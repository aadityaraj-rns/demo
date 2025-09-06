import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  Stack,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  Table,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import { useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import PageContainer from "../../container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { formatDate } from "../../../utils/helpers/formatDate";
import {
  getAssetById,
  getAssetServiceDetails,
} from "../../../api/organization/internal";
import Spinner from "../../../pages/admin/spinner/Spinner";
import { Download, Folder } from "@mui/icons-material";

const AssetInformationDownload = () => {
  const [loading, setLoading] = useState(true);
  const [asset, setAsset] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [nextServiceDates, setNextServiceDates] = useState([]);
  const [lastServiceDates, setLastServiceDates] = useState([]);
  const { id } = useParams();

  const componentRef = React.useRef();

  const BCrumb = [
    { to: "/customer", title: "Home" },
    { to: "/customer/assets", title: "Asset" },
    { title: "View" },
  ];

  const handleDownload = () => {
    const element = componentRef.current;
    const opt = {
      margin: 0.3,
      filename: "AssetDetails.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  const fetchAssets = async () => {
    setLoading(true);
    const response = await getAssetById(id);
    if (response.status === 200) {
      setAsset(response.data.asset);
    }
    setLoading(false);
  };
  const fetchData = async () => {
    setLoading(true);
    const response = await getAssetServiceDetails(id);
    if (response.status === 200) {
      setServiceHistory(response.data.serviceDetails);
      setNextServiceDates(response.data.nextServiceDates);
      setLastServiceDates(response.data.lastServiceDates);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
    fetchData();
  }, []);

  const downloadQRCode = async () => {
    try {
      const response = await fetch(asset?.qrCodeUrl);
      const blob = await response.blob();
      const img = new Image();

      img.onload = () => {
        // Define canvas dimensions
        const canvasWidth = 300;
        const canvasHeight = 500;
        const qrSize = 200;

        // Create canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Fill background with white
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add border and rounded corners
        ctx.fillStyle = "black";
        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";
        ctx.roundRect(2, 2, canvasWidth - 4, canvasHeight - 4, 20);
        ctx.stroke();

        // Draw Asset ID
        ctx.fillStyle = "black";
        ctx.font = "bold 22px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`ASSET ID: ${asset.assetId}`, canvasWidth / 2, 50);

        // Draw QR Code (centered below Asset ID)
        ctx.drawImage(img, (canvasWidth - qrSize) / 2, 70, qrSize, qrSize);

        // Set text properties
        ctx.font = "18px Arial";
        ctx.textAlign = "left";

        const textStartX = 40;
        let textStartY = 300; // Start below QR code
        const lineHeight = 30;

        // Draw text information
        ctx.fillText(
          `PRODUCT: ${asset?.productId.productName}`,
          textStartX,
          textStartY
        );
        ctx.fillText(
          `CAPACITY: ${asset?.capacity} ${asset?.capacityUnit}`,
          textStartX,
          textStartY + lineHeight
        );
        ctx.fillText(
          `PLANT: ${asset?.plantId.plantName}`,
          textStartX,
          textStartY + lineHeight * 2
        );
        ctx.fillText(
          `BUILDING: ${asset?.building}`,
          textStartX,
          textStartY + lineHeight * 3
        );
        ctx.fillText(
          `LOCATION: ${asset?.location}`,
          textStartX,
          textStartY + lineHeight * 4
        );

        // Convert canvas to downloadable image
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `QRCode_${asset?.assetId}.png`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      img.src = URL.createObjectURL(blob);
    } catch (error) {
      console.error("Failed to download QR code:", error);
    }
  };
  const handleDocumentPreview = (docUrl) => {
    if (docUrl) {
      window.open(docUrl, "_blank"); // Opens the document in a new tab
    } else {
      console.error("Document URL not found");
    }
  };
  const variantImage =
    asset?.productId?.variants?.find((v) => v.type === asset?.type)?.image ||
    "";

  return loading ? (
    <Spinner />
  ) : (
    <PageContainer
      title="Asset Details"
      description="This is the Asset Details page"
    >
      <Breadcrumb title="Asset" items={BCrumb} />
      <Grid spacing={3} container justifyContent="center" mt>
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
                <Box display="flex" alignItems="center" gap={1}>
                  <img
                    src={variantImage}
                    alt="Product Logo"
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: "contain",
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {asset?.productId?.productName?.toUpperCase()}
                  </Typography>
                </Box>
              </Grid>
              {/* <Grid item xs={6} textAlign="right">
                {asset?.qrCodeUrl ? (
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-block",
                      cursor: "pointer",
                      "&:hover .download-btn": {
                        opacity: 1,
                      },
                    }}
                  >
                    <img
                      src={asset?.qrCodeUrl}
                      alt="QR Code"
                      style={{
                        width: "auto",
                        maxHeight: "80px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                      }}
                      onClick={downloadQRCode}
                    />

                    <IconButton
                      className="download-btn"
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 4,
                        right: 4,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                      }}
                      onClick={downloadQRCode}
                    >
                      <Download fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Typography variant="subtitle1">QR Not Available</Typography>
                )}
              </Grid> */}
              <Grid item xs={6} textAlign="right">
                {asset?.qrCodeUrl ? (
                  <Box
                    sx={{
                      display: "inline-flex",
                      flexDirection: "row",
                      alignItems: "flex-end",
                    }}
                  >
                    <img
                      src={asset?.qrCodeUrl}
                      alt="QR Code"
                      style={{
                        width: "auto",
                        maxHeight: "80px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                      onClick={downloadQRCode}
                    />
                    <IconButton
                      size="small"
                      sx={{ color: "blue" }}
                      onClick={downloadQRCode}
                    >
                      <Download fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Typography variant="subtitle1">QR Not Available</Typography>
                )}
              </Grid>
            </Grid>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              ASSET INFORMATION
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} md={3}>
                <Stack spacing={1}>
                  <Box>
                    <Typography variant="body2">ASSET ID</Typography>
                    <Typography>{asset?.assetId}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2">PRODUCT CATEGORY</Typography>
                    <Typography>
                      {asset?.productId?.categoryId?.categoryName}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack spacing={1}>
                  <Box>
                    <Typography variant="body2">BUILDING</Typography>
                    <Typography>{asset?.building}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2">HEALTH CONDDITION</Typography>
                    {asset?.healthStatus}
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack spacing={1}>
                  <Box>
                    <Typography variant="body2">Plant Name</Typography>
                    <Typography>{asset?.plantId?.plantName}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2">SERVICE STATUS</Typography>
                    {asset?.status}
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack spacing={1}>
                  <Box>
                    <Typography variant="body2">Location</Typography>
                    <Typography>{asset?.location}</Typography>
                  </Box>
                  <Box>
                    {asset?.document1 && (
                      <Typography
                        variant="body2"
                        color={"blue"}
                        onClick={() => handleDocumentPreview(asset?.document1)}
                      >
                        <Folder fontSize="small" /> Document 1
                      </Typography>
                    )}
                    {asset?.document2 && (
                      <Typography
                        variant="body2"
                        color={"blue"}
                        onClick={() => handleDocumentPreview(asset?.document2)}
                      >
                        <Folder fontSize="small" /> Document 2
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Grid>
            </Grid>
            <Divider sx={{ my: 1, borderColor: "darkgray" }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              PRODUCT INFORMATION
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2">PRODUCT NAME</Typography>
                <Typography>{asset?.productId?.productName}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2">TYPE</Typography>
                <Typography>{asset?.productId?.type}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2">MODEL</Typography>
                <Typography>{asset?.model || "-"}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2">DIMENSION / CAPACITY</Typography>
                <Typography>
                  {asset?.capacity} {asset?.capacityUnit}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2">MANUFACTURER</Typography>
                <Typography>{asset?.manufacturerName || "-"}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2">HP TEST FREQUENCY</Typography>
                <Typography>{asset?.productId?.testFrequency}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2">PRESSURE</Typography>
                <Typography>
                  {asset?.pressureRating || "-"} {asset?.pressureUnit}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2">GEO LOCATION</Typography>
                <Typography>
                  <Typography>
                    {asset?.lat && asset?.long
                      ? `${asset.lat}, ${asset.long}`
                      : "-"}
                  </Typography>
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 1, borderColor: "darkgray" }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              INSTALLATION AND MAINTENANCE
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6} md={4}>
                <Typography variant="body2">MANUFACTURING DATE</Typography>
                <Typography>{formatDate(asset?.manufacturingDate)}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2">INSTALLATION DATE</Typography>
                <Typography>{formatDate(asset?.installDate)}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2">SERVICE ENGINEER</Typography>
                <Typography>
                  {asset?.technicianUserId?.map((t) => t?.name).join(", ")}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2">LAST INSPECTION</Typography>
                <Typography>
                  {formatDate(lastServiceDates?.inspection) || ""}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2">LAST TESTING</Typography>
                <Typography>
                  {formatDate(lastServiceDates?.testing) || "-"}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2">LAST MAINTENANCE</Typography>
                <Typography>
                  {formatDate(lastServiceDates?.maintenence) || "-"}
                </Typography>
              </Grid>

              <Grid item xs={6} md={4}>
                <Typography variant="body2">NEXT INSPECTION</Typography>
                <Typography>
                  {formatDate(nextServiceDates?.inspection) || "-"}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2">NEXT TESTING</Typography>
                <Typography>
                  {formatDate(nextServiceDates?.testing) || "-"}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2">NEXT MAINTENANCE</Typography>
                <Typography>
                  {formatDate(nextServiceDates?.maintenence) || "-"}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 1, borderColor: "darkgray" }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              SERVICE HISTORY
            </Typography>

            {serviceHistory?.length === 0 ? (
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
                      <TableCell sx={{ fontWeight: "bold" }}>DATE</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        FREQUENCY
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>TYPE</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>STATUS</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        TECHNICIAN
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {serviceHistory?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{formatDate(item?.date)}</TableCell>
                        <TableCell>{item?.serviceFrequency}</TableCell>
                        <TableCell>{item?.serviceType}</TableCell>
                        <TableCell>{item?.completedStatus}</TableCell>
                        <TableCell>{item?.serviceDoneBy?.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Grid>
      </Grid>
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
            size="small"
            onClick={handleDownload}
            startIcon={<DownloadOutlinedIcon />}
          >
            DOWNLOAD
          </Button>
        </Box>
      </Grid>
    </PageContainer>
  );
};

export default AssetInformationDownload;
