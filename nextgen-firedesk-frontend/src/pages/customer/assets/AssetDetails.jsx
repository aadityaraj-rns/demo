// import React from "react";
// import PageContainer from "../../../components/container/PageContainer";
// import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
// import AssetDetailsPage from "../../../components/customer/assets/AssetDetailsPage";
// import { Tab, Tabs } from "@mui/material";
// import { TabContext, TabPanel } from "@mui/lab";
// import ServiceDetails from "./ServiceDetails";

// const BCrumb = [
//   {
//     to: "/customer",
//     title: "Home",
//   },
//   {
//     to: "/customer/assets",
//     title: "Asset",
//   },
//   {
//     title: "View",
//   },
// ];

// function AssetDetails() {
//   const [value, setValue] = React.useState("1");

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };
//   const COMMON_TAB = [
//     {
//       value: "1",
//       label: "Asset Details",
//       disabled: false,
//       content: <AssetDetailsPage />,
//     },
//     {
//       value: "2",
//       label: "Service Details",
//       disabled: false,
//       content: <ServiceDetails />,
//     },
//   ];
//   return (
//     <PageContainer
//       title="Asset Details"
//       description="this is Asset Details page"
//     >
//       <Breadcrumb title="Asset" items={BCrumb} />
//       <TabContext value={value}>
//         <Tabs
//           variant="scrollable"
//           scrollButtons="auto"
//           value={value}
//           onChange={handleChange}
//           aria-label="icon tabs example"
//         >
//           {COMMON_TAB.map((tab, index) => (
//             <Tab
//               key={index}
//               icon={tab.icon}
//               label={tab.label}
//               iconPosition="end"
//               value={tab.value}
//               disabled={tab.disabled}
//             />
//           ))}
//         </Tabs>
//         {COMMON_TAB.map((panel, index) => (
//           <TabPanel key={index} value={panel.value}>
//             {panel.content}
//           </TabPanel>
//         ))}
//       </TabContext>
//     </PageContainer>
//   );
// }

// export default AssetDetails;
