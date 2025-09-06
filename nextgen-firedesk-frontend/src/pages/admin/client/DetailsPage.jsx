// import React from "react";
// import { useParams } from "react-router-dom";
// import PageContainer from "../../../components/container/PageContainer";
// import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
// import ParentCard from "../../../components/shared/ParentCard";
// import { Box, Divider, Grid, Tab } from "@mui/material";
// import ChildCard from "../../../components/shared/ChildCard";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import { IconHeart, IconPhone, IconUser } from "@tabler/icons";
// import TechnicianDetails from "../../../components/admin/client/clientDetails/TechnicianDetails";
// import AssetDetails from "../../../components/admin/client/clientDetails/AssetDetails";
// import ServiceDetails from "../../../components/admin/client/clientDetails/ServiceDetails";
// import TicketDetails from "../../../components/admin/client/clientDetails/TicketDetails";
// import PlantDetails from "../../../components/admin/client/clientDetails/PlantDetails";
// // import AuditDetails from "../../../components/admin/client/clientDetails/AuditDetails";
// import ProfileDetails from "../../../components/admin/client/clientDetails/ProfileDetails";

// const BCrumb = [
//   {
//     to: "/",
//     title: "Home",
//   },
//   {
//     title: "Client Details",
//   },
// ];

// const COMMON_TAB = [
//   {
//     value: "1",
//     icon: <IconPhone width={20} height={20} />,
//     label: "Profile",
//     disabled: false,
//     content: <ProfileDetails />,
//   },
//   {
//     value: "2",
//     icon: <IconPhone width={20} height={20} />,
//     label: "Technician",
//     disabled: false,
//     content: <TechnicianDetails />,
//   },
//   {
//     value: "3",
//     icon: <IconHeart width={20} height={20} />,
//     label: "Assets",
//     disabled: false,
//     content: <AssetDetails />,
//   },
//   {
//     value: "4",
//     icon: <IconUser width={20} height={20} />,
//     label: "Service",
//     disabled: true,
//     content: <ServiceDetails />,
//   },
//   {
//     value: "5",
//     icon: <IconUser width={20} height={20} />,
//     label: "Tickets",
//     disabled: true,
//     content: <TicketDetails />,
//   },
//   {
//     value: "6",
//     icon: <IconUser width={20} height={20} />,
//     label: "Plants",
//     disabled: true,
//     content: <PlantDetails />,
//   },
// ];

// const DetailsPage = () => {
//   const [value, setValue] = React.useState("1");

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const { userId } = useParams();

//   COMMON_TAB[0].content = <ProfileDetails orgUserId={userId} />;
//   COMMON_TAB[1].content = <TechnicianDetails orgUserId={userId} />;
//   COMMON_TAB[2].content = <AssetDetails orgUserId={userId} />;
//   COMMON_TAB[3].content = <ServiceDetails orgUserId={userId} />;
//   COMMON_TAB[4].content = <TicketDetails orgUserId={userId} />;
//   COMMON_TAB[5].content = <PlantDetails orgUserId={userId} />;
//   // COMMON_TAB[5].content = <AuditDetails orgUserId={userId} />;

//   return (
//     <PageContainer
//       title="Client Details"
//       description="this is Client Details page"
//     >
//       {/* breadcrumb */}
//       <Breadcrumb title="Client Details" items={BCrumb} />
//       {/* end breadcrumb */}

//       <ParentCard title="Client Details">
//         <Grid container spacing={3}>
//           {/* ---------------------------------------------------------------------------------- */}
//           {/* Text */}
//           {/* ---------------------------------------------------------------------------------- */}
//           <Grid item xs={12} display="flex" alignItems="stretch">
//             <ChildCard title="Customer">
//               <TabContext value={value}>
//                 <Box>
//                   <TabList
//                     variant="scrollable"
//                     scrollButtons="auto"
//                     onChange={handleChange}
//                     aria-label="lab API tabs example"
//                   >
//                     {COMMON_TAB.map((tab, index) => (
//                       <Tab
//                         key={tab.value}
//                         label={tab.label}
//                         value={String(index + 1)}
//                       />
//                     ))}
//                   </TabList>
//                 </Box>
//                 <Divider />
//                 <Box bgcolor="grey.A200" mt={2}>
//                   {COMMON_TAB.map((panel, index) => (
//                     <TabPanel key={panel.value} value={String(index + 1)}>
//                       {panel.content}
//                     </TabPanel>
//                   ))}
//                 </Box>
//               </TabContext>
//             </ChildCard>
//           </Grid>
//         </Grid>
//       </ParentCard>
//     </PageContainer>
//   );
// };

// export default DetailsPage;
