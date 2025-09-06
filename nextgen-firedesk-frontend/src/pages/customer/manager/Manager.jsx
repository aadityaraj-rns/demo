import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../components/container/PageContainer";
import { getAllManager } from "../../../api/admin/internal";
import AddManager from "../../../components/customer/manager/AddManager";
import EditManager from "../../../components/customer/manager/EditManager";
import Spinner from "../../admin/spinner/Spinner";
import DataTable from "../../../components/common/DataTable";
import { formatDate } from "../../../utils/helpers/formatDate";
import { Box, IconButton, Menu, MenuItem, Tooltip, Chip } from "@mui/material";
import ManagerDetails from "../../../components/customer/manager/ManagerDetails";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const BCrumb = [
  {
    to: "/customer",
    title: "Home",
  },
  {
    title: "Manager Table",
  },
];

const Manager = () => {
  const [managerDatas, setManagerDatas] = useState([]);
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

  const fetchManagers = async () => {
    const response = await getAllManager();
    if (response.status === 200) {
      setManagerDatas(response.data.managers);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  if (loading) {
    return <Spinner />;
  }

  const columns = [
    { id: "managerId", label: "ID", sortable: true },
    { id: "loginID", label: "Login ID", sortable: true },
    {
      id: "name",
      label: "Name",
      sortable: true,
      render: (row) => (
        <ManagerDetails
          manager={row}
          triggerComponent={
            <span
              style={{
                cursor: "pointer",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {row.name}
            </span>
          }
        />
      ),
    },
    {
      id: "plants",
      label: "Assigned Plants",
      sortable: true,
      render: (row) => {
        const showFullText = expandedRows[row.id || row._id];
        const handleToggle = () => handleToggleText(row.id || row._id);

        const plantNamesText = row.plants
          .map((plant) => plant.plantName)
          .join(", ");

        return (
          <a
            key={row.id || row._id}
            color="secondary"
            // variant="outlined"
            onClick={handleToggle}
          >
            {showFullText
              ? plantNamesText
              : plantNamesText.substring(0, 20) +
                (plantNamesText.length > 20 ? "..." : "")}
          </a>
        );
      },
    },
    {
      id: "categories",
      label: "Product Category",
      sortable: true,
      render: (row) => {
        const showFullText = expandedRows[row.id || row._id];
        const handleToggle = () => handleToggleText(row.id || row._id);

        const categoryNamesText = row.categories
          .map((category) => category.categoryName)
          .join(", ");

        return (
          <a
            key={row.id || row._id}
            color="secondary"
            // variant="outlined"
            onClick={handleToggle}
          >
            {showFullText
              ? categoryNamesText
              : categoryNamesText.substring(0, 20) +
                (categoryNamesText.length > 20 ? "..." : "")}
          </a>
        );
      },
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
              <ManagerDetails manager={row} />
            </MenuItem>
            <MenuItem>
              <EditManager manager={row} onManagerEdit={fetchManagers} />
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  return (
    <PageContainer title="Manager" description="This is the Manager Table page">
      <Breadcrumb title="Manager" items={BCrumb} />
      <DataTable
        data={managerDatas}
        columns={columns}
        isFilter={true}
        model={<AddManager onManagerAdded={fetchManagers} />}
      />
    </PageContainer>
  );
};

export default Manager;
