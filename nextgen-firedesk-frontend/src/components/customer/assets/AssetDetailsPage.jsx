// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getAssetById } from "../../../api/organization/internal";
// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   Box,
//   Button,
//   CardMedia,
//   Grid,
//   Typography,
// } from "@mui/material";
// import { formatDate } from "../../../utils/helpers/formatDate";
// import Spinner from "../../../pages/admin/spinner/Spinner";
// import ImageModal from "../../common/ImageModal";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// function AssetDetailsPage() {
//   const { assetId } = useParams();
//   const [assetData, setAssetData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [showModal, setShowModal] = useState(false);
//   const [selectedImage, setSelectedImage] = useState("");

//   const handleDocumentPreview = (docUrl) => {
//     if (docUrl) {
//       window.open(docUrl, "_blank"); // Opens the document in a new tab
//     } else {
//       console.error("Document URL not found");
//     }
//   };

//   const handleImageClick = (imgUrl) => {
//     setSelectedImage(imgUrl);
//     setShowModal(true);
//   };

//   const fetchAssets = async () => {
//     const response = await getAssetById(assetId);
//     if (response.status === 200) {
//       setAssetData(response.data.asset);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAssets();
//   }, []);

//   const downloadQRCode = async () => {
//     try {
//       const response = await fetch(assetData.qrCodeUrl);
//       const blob = await response.blob();
//       const img = new Image();

//       img.onload = () => {
//         // Define canvas dimensions
//         const canvasWidth = 300;
//         const canvasHeight = 500;
//         const qrSize = 200;

//         // Create canvas
//         const canvas = document.createElement("canvas");
//         const ctx = canvas.getContext("2d");

//         canvas.width = canvasWidth;
//         canvas.height = canvasHeight;

//         // Fill background with white
//         ctx.fillStyle = "white";
//         ctx.fillRect(0, 0, canvas.width, canvas.height);

//         // Add border and rounded corners
//         ctx.fillStyle = "black";
//         ctx.lineWidth = 4;
//         ctx.strokeStyle = "black";
//         ctx.roundRect(2, 2, canvasWidth - 4, canvasHeight - 4, 20);
//         ctx.stroke();

//         // Draw Asset ID
//         ctx.fillStyle = "black";
//         ctx.font = "bold 22px Arial";
//         ctx.textAlign = "center";
//         ctx.fillText(`ASSET ID: ${assetData.assetId}`, canvasWidth / 2, 50);

//         // Draw QR Code (centered below Asset ID)
//         ctx.drawImage(img, (canvasWidth - qrSize) / 2, 70, qrSize, qrSize);

//         // Set text properties
//         ctx.font = "18px Arial";
//         ctx.textAlign = "left";

//         const textStartX = 40;
//         let textStartY = 300; // Start below QR code
//         const lineHeight = 30;

//         // Draw text information
//         ctx.fillText(
//           `PRODUCT: ${assetData.productId.productName}`,
//           textStartX,
//           textStartY
//         );
//         ctx.fillText(
//           `CAPACITY: ${assetData.capacity} ${assetData.productId.capacity}`,
//           textStartX,
//           textStartY + lineHeight
//         );
//         ctx.fillText(
//           `PLANT: ${assetData.plantId.plantName}`,
//           textStartX,
//           textStartY + lineHeight * 2
//         );
//         ctx.fillText(
//           `BUILDING: ${assetData.building}`,
//           textStartX,
//           textStartY + lineHeight * 3
//         );
//         ctx.fillText(
//           `LOCATION: ${assetData.location}`,
//           textStartX,
//           textStartY + lineHeight * 4
//         );

//         // Convert canvas to downloadable image
//         const url = canvas.toDataURL("image/png");
//         const link = document.createElement("a");
//         link.href = url;
//         link.setAttribute("download", `QRCode_${assetData.assetId}.png`);
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       };

//       img.src = URL.createObjectURL(blob);
//     } catch (error) {
//       console.error("Failed to download QR code:", error);
//     }
//   };

