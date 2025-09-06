import { useEffect, useState } from "react";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import CategoriesAddModal from "../../../components/admin/masterData/categories/CategoriesAddModal";
import {
  Chip,
  Box,
  Fab,
  MenuItem,
  Menu,
  Tooltip,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { IconEye } from "@tabler/icons"; // Ensure this is imported
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getAllCategories } from "../../../api/admin/internal";
import CategoriesEdit from "../../../components/admin/masterData/categories/CategoriesEdit";
import DataTable from "../../../components/common/DataTable";
import { formatDate } from "../../../utils/helpers/formatDate";
import CategoriesViewModal from "../../../components/admin/masterData/categories/CategoriesViewModal";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Categories",
  },
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
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

  const navigate = useNavigate();

  const fetchCategories = async () => {
    const response = await getAllCategories();

    if (response.status === 200) {
      setCategories(response.data.allCategory);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // const searchableFields = ["categoryName"];

  const columns = [
    {
      id: "categoryName",
      label: "Categories Name",
      sortable: true,
      render: (row) => (
        <CategoriesViewModal
          category={row}
          triggerComponent={
            <span style={{ cursor: "pointer", textDecoration: "none" }}>
              {row?.categoryName}
            </span>
          }
        />
      ),
    },
    {
      id: "formName",
      label: "Form Name",
      render: (row) => row?.formId?.serviceName,
      sortable: true,
    },
    {
      id: "createdAt",
      label: "Created At",
      sortable: true,
      render: (row) => formatDate(row?.createdAt),
    },
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <Chip
          label={row?.status}
          sx={{
            bgcolor:
              row?.status === "Active"
                ? "success.light"
                : row?.status === "Pending"
                ? "warning.light"
                : row?.status === "Deactive"
                ? "error.light"
                : "secondary.light",
            color:
              row?.status === "Active"
                ? "success.main"
                : row?.status === "Pending"
                ? "warning.main"
                : row?.status === "Deactive"
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
            open={Boolean(anchorEl) && currentRow?._id === row?._id}
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
              <Fab
                size="small"
                color="primary"
                onClick={() =>
                  navigate(`/service/form-download/${row?.formId?._id}`)
                }
              >
                <IconEye size="16" />
              </Fab>
            </MenuItem>
            <MenuItem>
              <CategoriesEdit onCategoryEdit={fetchCategories} category={row} />
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  return (
    <PageContainer title="Categories" description="this is Categories page">
      <Breadcrumb title="Categories" items={BCrumb} />

      <DataTable
        data={categories}
        columns={columns}
        // searchableFields={searchableFields}
        isFilter={true}
        model={<CategoriesAddModal onCategoryAdd={fetchCategories} />}
      />
    </PageContainer>
  );
};

export default Categories;
