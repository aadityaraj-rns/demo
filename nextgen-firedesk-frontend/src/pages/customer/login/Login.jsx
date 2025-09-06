// import { Grid, Box, CardMedia, useMediaQuery, Typography } from "@mui/material";

// import PageContainer from "src/components/container/PageContainer";
// import FiredeskLogo from "src/assets/images/logos/firedesk_orange_logo.png";
// import DIGITAL_RECORDS from "src/assets/images/loginCarousal/DIGITAL_RECORDS.png";
// import REAL_TIME_DATA from "src/assets/images/loginCarousal/REAL_TIME_DATA.png";
// import COLLABARATE from "src/assets/images/loginCarousal/COLLABARATE.png";
// import tagline from "src/assets/images/logos/tagline_white.png";
// import AuthLogin from "./AuthLogin";
// import { useSelector } from "react-redux";
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
//     alt: "REAL_TIME_DATA",
//     link: "https://firedesk.in/",
//   },
//   {
//     src: COLLABARATE,
//     alt: "COLLABARATE",
//     link: "https://firedesk.in/",
//   },
// ];
// const Login = () => {
//   const customizer = useSelector((state) => state.customizer);
//   const isMdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
//   const isSmDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
//   const isTablet = useMediaQuery((theme) =>
//     theme.breakpoints.between("sm", "md")
//   );

//   return (
//     <PageContainer title="Login" description="this is Login page">
//       <Grid
//         container
//         spacing={0}
//         justifyContent="center"
//         sx={{ height: "100vh" }}
//       >
//         {(isMdUp || isTablet) && (
//           <Grid
//             item
//             sm={6}
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//           >
//             <Carousel
//               autoPlay={true}
//               infiniteLoop={true}
//               showThumbs={false}
//               showStatus={false}
//               interval={3000}
//               transitionTime={500}
//               swipeable={true}
//               dynamicHeight={false}
//               renderArrowNext={() => null}
//               renderArrowPrev={() => null}
//             >
//               {imageData.map((image, index) => (
//                 <Box
//                   key={index}
//                   position="relative"
//                   display="flex"
//                   justifyContent="center"
//                   alignItems="center"
//                 >
//                   <CardMedia
//                     component="img"
//                     style={{ objectFit: "contain", opacity: 0.9 }}
//                     image={image.src}
//                     alt={image.alt}
//                   />
//                   <a
//                     href={image.link}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{ textDecoration: "none", color: "inherit" }}
//                   >
//                     <Box
//                       position="absolute"
//                       bottom={10}
//                       right={10}
//                       color="white"
//                       borderRadius="8px"
//                     >
//                       <Typography variant="h6">firedesk.in</Typography>
//                     </Box>
//                   </a>
//                   <a
//                     href={`${image.link}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{ textDecoration: "none", color: "blue" }}
//                   >
//                     <Box
//                       position="absolute"
//                       bottom={70}
//                       left="45%"
//                       transform="translateX(-50%)"
//                       bgcolor="#e2e2e3"
//                       borderRadius="35px"
//                       p={1}
//                     >
//                       <Typography variant="body2" color="main">
//                         Know More
//                       </Typography>
//                     </Box>
//                   </a>
//                 </Box>
//               ))}
//             </Carousel>
//           </Grid>
//         )}
//         <Grid
//           item
//           xs={12}
//           md={6}
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           sx={{
//             backgroundColor: "#4c6fc0",
//             marginTop: isSmDown ? "0" : "-20px",
//             height: isSmDown ? "100vh" : "auto",
//             padding: isSmDown ? 2 : isTablet ? 3 : 0,
//           }}
//         >
//           <Box
//             sx={{
//               p: isSmDown ? 2 : isTablet ? 3 : 4,
//               zIndex: 1,
//               width: "100%",
//               maxWidth: "500px",
//             }}
//           >
//             <Box
//               display="flex"
//               alignItems="center"
//               justifyContent="center"
//               mb={isSmDown ? 2 : isTablet ? 3 : 4}
//             >
//               <img
//                 src={FiredeskLogo}
//                 alt="Logo"
//                 style={{
//                   height: isSmDown
//                     ? "50px"
//                     : isTablet
//                     ? "60px"
//                     : customizer.TopbarHeight,
//                   width: isSmDown ? "30vw" : isTablet ? "20vw" : "12vw",
//                   overflow: "hidden",
//                 }}
//               />
//             </Box>
//             <Box
//               display="flex"
//               alignItems="center"
//               justifyContent="center"
//               my={2}
//             >
//               <img
//                 src={tagline}
//                 alt="Tagline"
//                 style={{
//                   width: isSmDown ? "60vw" : isTablet ? "40vw" : "20vw",
//                   overflow: "hidden",
//                 }}
//               />
//             </Box>
//             <AuthLogin />
//           </Box>
//         </Grid>
//       </Grid>
//     </PageContainer>
//   );
// };

// export default Login;
