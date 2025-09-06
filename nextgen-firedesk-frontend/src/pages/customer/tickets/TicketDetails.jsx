import { useEffect, useState } from "react";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../components/container/PageContainer";
import ParentCard from "../../../components/shared/ParentCard";
import {
  Button,
  Grid,
  Table,
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableBody,
} from "@mui/material";
import { formatDate } from "../../../utils/helpers/formatDate";
import { ticketDetails } from "../../../api/organization/internal";
import { Link, useParams } from "react-router-dom";
import Spinner from "../../admin/spinner/Spinner";
import ViewTextInput from "../../../components/forms/theme-elements/ViewTextInput";

const TicketDetails = () => {
  const { ticketId } = useParams();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);

  const fetchTicketDetails = async () => {
    const response = await ticketDetails(ticketId);

    if (response.status === 200) {
      setTicket(response.data.ticket);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const BCrumb = [
    {
      to: "/customer",
      title: "Home",
    },
    {
      to: "/customer/tickets",
      title: "Tickets",
    },
    {
      title: "Ticket Details",
    },
  ];
  return (
    <PageContainer
      title="Ticket Details"
      description="this is Assest Details page"
    >
      {/* breadcrumb */}
      <Breadcrumb title="Ticket" items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {ticket ? (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={6}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} className="border-bottom">
                        <Typography variant="h6">
                          General Information
                        </Typography>
                      </Grid>
                      {[
                        {
                          label: "Plant",
                          value: ticket.plantId.plantName,
                        },
                        {
                          label: "Target Date",
                          value: formatDate(ticket.targetDate),
                        },
                        {
                          label: "Ticket Description",
                          value: ticket.taskDescription,
                        },
                      ].map((field, index) => (
                        <Grid item xs={12} key={index}>
                          <ViewTextInput
                            label={field.label}
                            value={field.value}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>

                  <Grid item xs={12} lg={6}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} className="border-bottom">
                        <Typography variant="h6">Task</Typography>
                      </Grid>
                      {ticket.taskNames.map((name, index) => (
                        <Grid item xs={12} key={index}>
                          <ViewTextInput label={`${index + 1}`} value={name} />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>

                <Paper variant="outlined" sx={{ padding: 3, marginTop: 2 }}>
                  <Typography variant="h6">Technician Responses</Typography>
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
                            <Typography variant="h6">Asset ID</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="h6">Asset Name</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="h6">
                              Technician Name
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="h6">Status</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="h6">Geo Check</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="h6">Action</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {ticket.assetsId.map((response, index) => (
                          <TableRow key={response._id}>
                            <TableCell align="center">
                              <Typography variant="body1">
                                {index + 1}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body1">
                                {response.assetId}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body1">
                                {response.productId?.productName}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body1">
                                {response.technicianUserId
                                  ?.map((t) => t.name)
                                  .join(", ")}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body1">
                                {response.ticketResponse?.status}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body1">
                                {response.ticketResponse?.geoCheck}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="h6" fontWeight="400">
                                {response.ticketResponse?._id ? (
                                  <Link
                                    to={`response/${response.ticketResponse._id}`}
                                  >
                                    <Button>VIEW</Button>
                                  </Link>
                                ) : (
                                  <span>Not Started</span>
                                )}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </>
            ) : (
              <p>No data found.</p>
            )}
          </>
        )}
      </ParentCard>
    </PageContainer>
  );
};

export default TicketDetails;
