// import React, { useEffect, useState } from "react";
// import { getServicesByDate } from "../../../api/organization/internal";
// import ParentCard from "../../shared/ParentCard";
// import {
//   Chip,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import Spinner from "../../../pages/admin/spinner/Spinner";
// import { format } from "date-fns";

// const DateWiseService = ({ selectedDate, selectedAssetIds }) => {
//   const [serviceData, setServiceData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await getServicesByDate(selectedDate, selectedAssetIds);
//       if (response.status === 200) {
//         setServiceData(response.data.services);
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

//   return (
//     <ParentCard>
//       <Paper variant="outlined">
//         <TableContainer>
//       <Typography variant="h6">Services on {formatDate(selectedDate)}</Typography>
//           <Table
//             aria-label="simple table"
//             sx={{
//               whiteSpace: "nowrap",
//             }}
//           >
//             <TableHead>
//               <TableRow>
//                 <TableCell align="center">
//                   <Typography variant="h6">Sl No</Typography>
//                 </TableCell>
//                 <TableCell align="center">
//                   <Typography variant="h6">Plant Name</Typography>
//                 </TableCell>
//                 <TableCell align="center">
//                   <Typography variant="h6">Plant Address</Typography>
//                 </TableCell>
//                 <TableCell align="center">
//                   <Typography variant="h6">Asset Id</Typography>
//                 </TableCell>
//                 <TableCell align="center">
//                   <Typography variant="h6">Asset Name</Typography>
//                 </TableCell>
//                 <TableCell align="center">
//                   <Typography variant="h6">Technician Name</Typography>
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {serviceData.map((service, index) => (
//                 <TableRow key={service._id}>
//                   <TableCell align="center">
//                     <Typography variant="h6" fontWeight="600">
//                       {index + 1}
//                     </Typography>
//                   </TableCell>
//                   <TableCell align="center">
//                     <Typography
//                       color="textSecondary"
//                       variant="h6"
//                       fontWeight="400"
//                     >
//                       {service.plantName}
//                     </Typography>
//                   </TableCell>
//                   <TableCell align="center">
//                     <Typography
//                       color="textSecondary"
//                       variant="h6"
//                       fontWeight="400"
//                     >
//                       {service.plantAddress}
//                     </Typography>
//                   </TableCell>
//                   <TableCell align="center">
//                     <Typography
//                       color="textSecondary"
//                       variant="h6"
//                       fontWeight="400"
//                     >
//                       {service.assetId}
//                     </Typography>
//                   </TableCell>
//                   <TableCell align="center">
//                     <Typography
//                       color="textSecondary"
//                       variant="h6"
//                       fontWeight="400"
//                     >
//                       {service.assetName}
//                     </Typography>
//                   </TableCell>
//                   <TableCell align="center">
//                     <Typography
//                       color="textSecondary"
//                       variant="h6"
//                       fontWeight="400"
//                     >
//                       {service.technicianName}
//                       <span className="text-danger">
//                         ({service.technicianContactNo})
//                       </span>
//                     </Typography>
//                   </TableCell>

//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     </ParentCard>
//   );
// };

// export default DateWiseService;
