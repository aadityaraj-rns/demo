// import { useEffect, useState } from "react";
// import { getAllIncompleteService } from "../../../api/organization/internal";
// import { format } from "date-fns";
// import Spinner from "../../../pages/admin/spinner/Spinner";
// import AssetDataTable from "../../common/AssetDataTable";
// import { Link } from "react-router-dom";
// import { Button } from "@mui/material";
// import * as XLSX from "xlsx";
// import { SaveAltOutlined } from "@mui/icons-material";

// const IncompleteService = () => {
//   const [incompleteServiceDatas, setIncompleteServiceDatas] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filteredDatas, setFilteredDatas] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await getAllIncompleteService();
//       if (response.status === 200) {
//         setIncompleteServiceDatas(response.data.incompleteServices);
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
//       sortable: true,
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
//       filteredDatas.length > 0 ? filteredDatas : incompleteServiceDatas;

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

//     XLSX.writeFile(workbook, "IncompleteService.xlsx");
//   };

//   return (
//     <AssetDataTable
//       data={incompleteServiceDatas}
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

// export default IncompleteService;
