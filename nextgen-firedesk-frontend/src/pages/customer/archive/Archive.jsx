import { useEffect, useState } from "react";
import {
  Box,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../components/container/PageContainer";
import {
  deleteArchive,
  fetchArchives,
} from "../../../api/organization/internal";
import AddArchive from "./AddArchive";
import Spinner from "../../admin/spinner/Spinner";
import ImageOrFileModal from "../../../components/modal/ImageOrFileModal";
import DataTable from "../../../components/common/DataTable";
import { formatDate } from "../../../utils/helpers/formatDate";
import EditArchive from "./EditArchive";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { showAlert } from "../../../components/common/showAlert";

const BCrumb = [
  {
    to: "/customer",
    title: "Home",
  },
  {
    title: "Archive",
  },
];

const Archive = () => {
  const [loading, setLoading] = useState(true);
  const [archiveDatas, setarchiveDatas] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const fetchArchiveData = async () => {
    const response = await fetchArchives();
    if (response.status === 200) {
      setarchiveDatas(response.data.archives);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArchiveData();
  }, []);

  const handleDelete = async () => {
    if (currentRow) {
      const response = await deleteArchive(currentRow._id);
      if (response.status === 200) {
        fetchArchiveData();
        showAlert({
          text: "Archive deleted successfully",
          icon: "error",
        });
      } else if (response.code === "ERR_BAD_REQUEST") {
        showAlert({
          text: response.data.message,
          icon: "error",
        });
      }
      setIsDialogOpen(false);
    }
  };

  const openDialog = (row) => {
    setCurrentRow(row);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setCurrentRow(null);
  };

  const columns = [
    {
      id: "archiveName",
      label: "Name",
      sortable: true,
      render: (row) => (
        <span
          style={{
            cursor: "pointer",
            color: "inherit",
            textDecoration: "none",
          }}
          onClick={() => document.getElementById(`modal-${row.id}`).click()}
        >
          {row.archiveName}
        </span>
      ),
    },
    { id: "archiveDescription", label: "Description", sortable: true },
    {
      id: "createdAt",
      label: "Date",
      sortable: true,
      render: (row) => formatDate(row.createdAt),
    },
    {
      id: "imageOrFile",
      label: "Attachment",
      sortable: true,
      render: (row) => (
        <ImageOrFileModal product={row} id={`modal-${row.id}`} />
      ),
    },
    {
      id: "action",
      label: "",
      render: (row) => (
        <Box display="flex">
          <Tooltip title="Delete / Edit">
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
              <EditArchive archive={row} onAssetAdded={fetchArchiveData} />
            </MenuItem>
            <MenuItem>
              <Button
                variant="text"
                color="error"
                onClick={() => openDialog(row)}
              >
                Delete
              </Button>
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
    <PageContainer title="Archive" description="this is Archives Table page">
      <Breadcrumb title="Archive" items={BCrumb} />
      <DataTable
        data={archiveDatas}
        columns={columns}
        isFilter={true}
        model={<AddArchive onAssetAdded={fetchArchiveData} />}
      />

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this archive? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Archive;
