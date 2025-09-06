import { useEffect, useState } from "react";
import { getAllServiceForm } from "../../../api/admin/internal";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import DataTable from "../../../components/common/DataTable";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CreateServiceForm from "../../../components/admin/masterData/ServiceForm/CreateServiceForm";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Service-Form",
  },
];

const ServiceForms = () => {
  const [serviceForms, setServiceForms] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const navigate = useNavigate();

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
      const response = await getAllServiceForm();
      setServiceForms(response.data);
    };
    fetchData();
  }, []);

  const columns = [
    {
      id: "serviceName",
      label: "Service Name",
      sortable: true,
    },
    {
      id: "action",
      label: "",
      render: (row) => (
        <Box display="flex">
          <Tooltip title="View / Edit">
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
            <MenuItem>
              <Typography
                onClick={() => navigate(`/service/form-download/${row._id}`)}
              >
                View
              </Typography>
            </MenuItem>
            {/* <MenuItem>
            </MenuItem> */}
          </Menu>
        </Box>
      ),
    },
  ];
  return (
    <PageContainer title="Service-Form" description="this is Service-Form page">
      <Breadcrumb title="Service-Form" items={BCrumb} />
      <DataTable
        data={serviceForms}
        columns={columns}
        isFilter={true}
        model={<CreateServiceForm />}
      />
    </PageContainer>
  );
};

export default ServiceForms;
