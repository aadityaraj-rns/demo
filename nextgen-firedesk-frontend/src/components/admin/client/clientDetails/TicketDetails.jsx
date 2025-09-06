import React, { useEffect, useState } from "react";
import Spinner from "../../../../pages/admin/spinner/Spinner";
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
import { getTicketsByOrgUserId } from "../../../../api/admin/internal";
import { format } from "date-fns";

const TicketDetails = ({ orgUserId }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTicketsByOrgUserId(orgUserId);
        if (response.status === 200) {
          setTickets(response.data.tickets);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orgUserId]);
  if (loading) {
    return <Spinner />;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd");
  };

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
                <Typography variant="h6">Plant Name</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Asset Id's</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Task Description</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Target Date</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Completed Status</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets?.map((ticket, index) => (
              <TableRow key={ticket._id}>
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
                    {ticket.plantId?.plantName || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    {ticket.assetsId && ticket.assetsId.length > 0 ? (
                      ticket.assetsId.map((assetId, index) => (
                        <div key={index}>{assetId}</div>
                      ))
                    ) : (
                      <div>N/A</div>
                    )}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    {ticket.taskDescription || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    {formatDate(ticket.targetDate) || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    {ticket.completedStatus || "N/A"}
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

export default TicketDetails;
