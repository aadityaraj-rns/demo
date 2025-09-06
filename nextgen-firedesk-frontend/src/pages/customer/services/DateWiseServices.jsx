// import React from "react";
// import PageContainer from "../../../components/container/PageContainer";
// import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
// import DateWiseService from "../../../components/customer/service/DateWiseService";
// import { useLocation } from "react-router-dom";

// const BCrumb = [
//   {
//     to: "/customer",
//     title: "Home",
//   },
//   {
//     to: "/customer/service-calendar",
//     title: "Calendar",
//   },
//   {
//     title: "Services",
//   },
// ];

// const DateWiseServices = () => {
//   const location = useLocation();
//   const dateFromLocation = location.state?.event?.start;
//   const assetIds = location.state?.event?.assetIds;
 
//   const [value, setValue] = React.useState("1");

//   return (
//     <PageContainer
//       title="Services"
//       description="this is Service Details Table page"
//     >
//       <Breadcrumb title="Services" items={BCrumb} />
//       <DateWiseService selectedDate={dateFromLocation} selectedAssetIds={assetIds}/>
//     </PageContainer>
//   );
// };

// export default DateWiseServices;
