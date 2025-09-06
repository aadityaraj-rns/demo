// import { Grid, Box, CardMedia, useMediaQuery, Typography } from "@mui/material";
// import PageContainer from "src/components/container/PageContainer";
// import FiredeskLogo from "src/assets/images/logos/firedesk_orange_logo.png";
// import tagline from "src/assets/images/logos/tagline_white.png";
// import DIGITAL_RECORDS from "src/assets/images/loginCarousal/DIGITAL_RECORDS.png";
// import REAL_TIME_DATA from "src/assets/images/loginCarousal/REAL_TIME_DATA.png";
// import COLLABARATE from "src/assets/images/loginCarousal/COLLABARATE.png";
// import AuthLogin from "./AuthLogin";
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";

// const imageData = [
//   {
//     src: DIGITAL_RECORDS,
//     alt: "Digital Records",
//     link: "https://firedesk.in/",
//   },
//   {
//     src: REAL_TIME_DATA,
//     alt: "Real-Time Data",
//     link: "https://firedesk.in/",
//   },
//   {
//     src: COLLABARATE,
//     alt: "Collaborate",
//     link: "https://firedesk.in/",
//   },
// ];

// const Login = () => {
//   const isMdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
//   const isSmDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
//   const isTablet = useMediaQuery((theme) =>
//     theme.breakpoints.between("sm", "md")
//   );

//   return (
//     <PageContainer title="Login" description="this is Login page">
//       <Box>
//         <Grid container justifyContent="center" sx={{ height: "100vh" }}>
//           {/* Left Side Carousel */}
//           {(isMdUp || isTablet) && (
//             <Grid
//               item
//               sm={6}
//               display="flex"
//               justifyContent="center"
//               alignItems="center"
//             >
//               <Carousel
//                 autoPlay
//                 infiniteLoop
//                 showThumbs={false}
//                 showStatus={false}
//                 interval={3000}
//                 transitionTime={500}
//                 swipeable
//                 renderArrowNext={() => null}
//                 renderArrowPrev={() => null}
//               >
//                 {imageData.map((image, index) => (
//                   <Box
//                     key={index}
//                     display="flex"
//                     justifyContent="center"
//                     alignItems="center"
//                     position="relative"
//                   >
//                     <CardMedia
//                       component="img"
//                       image={image.src}
//                       alt={image.alt}
//                       style={{ objectFit: "contain", opacity: 0.9 }}
//                     />
//                     <a
//                       href={image.link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <Typography
//                         variant="h6"
//                         sx={{
//                           position: "absolute",
//                           bottom: 10,
//                           right: 10,
//                           color: "white",
//                           borderRadius: "8px",
//                         }}
//                       >
//                         firedesk.in
//                       </Typography>
//                     </a>
//                     <a
//                       href={`${image.link}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       style={{ textDecoration: "none", color: "blue" }}
//                     >
//                       <Box
//                         position="absolute"
//                         bottom={70}
//                         left="45%"
//                         transform="translateX(-50%)"
//                         bgcolor="#e2e2e3"
//                         borderRadius="35px"
//                         p={1}
//                       >
//                         <Typography variant="body2" color="main">
//                           Know More
//                         </Typography>
//                       </Box>
//                     </a>
//                   </Box>
//                 ))}
//               </Carousel>
//             </Grid>
//           )}

//           {/* Right Side Login Form */}
//           <Grid
//             item
//             xs={12}
//             md={6}
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             sx={{
//               backgroundColor: "#4c6fc0",
//               height: isSmDown ? "100vh" : "auto",
//               padding: isSmDown ? 2 : isTablet ? 3 : 0,
//             }}
//           >
//             <Box
//               sx={{
//                 p: isSmDown ? 2 : isTablet ? 3 : 4,
//                 zIndex: 1,
//                 width: "100%",
//                 maxWidth: "500px",
//               }}
//             >
//               {/* Logo */}
//               <Box
//                 display="flex"
//                 alignItems="center"
//                 justifyContent="center"
//                 mb={2}
//               >
//                 <img
//                   src={FiredeskLogo}
//                   alt="Logo"
//                   style={{
//                     height: isSmDown ? "50px" : isTablet ? "60px" : "80px",
//                     overflow: "hidden",
//                   }}
//                 />
//               </Box>

//               {/* Tagline */}
//               <Box
//                 display="flex"
//                 alignItems="center"
//                 justifyContent="center"
//                 my={2}
//               >
//                 <img
//                   src={tagline}
//                   alt="Tagline"
//                   style={{
//                     width: isSmDown ? "60vw" : isTablet ? "40vw" : "20vw",
//                     overflow: "hidden",
//                   }}
//                 />
//               </Box>

//               {/* Login Form */}
//               <AuthLogin />
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>
//     </PageContainer>
//   );
// };

// export default Login;
