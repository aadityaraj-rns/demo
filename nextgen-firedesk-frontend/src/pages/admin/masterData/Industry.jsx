import { useEffect, useState } from "react";
import { Chip, Box, Tooltip, IconButton, Menu, MenuItem } from "@mui/material";

import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../components/container/PageContainer";
import AddIndustry from "../../../components/admin/masterData/state/AddIndustry";
import { getAllIndustries } from "../../../api/admin/internal";
import EditIndustry from "../../../components/admin/masterData/state/EditIndustry";
import DataTable from "../../../components/common/DataTable";
import Spinner from "../spinner/Spinner";
import { formatDate } from "../../../utils/helpers/formatDate";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Industry",
  },
];

const Industry = () => {
  const [industryDatas, setIndustryDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  const fetchIndustries = async () => {
    const response = await getAllIndustries();
    if (response?.status === 200) {
      setIndustryDatas(response.data.allIndustry);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIndustries();
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
    { id: "industryName", label: "Industry Name", sortable: true },
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
      render: (row) => formatDate(row.createdAt),
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
              <EditIndustry onIndustryEdit={fetchIndustries} industry={row} />
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  // const searchableFields = ["industryName"];

  return (
    <PageContainer title="Industry" description="this is Industry page">
      {/* breadcrumb */}
      <Breadcrumb title="Industry" items={BCrumb} />
      {/* end breadcrumb */}

      <DataTable
        data={industryDatas}
        columns={columns}
        // searchableFields={searchableFields}
        isFilter={true}
        model={<AddIndustry onIndustryAdded={fetchIndustries} />}
      />
    </PageContainer>
  );
};

export default Industry;
