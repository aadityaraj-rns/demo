// import {
//   Box,
//   Button,
//   CardMedia,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Fab,
//   Grid,
//   IconButton,
// } from "@mui/material";
// import { IconEye } from "@tabler/icons";
// import React, { useState } from "react";
// import BlankCard from "../../shared/BlankCard";
// import CustomSlider from "../../slider/CustomSlider";
// import ViewTextInput from "../../forms/theme-elements/ViewTextInput";
// import CloseIcon from "@mui/icons-material/Close";

// const ProductViewModal = ({ product, triggerComponent }) => {
//   const [modal, setModal] = useState(false);

//   const toggle = () => {
//     setModal(!modal);
//   };

//   return (
//     <>
//       {triggerComponent ? (
//         <span onClick={toggle}>{triggerComponent}</span>
//       ) : (
//         <Fab size="small" color="primary" onClick={toggle} sx={{ marginRight: 2 }}>
//           <IconEye size="16" />
//         </Fab>
//       )}

//       <Dialog
//         open={modal}
//         onClose={toggle}
//         maxWidth="lg"
//         fullWidth
//         aria-labelledby="product-view-dialog-title"
//         aria-describedby="product-view-dialog-description"
//       >
//         <DialogTitle
//           id="product-view-dialog-title"
//           color="primary"
//           variant="h6"
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           {"View Product"}
//           <IconButton aria-label="close" onClick={toggle}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent>
//           <Box maxHeight={500} padding="16px">
//             <Grid container spacing={4} mb={2}>
//               <Grid item xs={12} lg={7}>
//                 <ViewTextInput
//                   label="Category Name:"
//                   value={product.categoryName}
//                 />
//                 <ViewTextInput
//                   label="Product Name:"
//                   value={product.productName}
//                 />
//                 {/* <ViewTextInput
//                   label="Manufacturer Name:"
//                   value={product.manufacturerName}
//                 /> */}
//                 <ViewTextInput label="Type:" value={product.type} />
//                 <ViewTextInput label="Capacity:" value={product.capacity} />
//                 <ViewTextInput
//                   label="Test Frequency:"
//                   value={product.testFrequency}
//                 />
//                 <ViewTextInput
//                   label="Description:"
//                   value={product.description}
//                 />
//               </Grid>
//               <Grid item xs={12} lg={5}>
//                 <Box mb={2}>
//                   <CustomSlider>
//                     <Box>
//                       <BlankCard className="hoverCard">
//                         <CardMedia
//                           component="img"
//                           style={{
//                             maxHeight: "350px",
//                             width: "100%",
//                             objectFit: "contain",
//                             border: "1px solid #ccc",
//                             borderRadius: "8px",
//                           }}
//                           alt="Product Image 1"
//                           src={product.image1}
//                         />
//                       </BlankCard>
//                     </Box>
//                     <Box>
//                       <BlankCard className="hoverCard">
//                         <CardMedia
//                           component="img"
//                           style={{
//                             maxHeight: "350px",
//                             width: "100%",
//                             objectFit: "contain",
//                             border: "1px solid #ccc",
//                             borderRadius: "8px",
//                           }}
//                           alt="Product Image 2"
//                           src={product.image2}
//                         />
//                       </BlankCard>
//                     </Box>
//                   </CustomSlider>
//                 </Box>
//               </Grid>
//             </Grid>
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             variant="contained"
//             color="error"
//             onClick={toggle}
//             size="large"
//             sx={{ padding: "10px 20px" }}
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default ProductViewModal;
