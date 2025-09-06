import { useEffect, useState } from "react";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import AddClientModal from "../../../components/admin/client/clientdata/AddClientModal";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Chip, Box, Tooltip, IconButton, Menu, MenuItem } from "@mui/material";
import { getAllClients } from "../../../api/admin/internal";
import EditClientModal from "../../../components/admin/client/clientdata/EditClientModal";
import Spinner from "../spinner/Spinner";
import DataTable from "../../../components/common/DataTable";
import { formatDate } from "../../../utils/helpers/formatDate";
import ClientViewModal from "../../../components/admin/client/clientdata/ClientViewModal";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Clients",
  },
];

const ClientData = () => {
  const [clients, setClients] = useState([]);
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

  const fetchClients = async () => {
    const response = await getAllClients();
    if (response.status === 200) {
      setClients(response.data.clients);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchClients();
  }, []);

  const columns = [
    { id: "loginID", label: "Login ID", sortable: true },
    { id: "industryName", label: "Industry", sortable: true },
    {
      id: "name",
      label: "Client Name",
      sortable: true,
      render: (row) => (
        <ClientViewModal
          client={row}
          triggerComponent={
            <span style={{ cursor: "pointer", textDecoration: "none" }}>
              {row.name}
            </span>
          }
        />
      ),
    },
    {
      id: "categoryNames",
      label: "Category",
      sortable: false,
      render: (client) =>
        client.categoryNames && client.categoryNames.length > 0
          ? client.categoryNames.join(", ")
          : "-",
    },
    {
      id: "clientType",
      label: "Client Type",
      sortable: true,
      render: (client) =>
        client.clientType && client.clientType === "organization"
          ? "customer"
          : client.clientType,
    },
    { id: "cityName", label: "City", sortable: false },
    { id: "stateName", label: "State", sortable: false },
    { id: "contactNo", label: "Contact No", sortable: false },
    { id: "email", label: "Email", sortable: false },
    { id: "gst", label: "GST", sortable: false },
    {
      id: "createdByPartnerUserId",
      label: "Partner",
      render: (row) => row?.createdByPartnerId?.loginID,
      sortable: true,
    },
    {
      id: "createdAt",
      label: "Created At",
      sortable: true,
      render: (row) => formatDate(row.createdAt),
    },
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <Chip
          label={row.status}
          sx={{
            bgcolor:
              row.status === "Active"
                ? "success.light"
                : row.status === "Pending"
                ? "warning.light"
                : row.status === "Deactive"
                ? "error.light"
                : "secondary.light",
            color:
              row.status === "Active"
                ? "success.main"
                : row.status === "Pending"
                ? "warning.main"
                : row.status === "Deactive"
                ? "error.main"
                : "secondary.main",
          }}
        />
      ),
    },

    {
      id: "action",
      label: "",
      render: (row) => (
        <Box display="flex">
          <Tooltip title="More options">
            <IconButton onClick={(e) => handleMenuClick(e, row)}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && currentRow?._id === row._id}
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
              <ClientViewModal client={row} />
            </MenuItem>
            <MenuItem>
              <EditClientModal client={row} onClientEdit={fetchClients} />
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  if (loading) {
    return <Spinner />;
  }

  return (
    <PageContainer title="Clients" description="this is Client Table page">
      <Breadcrumb title="Clients" items={BCrumb} />

      <DataTable
        data={clients}
        columns={columns}
        // searchableFields={searchableFields}
        isFilter={true}
        model={<AddClientModal onClientAdd={fetchClients} />}
      />
    </PageContainer>
  );
};

export default ClientData;
