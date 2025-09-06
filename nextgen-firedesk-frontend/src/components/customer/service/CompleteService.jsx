import { useEffect, useState } from "react";
import { getAllCompletedServices } from "../../../api/organization/internal";
import Spinner from "../../../pages/admin/spinner/Spinner";
import { Link } from "react-router-dom";
import AssetDataTable from "../../common/AssetDataTable";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import * as XLSX from "xlsx";
import { MoreVert, SaveAltOutlined } from "@mui/icons-material";
import { formatDate } from "../../../utils/helpers/formatDate";

const CompletedService = () => {
  const [completedServiceDatas, setCompletedServiceDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [filteredDatas, setFilteredDatas] = useState([]);

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllCompletedServices();
      if (response.status === 200) {
        setCompletedServiceDatas(response.data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const columns = [
    {
      id: "groupId",
      label: "Group",
      sortable: true,
      render: (row) => (
        <Link to={`/customer/group-service`} sx={{ color: "blue" }}>
          {row.groupServiceId?.groupId}
        </Link>
      ),
      getFilterValue: (row) => row?.groupServiceId?.groupId,
    },
    {
      id: "assetId",
      label: "Asset Id",
      sortable: true,
      render: (row) => (
        <Link to={`/customer/assets`} sx={{ color: "blue" }}>
          <strong>{row?.assetsId?.map((a) => a.assetId).join(", ")}</strong>
        </Link>
      ),
      getFilterValue: (row) => row?.assetsId?.map((a) => a.assetId).join(", "),
    },
    {
      id: "plantName",
      label: "plant",
      render: (row) => row?.plantId?.plantName,
      sortable: true,
    },
    {
      id: "building",
      label: "building",
      render: (row) =>
        [...new Set(row?.assetsId.map((a) => a?.building))].join(", "),
      sortable: true,
    },
    {
      id: "location",
      label: "location",
      render: (row) =>
        [...new Set(row?.assetsId.map((a) => a?.location))].join(", "),
      sortable: true,
    },
    {
      id: "assetName",
      label: "asset",
      render: (row) =>
        [...new Set(row?.assetsId.map((a) => a?.productId?.productName))].join(
          ", "
        ),
      sortable: true,
    },
    {
      id: "createdAt",
      label: "Service Due",
      sortable: true,
      render: (row) => formatDate(row?.date),
    },

    {
      id: "serviceType",
      label: "Service Type",
      sortable: true,
    },
    {
      id: "serviceFrequency",
      label: "Frequency",
      sortable: true,
    },
    {
      id: "technicianName",
      label: "Completed By",
      render: (row) => row.serviceDoneBy?.name,
      sortable: true,
    },
    {
      id: "geoCheck",
      label: "geoCheck",
      render: (row) => row.submittedFormId?.geoCheck,
    },
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <Chip
          size="small"
          label={row.completedStatus}
          sx={{
            bgcolor:
              row.completedStatus === "Completed"
                ? "success.light"
                : row.completedStatus === "Waiting for approval"
                ? "warning.light"
                : row.completedStatus === "Rejected"
                ? "error.light"
                : "secondary.light",
            color:
              row.completedStatus === "Completed"
                ? "success.main"
                : row.completedStatus === "Waiting for approval"
                ? "warning.main"
                : row.completedStatus === "Rejected"
                ? "error.main"
                : "secondary.main",
          }}
        />
      ),
      getFilterValue: (row) => row.completedStatus,
    },
    {
      id: "action",
      label: "",
      render: (row) => (
        <Box display="flex">
          <Tooltip title="View / Rejected Logs">
            <IconButton onClick={(e) => handleMenuClick(e, row)}>
              <MoreVert />
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
            {row.submittedFormId?.rejectedLogs ? (
              <MenuItem>
                <Link to={`view-rejected-logs/${row.submittedFormId._id}`}>
                  Rejected Logs
                </Link>
              </MenuItem>
            ) : (
              ""
            )}
            <MenuItem>
              <Link to={`/customer/service-details/view-form/${row._id}`}>
                view
              </Link>
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  const handleFilteredDataChange = (filteredData) => {
    setFilteredDatas(filteredData);
  };

  const handleDownloadExcel = () => {
    const downloadData =
      filteredDatas.length > 0 ? filteredDatas : completedServiceDatas;

    const worksheetData = [
      [
        "Group ID",
        "Asset ID",
        "Plant",
        "Building",
        "Location",
        "Asset",
        "Date",
        "Type",
        "Frequency",
        "Technician",
        "Status",
      ],
      ...downloadData.map((data) => [
        data.groupServiceId?.groupId,
        data.assetsId?.map((a) => a.assetId).join(", "),
        data?.plantId?.plantName,
        [...new Set(data?.assetsId.map((a) => a?.building))].join(", "),
        [...new Set(data?.assetsId.map((a) => a?.location))].join(", "),
        [...new Set(data?.assetsId.map((a) => a?.productId?.productName))].join(
          ", "
        ),
        formatDate(data),
        data.serviceType,
        data.serviceFrequency,
        data.serviceDoneBy.name,
        data.completedStatus,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assets");

    XLSX.writeFile(workbook, "CompletedService.xlsx");
  };

  return (
    <AssetDataTable
      data={completedServiceDatas}
      columns={columns}
      onFilterChange={handleFilteredDataChange}
      modal={
        <Button
          variant="outlined"
          size="small"
          startIcon={<SaveAltOutlined />}
          onClick={handleDownloadExcel}
        >
          Download
        </Button>
      }
      isFilter={true}
    />
  );
};

export default CompletedService;
