import { useEffect, useState } from "react";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { IconButton, Tooltip, Menu, MenuItem } from "@mui/material";
import { getAllTickets } from "../../../api/organization/internal";
import Spinner from "../../admin/spinner/Spinner";
import AddTickets from "../../../components/customer/tickets/AddTickets";
import Toaster from "../../../components/toaster/Toaster";
import EditTickets from "../../../components/customer/tickets/EditTickets";
import { format } from "date-fns";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import DataTable from "../../../components/common/DataTable";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const BCrumb = [
  {
    to: "/customer",
    title: "Home",
  },
  {
    title: "Tickets",
  },
];

const Tickets = () => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [editSuccess, setEditSuccess] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  const setEditToaster = () => {
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 1500);
  };

  const fetchTickets = async () => {
    const response = await getAllTickets();
    if (response?.status === 200) {
      setTickets(response.data.tickets);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd-MM-yyyy");
  };

  if (loading) {
    return <Spinner />;
  }

  const columns = [
    {
      id: "ticketId",
      label: "Id",
      sortable: true,
    },
    {
      id: "taskDescription",
      label: "Description",
      sortable: true,
      render: (row) => {
        const description = row.taskDescription;
        const shortenedDescription =
          description.length > 10
            ? description.substring(0, 10) + "..."
            : description;

        return (
          <Tooltip title={description.length > 10 ? description : ""} arrow>
            <span>{shortenedDescription}</span>
          </Tooltip>
        );
      },
    },
    {
      id: "plantName",
      label: "Plant",
      sortable: true,
      render: (row) => row.plantId.plantName,
    },
    {
      id: "building",
      label: "Building",
      sortable: false,
      render: (row) =>
        [...new Set(row.assetsId.map((asset) => asset.building))].join(", "),
    },
    {
      id: "technicianName",
      label: "Technician",
      sortable: true,
      render: (row) =>
        [
          ...new Set(
            row.assetsId.flatMap((asset) =>
              asset.technicianUserId.map((t) => t.name)
            )
          ),
        ].join(", "),
    },
    {
      id: "targetDate",
      label: "Target Date",
      sortable: false,
      render: (row) => formatDate(row.targetDate),
    },
    {
      id: "createdAt",
      label: "Created At",
      sortable: true,
      render: (row) => (row.createdAt ? formatDate(row.createdAt) : ""),
    },
    {
      id: "status",
      label: "Status",
      sortable: false,
    },
    {
      id: "action",
      label: "",
      render: (row) => (
        <Box display="flex">
          <Tooltip title="View / Edit">
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
              <Link
                to={row._id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                View
              </Link>
            </MenuItem>
            <MenuItem>
              <EditTickets
                onTicketEdit={fetchTickets}
                setEditToaster={setEditToaster}
                ticket={row}
              />
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  return (
    <PageContainer title="Tickets" description="this is Tickets Table page">
      <Breadcrumb title="Tickets" items={BCrumb} />
      <DataTable
        data={tickets}
        columns={columns}
        isFilter={true}
        model={<AddTickets name="Create" onTicketAdded={fetchTickets} />}
      />
      {editSuccess && (
        <Toaster
          title="Ticket"
          message="Updated successfully"
          color="success"
        />
      )}
    </PageContainer>
  );
};

export default Tickets;
