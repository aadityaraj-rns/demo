import { useEffect, useState } from "react";
import DataTable from "../../../components/common/DataTable";
import PageContainer from "../../../components/container/PageContainer";
import CreateGroupService from "../../../components/customer/group/CreateGroupService";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import EditGroupService from "../../../components/customer/group/EditGroupService";
import { formatDate } from "../../../utils/helpers/formatDate";
import { Link } from "react-router-dom";
import { getGroupServices } from "../../../api/organization/internal";

const GroupService = () => {
  const [groupServices, setGroupServices] = useState([]);
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
  const BCrumb = [
    {
      to: "/customer",
      title: "Home",
    },
    {
      title: "Group Service",
    },
  ];
  const columns = [
    {
      id: "groupId",
      label: "Group ID",
    },
    {
      id: "groupName",
      label: "Name",
    },
    {
      id: "assetIds",
      label: "Asset Id's",
      render: (row) => row.assetsId?.map((a) => a.assetId).join(", "),
    },
    {
      id: "form",
      label: "Form",
      render: (row) => row.formId?.serviceName,
    },
    {
      id: "startDate",
      label: "start Date",
      render: (row) => formatDate(row.startDate),
    },
    {
      id: "endDate",
      label: "end Date",
      render: (row) => formatDate(row.endDate),
    },
    {
      id: "inspection",
      label: "inspection",
    },
    {
      id: "testing",
      label: "testing",
    },
    {
      id: "maintenance",
      label: "maintenance",
    },
    {
      id: "action",
      label: "",
      filterable: false,
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
            <MenuItem onClick={handleMenuClose}>
              <Link
                to={`${row._id}/details`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                View
              </Link>
            </MenuItem>
            <MenuItem>
              <EditGroupService row={row} fetchData={fetchData} />
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  const fetchData = async () => {
    const response = await getGroupServices();
    setGroupServices(response.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer title="Group Service" description="this is Plant Table page">
      <Breadcrumb title="Group Service" items={BCrumb} />
      <DataTable
        data={groupServices}
        columns={columns}
        isFilter={true}
        model={<CreateGroupService fetchData={fetchData} />}
      />
    </PageContainer>
  );
};

export default GroupService;
