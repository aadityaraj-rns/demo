import { useEffect, useState } from "react";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import ProductAddModal from "../../../components/admin/product/ProductAddModal";
import { Chip, Box, Tooltip, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getAllProducts } from "../../../api/admin/internal";
import ProductEditModal from "../../../components/admin/product/ProductEditModal";
import DataTable from "../../../components/common/DataTable";
import { formatDate } from "../../../utils/helpers/formatDate";
import Spinner from "../spinner/Spinner";
// import ProductViewModal from "../../../components/admin/product/ProductViewModal";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Product",
  },
];
const Product = () => {
  const [products, setProducts] = useState([]);
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

  const fetchProducts = async () => {
    const response = await getAllProducts();
    if (response.status === 200) {
      setProducts(response.data.products);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns = [
    {
      id: "categoryName",
      label: "Category",
      render: (row) => row.categoryId.categoryName,
      sortable: true,
    },

    {
      id: "productName",
      label: "Product Name",
      sortable: true,
      render: (row) => row.productName,
    },
    {
      id: "type",
      label: "Type",
      render: (row) => row.variants.map((v) => v.type).join(", "),
      sortable: false,
    },
    {
      id: "subType",
      label: "Sub Type",
      render: (row) => row.variants.map((v) => v.subType).join(", "),
      sortable: false,
    },
    { id: "testFrequency", label: "Test Frequency", sortable: false },
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <Chip
          size="small"
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
      render: (row) => formatDate(row.createdAt),
    },
    {
      id: "action",
      label: "",
      render: (row) => (
        <Box display="flex">
          <Tooltip title="More options">
            <IconButton size="small" onClick={(e) => handleMenuClick(e, row)}>
              <MoreVertIcon fontSize="small" />
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
            {/* <MenuItem>
              <ProductViewModal product={row} />
            </MenuItem> */}
            <MenuItem>
              <ProductEditModal product={row} onProductEdit={fetchProducts} />
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
    <PageContainer title="Product" description="this is Product Table page">
      <Breadcrumb title="Product" items={BCrumb} />
      <DataTable
        data={products}
        columns={columns}
        isFilter={true}
        model={<ProductAddModal onProductAdd={fetchProducts} />}
      />
    </PageContainer>
  );
};

export default Product;
