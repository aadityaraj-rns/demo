import React, { useEffect, useState } from "react";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import ParentCard from "../../../components/shared/ParentCard";
// import ServiceAddModal from "../../../components/admin/service/ServiceAddModal";
import { Link, useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TableBody,
  Chip,
  Fab,
  Box,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  getAllServiceNames,
  // getServiceGroups,
} from "../../../api/admin/internal";
// import CreateGroup from "../../../components/admin/service/CreateGroupModal";
import Spinner from "../spinner/Spinner";
import { IconEdit, IconEye } from "@tabler/icons";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Service",
  },
];
const Service = () => {
  const navigate = useNavigate();
  const [serviceNames, setServiceNames] = useState([]);
  // const [serviceGroups, setServiceGroups] = useState([]);
  // const [addSuccess, setAddSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const serviceForm = (id) => {
    navigate(`/service/serviceForm/${id}`);
  };

  const fetchServiceNames = async () => {
    const response = await getAllServiceNames();
    if (response?.status === 200) {
      setServiceNames(response.data.serviceNames);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchServiceNames();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <PageContainer title="Service" description="this is Service Table page">
      <Breadcrumb title="Service" items={BCrumb} />
      <ParentCard>
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
                    <Typography variant="h6">Service Name</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6"></Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceNames.map((service, index) => (
                  <TableRow key={service._id}>
                    <TableCell align="center">
                      <Typography variant="h6" fontWeight="600">
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => serviceForm(service._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                        fontWeight="400"
                      >
                        {service.serviceName}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" style={{ cursor: "pointer" }}>
                      {/* <Typography
                        color="textSecondary"
                        variant="h6"
                        fontWeight="400"
                      >
                        <Link to={`/service/form-download/${service._id}`}>
                          {" "}
                          <Fab
                            size="small"
                            color="primary"
                            sx={{ marginRight: 2 }}
                          >
                            <IconEye size="16" />{" "}
                          </Fab>
                        </Link>
                        <Link to={`/service/serviceForm/${service._id}`}>
                          <Fab size="small" color="secondary">
                            <IconEdit size="16" />
                          </Fab>
                        </Link>
                      </Typography> */}
                      <Box display="flex">
                        <Tooltip title="More options">
                          <IconButton
                            onClick={(e) => handleMenuClick(e, service)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                        <Menu
                          anchorEl={anchorEl}
                          open={
                            Boolean(anchorEl) && currentRow?._id === service._id
                          }
                          onClose={handleMenuClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                        >
                          <MenuItem>
                            <Link to={`/service/form-download/${service._id}`}>
                              {" "}
                              <Fab
                                size="small"
                                color="primary"
                                sx={{ marginRight: 2 }}
                              >
                                <IconEye size="16" />{" "}
                              </Fab>
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link to={`/service/serviceForm/${service._id}`}>
                              <Fab size="small" color="secondary">
                                <IconEdit size="16" />
                              </Fab>
                            </Link>
                          </MenuItem>
                        </Menu>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </ParentCard>
    </PageContainer>
  );
};

export default Service;
