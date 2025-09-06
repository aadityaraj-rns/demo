import { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";

import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../components/container/PageContainer";
import { getAllAsset } from "../../../api/organization/internal";
import AddAssest from "../../../components/customer/assets/AddAsset";
import { Link } from "react-router-dom";
import EditAsset from "../../../components/customer/assets/EditAsset";
import Spinner from "../../admin/spinner/Spinner";
import { formatDate } from "../../../utils/helpers/formatDate";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AssetDataTable from "../../../components/common/AssetDataTable";
import * as XLSX from "xlsx";
import { IconDownload } from "@tabler/icons";
import BulkUpload from "../../../components/customer/assets/BulkUpload";

const BCrumb = [
  {
    to: "/customer",
    title: "Home",
  },
  {
    title: "Assets",
  },
];

const Assets = () => {
  const [loading, setLoading] = useState(true);
  const [assetDatas, setAssetDatas] = useState([]);
  const [filteredAssetDatas, setFilteredAssetDatas] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  const fetchAssets = async () => {
    const response = await getAllAsset();
    if (response.status === 200) {
      setAssetDatas(response.data.assets);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
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
    {
      id: "assetId",
      label: "Asset ID",
      sortable: true,
      render: (row) => (
        <Link
          to={`view/${row._id}`}
          style={{ color: row.status == "Deactive" ? "red" : "blue" }}
        >
          {row.assetId}
        </Link>
      ),
      getFilterValue: (row) => row.assetId,
    },
    {
      id: "category",
      label: "Category",
      sortable: true,
      render: (row) => row.productId?.categoryId?.categoryName || "-",
    },
    {
      id: "productId",
      label: "Product",
      sortable: true,
      render: (row) => row.productId?.productName || "-",
    },
    {
      id: "type",
      label: "Type",
      sortable: true,
      render: (row) => [row?.type, row?.subType].filter(Boolean).join(", "),
    },
    {
      id: "plantId",
      label: "Plant",
      sortable: true,
      render: (row) => row.plantId?.plantName || "-",
    },
    { id: "building", label: "Building", sortable: true },
    {
      id: "location",
      label: "Location",
      sortable: true,
      render: (row) => row.location || "-",
    },
    { id: "healthStatus", label: "Health Status", sortable: false },
    {
      id: "technicianUserId",
      label: "Technician",
      sortable: true,
      render: (row) =>
        row.technicianUserId?.map((t) => t?.name).join(", ") || "-",
    },
    {
      id: "pressureUnit",
      label: "pressureUnit",
      sortable: true,
      render: (row) =>
        (row.pressureRating ? row.pressureRating + " " : "") +
        (row.pressureUnit || ""),
    },

    {
      id: "capacity",
      label: "Capacity",
      sortable: true,
      render: (row) => row.capacity + " " + row.capacityUnit || "-",
    },

    {
      id: "tag",
      label: "Tag",
      sortable: true,
    },
    {
      id: "status",
      label: "Status",
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
      filterable: false,
      render: (row) => (
        <Box display="flex">
          <Tooltip title="View / Edit">
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
            <MenuItem onClick={handleMenuClose}>
              <Link
                to={`view/${row._id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  borderRadius: "5px",
                }}
              >
                View
              </Link>
            </MenuItem>
            <MenuItem>
              <EditAsset onAssetEdit={fetchAssets} asset={row} />
            </MenuItem>
            <MenuItem>
              <Link
                to={`/customer/assets/${row?._id}/upload-old-services`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  borderRadius: "5px",
                }}
              >
                Upload Old Services
              </Link>
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  const handleFilteredDataChange = (filteredData) => {
    setFilteredAssetDatas(filteredData);
  };

  const handleDownloadExcel = () => {
    const downloadData =
      filteredAssetDatas.length > 0 ? filteredAssetDatas : assetDatas;

    const worksheetData = [
      [
        "Asset ID",
        "Plant",
        "Building",
        "Category",
        "Product",
        "Product Type",
        "testFrequency",
        "Capacity",
        "Location",
        "Technician Name",
        "Model",
        "Sl No",
        "pressureRating",
        "moc",
        "Approval",
        "FireClass",
        "Manufacturing Date",
        "Manufacturer Name",
        "InstallDate",
        "SuctionSize",
        "Head",
        "rpm",
        "Moc Of Impeller",
        "Fuel Capacity",
        "Flow In Lpm",
        "House Power",
        "Health Status",
        "Tag",
        "Group Name",
        "Status",
        "Created At",
      ], // Customize these headers
      ...downloadData.map((asset) => [
        asset.assetId,
        asset.plantId.plantName,
        asset.building,
        asset.productId?.categoryId.categoryName,
        asset.productId?.productName,
        asset.productId?.type,
        asset.productId?.testFrequency,
        asset.capacity + " " + asset.productId?.capacity,
        asset.location,
        asset.technicianUserId?.map((t) => t?.name).join(", "),
        asset.model,
        asset.slNo,
        asset.pressureRating + " " + asset.pressureUnit,
        asset.moc,
        asset.approval,
        asset.fireClass,
        formatDate(asset.manufacturingDate),
        asset.manufacturerName,
        formatDate(asset.installDate),
        asset.suctionSize,
        asset.head,
        asset.rpm,
        asset.mocOfImpeller,
        asset.fuelCapacity,
        asset.flowInLpm,
        asset.housePower,
        asset.healthStatus,
        asset.tag,
        asset.groupName,
        asset.status,
        formatDate(asset.createdAt),
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assets");

    XLSX.writeFile(workbook, "AssetsData.xlsx");
  };

  return (
    <PageContainer title="Assets" description="This is Assets Table page">
      <Breadcrumb title="Assets" items={BCrumb} />
      <AssetDataTable
        data={assetDatas}
        columns={columns}
        modal={
          <>
            <ButtonGroup
              variant="contained"
              color="primary"
              aria-label="outlined button group"
              sx={{ mb: 1 }}
              size="small"
            >
              <AddAssest onAssetAdded={fetchAssets} />
              <BulkUpload onAssetAdded={fetchAssets} />
              <Button
                onClick={handleDownloadExcel}
                size="small"
                startIcon={<IconDownload />}
              >
                Download
              </Button>
            </ButtonGroup>
          </>
        }
        onFilterChange={handleFilteredDataChange}
        isFilter={true}
      />
    </PageContainer>
  );
};

export default Assets;
