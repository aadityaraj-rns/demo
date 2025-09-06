import { useState, useEffect } from "react";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import CityAdd from "../../../components/admin/masterData/city/CityAdd";
import { getAllCity } from "../../../api/admin/internal";
import { Chip, Box, Tooltip, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CityEdit from "../../../components/admin/masterData/city/CityEdit";
import DataTable from "../../../components/common/DataTable";
import { formatDate } from "../../../utils/helpers/formatDate";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "City",
  },
];
const City = () => {
  const [citys, setCitys] = useState([]);
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

  const fetchCitys = async () => {
    const response = await getAllCity();
    if (response.status === 200) {
      setCitys(response.data.allCity);
    }
  };

  useEffect(() => {
    fetchCitys();
  }, []);

  const columns = [
    { id: "stateName", label: "State Name", sortable: true },
    { id: "cityName", label: "City Name", sortable: true },
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
              <CityEdit onCityEdit={fetchCitys} city={row} />
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];
  return (
    <PageContainer title="City Table" description="this is City Table page">
      <Breadcrumb title="City Table" items={BCrumb} />

      <DataTable
        data={citys}
        columns={columns}
        // searchableFields={searchableFields}
        isFilter={true}
        model={<CityAdd onCityAdded={fetchCitys} />}
      />
    </PageContainer>
  );
};

export default City;
