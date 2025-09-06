import React, { useEffect, useState } from "react";
import { getTechnicianByOrgUserId } from "../../../../api/admin/internal";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Spinner from "../../../../pages/admin/spinner/Spinner";

const TechnicianDetails = ({ orgUserId }) => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTechnicianByOrgUserId(orgUserId);
        if (response.status === 200) {
          setTechnicians(response.data.technicians);
        }
      } catch (error) {
        console.error("Error fetching technicians:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orgUserId]);
  if (loading) {
    return <Spinner />;
  }

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: "nowrap",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography variant="h6">Sl No</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Name</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Phone</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Email</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {technicians?.map((technician, index) => (
              <TableRow key={technician._id}>
                <TableCell align="center">
                  <Typography variant="h6" fontWeight="600">
                    {index + 1}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    {technician.userId?.name || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    {technician.userId?.phone || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    {technician.userId?.email || "N/A"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TechnicianDetails;
