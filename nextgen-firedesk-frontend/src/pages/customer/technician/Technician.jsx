import React, { useEffect, useState } from "react";
import { Chip, Box, Tooltip, IconButton, Menu, MenuItem } from "@mui/material";

import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../components/container/PageContainer";
import TechnicianAdd from "../../../components/customer/technician/TechnicianAdd";
import { getAllTechnicians } from "../../../api/organization/internal";
import TechnicianEdit from "../../../components/customer/technician/TechnicianEdit";
import TechnicianDetails from "../../../components/customer/technician/TechnicianDetails";
import Spinner from "../../admin/spinner/Spinner";
import DataTable from "../../../components/common/DataTable";
import { formatDate } from "../../../utils/helpers/formatDate";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const BCrumb = [
  {
    to: "/customer",
    title: "Home",
  },
  {
    title: "Technician",
  },
];

const Technician = () => {
  const [allTechnicians, setAllTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  const [expandedRows, setExpandedRows] = React.useState({});

  const handleToggleText = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchTechnicians = async () => {
    const response = await getAllTechnicians();
    if (response) {
      if (response?.status === 200) {
        setAllTechnicians(response.data.technicians);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const columns = [
    { id: "technicianId", label: "Id", sortable: true },
    {
      id: "name",
      label: "Name",
      sortable: true,
      render: (row) => (
        <TechnicianDetails
          technician={row}
          triggerComponent={
            <span
              style={{
                cursor: "pointer",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {row.userId?.name}
            </span>
          }
        />
      ),
    },
    {
      id: "plantName",
      label: "Assigned Plants",
      sortable: true,
      render: (row) => {
        const showFullText = expandedRows[row.id || row._id];
        const handleToggle = () => handleToggleText(row.id || row._id);

        const plantNames = row.plantId?.map((p) => p.plantName) || [];
        const joinedNames = plantNames.join(", ");

        return (
          <a
            color="secondary"
            onClick={handleToggle}
            style={{ cursor: "pointer" }}
          >
            {showFullText
              ? joinedNames
              : joinedNames.length > 20
              ? `${joinedNames.substring(0, 20)}...`
              : joinedNames}
          </a>
        );
      },
    },
    {
      id: "categoryName",
      label: "Product Category",
      sortable: true,
      render: (row) =>
        row.categoryId?.map((category) => category?.categoryName).join(", "),
    },
    { id: "technicianType", label: "Type", sortable: true },
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
          label={row.userId?.status}
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
              <TechnicianDetails technician={row} />
            </MenuItem>
            <MenuItem>
              <TechnicianEdit
                onTechnicianEdit={fetchTechnicians}
                technician={row}
              />
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  return (
    <PageContainer
      title="Technician"
      description="this is Technician Table page"
    >
      <Breadcrumb title="Technician" items={BCrumb} />
      <DataTable
        data={allTechnicians}
        columns={columns}
        isFilter={true}
        model={<TechnicianAdd onTechnicianAdded={fetchTechnicians} />}
      />
    </PageContainer>
  );
};

export default Technician;
