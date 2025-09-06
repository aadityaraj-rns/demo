// import { useEffect, useState } from "react";
// import { getAllUpcomingService } from "../../../api/organization/internal";
// import Spinner from "../../../pages/admin/spinner/Spinner";
// import { format } from "date-fns";
// import AssetDataTable from "../../common/AssetDataTable";
// import { Link } from "react-router-dom";
// import { Button } from "@mui/material";
// import * as XLSX from "xlsx";
// import { SaveAltOutlined } from "@mui/icons-material";

// const UpcomingService = () => {
//   const [upcomingServiceDatas, setUpcomingServiceDatas] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filteredDatas, setFilteredDatas] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await getAllUpcomingService();
//       if (response.status === 200) {
//         setUpcomingServiceDatas(response.data.pendingServices);
//       }
//       setLoading(false);
//     };
//     fetchData();
//   }, []);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return format(date, "dd-MM-yyyy");
//   };

//   if (loading) {
//     return <Spinner />;
//   }
//   const columns = [
//     {
//       id: "assetId",
//       label: "asset Id",
//       sortable: true,
//       render: (row) => (
//         <>
//           <Link
//             to={`/customer/assets/${row._id}/details`}
//             sx={{ color: "blue" }}
//           >
//             <strong>{row.assetId}</strong>
//           </Link>
//         </>
//       ),
//       getFilterValue: (row) => row.assetId,
//     },
//     { id: "plantName", label: "plant", sortable: true },
//     { id: "building", label: "building", sortable: true },
//     { id: "location", label: "location", sortable: true },
//     { id: "assetName", label: "asset", sortable: true },
//     {
//       id: "createdAt",
//       label: "Service Due",
//       sortable: true,
//       render: (row) => formatDate(row.serviceDate),
//     },

//     {
//       id: "serviceType",
//       label: "Service Type",
//       sortable: true,
//     },
//     {
//       id: "technicianName",
//       label: "Technician",
//       sortable: true,
//     },
//   ];

//   const handleFilteredDataChange = (filteredData) => {
//     setFilteredDatas(filteredData);
//   };

//   const handleDownloadExcel = () => {
//     const downloadData =
//       filteredDatas.length > 0 ? filteredDatas : upcomingServiceDatas;

//     const worksheetData = [
//       [
//         "Asset ID",
//         "Plant",
//         "Building",
//         "Location",
//         "Asset",
//         "Service Due",
//         "Service Type",
//         "Technician",
//       ],
//       ...downloadData.map((asset) => [
//         asset.assetId,
//         asset.plantName,
//         asset.building,
//         asset.location,
//         asset.assetName,
//         formatDate(asset.serviceDate),
//         asset.serviceType,
//         asset.technicianName,
//       ]),
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Assets");

//     XLSX.writeFile(workbook, "Upcoming.xlsx");
//   };

//   return (
//     <AssetDataTable
//       data={upcomingServiceDatas}
//       columns={columns}
//       isFilter={true}
//       onFilterChange={handleFilteredDataChange}
//       modal={
//         <Button
//           variant="outlined"
//           size="small"
//           startIcon={<SaveAltOutlined />}
//           onClick={handleDownloadExcel}
//         >
//           Download
//         </Button>
//       }
//     />
//   );
// };

// export default UpcomingService;
