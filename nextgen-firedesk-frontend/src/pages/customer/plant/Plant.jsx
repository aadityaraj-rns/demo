import React, { useEffect, useState } from "react";
import {
  Chip,
  Box,
  Tooltip,
  Menu,
  IconButton,
  MenuItem,
  Typography,
} from "@mui/material";

import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../components/container/PageContainer";
import { getAllPlant } from "../../../api/admin/internal";
import PlantDetails from "../../../components/customer/plant/PlantDetails";
import EditPlant from "../../../components/customer/plant/EditPlant";
import AddPlant from "../../../components/customer/plant/AddPlant";
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
    title: "Plant Table",
  },
];

const Plant = () => {
  const [plantDatas, setPlantDatas] = useState([]);
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

  const fetchPlants = async () => {
    const response = await getAllPlant();
    if (response.status === 200) {
      setPlantDatas(response.data.allPlants);
    }
    setLoading(false);
  };

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const columns = [
    {
      id: "plantId",
      label: "plant Id",
      sortable: true,
    },
    {
      id: "plantName",
      label: "Name",
      sortable: true,
      render: (row) => <PlantDetails plant={row} text={row.plantName} />,
    },
    { id: "cityName", label: "Address", sortable: true },
    {
      id: "categoryName",
      label: "Category",
      sortable: true,
      render: (row) => {
        const showFullText = expandedRows[row.id || row._id];
        const handleToggle = () => handleToggleText(row.id || row._id);

        const categoryNamesText = row.categories
          .map((category) => category.categoryName)
          .join(", ");

        const truncatedText =
          categoryNamesText.length > 20
            ? categoryNamesText.substring(0, 20) + "..."
            : categoryNamesText;

        return (
          <a
            color="secondary"
            // variant="outlined"
            onClick={handleToggle}
            style={{ cursor: "pointer" }}
          >
            {showFullText ? categoryNamesText : truncatedText}
          </a>
        );
      },
    },
    { id: "managerName", label: "Managed By", sortable: true },
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
      id: "createdAt",
      label: "Created At",
      sortable: true,
      render: (row) => (row.createdAt ? formatDate(row.createdAt) : ""),
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
              <PlantDetails plant={row} text={<Typography>View</Typography>} />
            </MenuItem>
            <MenuItem>
              <EditPlant onPlantEdit={fetchPlants} plant={row} />
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  return (
    <PageContainer title="Plant" description="this is Plant Table page">
      <Breadcrumb title="Plant" items={BCrumb} />

      <DataTable
        data={plantDatas}
        columns={columns}
        isFilter={true}
        model={<AddPlant onPlantAdded={fetchPlants} />}
      />
    </PageContainer>
  );
};

export default Plant;