//   return loading ? (
//     <Spinner />
//   ) : (
//     <>
//       <Grid container spacing={2}>
//         <Grid item xs={12} md={5}>
//           <CardMedia
//             component="img"
//             image={assetData.productId.image1}
//             alt="products"
//             sx={{
//               maxHeight: "300px",
//               width: "100%",
//               objectFit: "contain",
//             }}
//           />
//           <Box textAlign="center" my={2}>
//             <img
//               src={assetData?.qrCodeUrl}
//               alt="img"
//               style={{ height: "130px", width: "130px", cursor: "pointer" }}
//               onClick={() => handleImageClick(assetData?.qrCodeUrl)}
//             />
//             <ImageModal
//               show={showModal}
//               img={selectedImage}
//               onClose={() => setShowModal(false)}
//             />
//           </Box>
//           <Typography variant="h5" textAlign="center" gutterBottom>
//             {assetData.assetId}
//           </Typography>
//           <Typography variant="h6" textAlign="center">
//             {assetData.productId.productName}
//           </Typography>

//           <Box textAlign="center" py={1}>
//             <Button variant="outlined" color="success" onClick={downloadQRCode}>
//               Download QR
//             </Button>
//           </Box>

//           <Grid container spacing={1} justifyContent="center">
//             <Grid item>
//               <Button
//                 variant="outlined"
//                 color="primary"
//                 onClick={() => handleDocumentPreview(assetData.document1)}
//                 disabled={!assetData.document1}
//               >
//                 Document 1
//               </Button>
//             </Grid>
//             <Grid item>
//               <Button
//                 variant="outlined"
//                 color="primary"
//                 onClick={() => handleDocumentPreview(assetData.document2)}
//                 disabled={!assetData.document2}
//               >
//                 Document 2
//               </Button>
//             </Grid>
//           </Grid>
//         </Grid>

//         {/* Right side: Text details */}
//         <Grid item xs={12} md={7}>
//           {[
//             {
//               label: "Category",
//               value: assetData.productId.categoryId.categoryName,
//             },
//             { label: "Product", value: assetData.productId.productName },
//             { label: "Type", value: assetData.productId.type },
//             {
//               label: "Capacity",
//               value: assetData.capacity + " " + assetData.productId.capacity,
//             },
//             { label: "Model", value: assetData.model },
//             { label: "Plant", value: assetData.plantId.plantName },
//             { label: "Building", value: assetData.building },
//             { label: "Location", value: assetData.location },
//             {
//               label: "Mfg Date",
//               value: formatDate(assetData.manufacturingDate),
//             },
//             {
//               label: "Manufacturer Name",
//               value: assetData.manufacturerName,
//             },
//             {
//               label: "Install Date",
//               value: formatDate(assetData.installDate),
//             },
//             assetData.lat ? { label: "Latitude", value: assetData.lat } : null,
//             assetData.long
//               ? { label: "Longitude", value: assetData.long }
//               : null,
//             assetData.latLongRemark
//               ? { label: "Remark", value: assetData.latLongRemark }
//               : null,
//             { label: "Status", value: assetData.status },
//           ]
//             .map((item, index) => (
//               <Grid
//                 container
//                 key={index}
//                 spacing={1}
//                 alignItems="center"
//               >
//                 <Grid item xs={4}>
//                   <Typography variant="subtitle1" fontWeight="bold">
//                     {item?.label?.toUpperCase()}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={8}>
//                   <Typography variant="body2">{item?.value}</Typography>
//                 </Grid>
//               </Grid>
//             ))}

//           <Accordion sx={{ mt: 2 }}>
//             <AccordionSummary
//               expandIcon={<ExpandMoreIcon />}
//               aria-controls="panel1-content"
//               id="panel1-header"
//             >
//               <Typography>Previous Locations</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
//                 {assetData.oldlatlongs.map((item, index) => (
//                   <li key={index} style={{ marginBottom: "10px" }}>
//                     <Typography variant="body1">
//                       <strong>Location:</strong> {item.location}
//                     </Typography>
//                     <Typography variant="body1">
//                       <strong>Plant:</strong> {item.plantId?.plantName}
//                     </Typography>
//                     <Typography variant="body1">
//                       <strong>Building:</strong> {item.building}
//                     </Typography>
//                     <Typography variant="body2">
//                       <strong>Lat:</strong> {item.lat}, <strong>Long:</strong>{" "}
//                       {item.long}
//                     </Typography>
//                   </li>
//                 ))}
//               </ul>
//             </AccordionDetails>
//           </Accordion>

//           <Box textAlign="center" mt={2}>
//             <Button
//               color="success"
//               variant="outlined"
//               onClick={() =>
//                 navigate("/customer/assets/information", {
//                   state: { assetData },
//                 })
//               }
//             >
//               View more
//             </Button>
//           </Box>
//         </Grid>
//       </Grid>
//     </>
//   );
// }

// export default AssetDetailsPage;
