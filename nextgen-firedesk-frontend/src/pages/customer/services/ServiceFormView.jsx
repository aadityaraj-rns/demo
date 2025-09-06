import { useEffect, useState } from "react";
// import Service from "../../admin/service/Service";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import ParentCard from "../../../components/shared/ParentCard";
import {
  Button,
  CardContent,
  Collapse,
  Grid,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import Toaster from "../../../components/toaster/Toaster";
import {
  getMyAllServiceNames,
  getOrgProfile,
  SaveHeaderFooterImage,
} from "../../../api/organization/internal";
import Spinner from "../../admin/spinner/Spinner";
import BlankCard from "../../../components/shared/BlankCard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import MoreVertIcon from "@mui/icons-material/MoreVert";

const BCrumb = [
  {
    to: "/customer",
    title: "Home",
  },
  {
    title: "Service",
  },
];

const ServiceFormView = () => {
  const [serviceNames, setServiceNames] = useState([]);
  // const [serviceGroups, setServiceGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addSuccess, setAddSuccess] = useState(false);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false); // New state for image upload success
  const [headerImage, setHeaderImage] = useState(null);
  const [footerImage, setFooterImage] = useState(null);
  const [headerImagePreview, setHeaderImagePreview] = useState("");
  const [footerImagePreview, setFooterImagePreview] = useState("");
  const [saveDisabled, setSaveDisabled] = useState(true);
  // const [anchorEl, setAnchorEl] = useState(null); // State to manage menu opening for Service Table
  // const [groupAnchorEl, setGroupAnchorEl] = useState(null); // State to manage menu opening for Group Table
  // const [selectedGroup, setSelectedGroup] = useState(null);

  const [openSection, setOpenSection] = useState(false);

  const fetchServiceNames = async () => {
    const response = await getMyAllServiceNames();
    if (response?.status === 200) {
      setServiceNames(response.data.serviceNames);
    }
    setLoading(false);
  };

  // const fetchGroups = async () => {
  //   const response = await getServiceGroups();
  //   if (response.status === 200) {
  //     setServiceGroups(response.data.serviceGroups);
  //   }
  // };

  const fetchData = async () => {
    const response = await getOrgProfile();
    if (response.status === 200) {
      setHeaderImagePreview(response.data?.organization?.headerImage);
      setFooterImagePreview(response.data?.organization?.footerImage);
    }
    setLoading(false);
  };

  const handleImageChange = (event, type) => {
    const file = event.target.files[0];
    if (type === "headerImage") {
      setHeaderImage(file);
      setHeaderImagePreview(URL.createObjectURL(file));
    } else if (type === "footerImage") {
      setFooterImage(file);
      setFooterImagePreview(URL.createObjectURL(file));
    }
    if (file) {
      setSaveDisabled(false);
    }
  };

  const handleSaveImages = async () => {
    const formData = new FormData();
    if (headerImage) formData.append("headerImage", headerImage);
    if (footerImage) formData.append("footerImage", footerImage);

    if (!headerImage && !footerImage) {
      setAddSuccess("Please upload at least one image.");
      return;
    }
    setLoading(true);
    try {
      const response = await SaveHeaderFooterImage(formData);
      if (response.status === 200) {
        setImageUploadSuccess("Images updated successfully."); // Set image upload success message
        fetchData();
      }
    } catch (error) {
      setImageUploadSuccess("Error updating images."); // Set error message for image upload
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceNames();
    // fetchGroups();
    fetchData();
  }, []);

  // const setAddToaster = async () => {
  //   setAddSuccess(true);
  //   setTimeout(() => setAddSuccess(false), 1500);
  // };

  // const setImageUploadToaster = async () => {
  //   setImageUploadSuccess(true);
  //   setTimeout(() => setImageUploadSuccess(false), 1500);
  // };

  // const handleServiceMenuClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleGroupMenuClick = (event, group) => {
  //   setSelectedGroup(group);
  //   setGroupAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  //   setGroupAnchorEl(null);
  // };

  if (loading) {
    return <Spinner />;
  }

  return (
    <PageContainer title="Service" description="this is Service Table page">
      <Breadcrumb title="Service" items={BCrumb} />
      <ParentCard>
        <Paper variant="outlined">
          <TableContainer>
            <Table aria-label="simple table" sx={{ whiteSpace: "nowrap" }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Typography variant="body1">Sl No</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1">Service Name</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceNames.map((service, index) => (
                  <TableRow key={service._id}>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="600">
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Link
                        to={`/customer/service/form-download/${service._id}`}
                      >
                        <Typography
                          color="textSecondary"
                          variant="body2"
                          fontWeight="400"
                          style={{ color: "blue" }}
                        >
                          {service.serviceName}
                        </Typography>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </ParentCard>

      <Grid container spacing={3} mt={1}>
        <Grid item xs={12}>
          <BlankCard>
            <CardContent
              sx={{
                padding: "10px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  padding: "10px",
                  bgcolor: "gray",
                  cursor: "pointer",
                  backgroundColor: "#949aa3",
                  color: "white",
                  borderRadius: "10px",
                }}
                onClick={() => setOpenSection(!openSection)}
              >
                Add Header And Footer
                <span style={{ float: "right" }}>
                  <ExpandMoreIcon
                    style={{
                      transform: openSection
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </span>
              </Typography>

              <Collapse in={openSection}>
                <Grid container alignItems="center" spacing={2} mt>
                  {/* Header Image */}
                  <Grid item xs={6}>
                    <TextField
                      label={"Header Image"}
                      InputLabelProps={{ shrink: true }}
                      id="headerImage"
                      name="headerImage"
                      inputProps={{
                        accept: "image/jpg,image/jpeg,image/png",
                      }}
                      type="file"
                      size="large"
                      variant="outlined"
                      fullWidth
                      onChange={(event) =>
                        handleImageChange(event, "headerImage")
                      }
                    />
                    {headerImagePreview && (
                      <img
                        src={headerImagePreview}
                        alt="Header Preview"
                        width={150}
                        height={150}
                      />
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      label={"Footer Image"}
                      id="footerImage"
                      name="footerImage"
                      inputProps={{
                        accept: "image/jpg,image/jpeg,image/png",
                      }}
                      type="file"
                      size="large"
                      variant="outlined"
                      fullWidth
                      onChange={(event) =>
                        handleImageChange(event, "footerImage")
                      }
                    />
                    {footerImagePreview && (
                      <img
                        src={footerImagePreview}
                        alt="Footer Preview"
                        width={150}
                        height={150}
                      />
                    )}
                  </Grid>
                </Grid>
                {/* Save Button */}
                <Grid
                  container
                  justifyContent="flex-end"
                  style={{ marginTop: "16px" }}
                >
                  <Button
                    variant="contained"
                    disabled={saveDisabled}
                    onClick={handleSaveImages}
                  >
                    Save
                  </Button>
                </Grid>
              </Collapse>
            </CardContent>
          </BlankCard>
        </Grid>
      </Grid>

      {addSuccess && (
        <Toaster title="Group" message="Added successfully" color="success" />
      )}
      {imageUploadSuccess && (
        <Toaster
          title="Image Upload"
          message={imageUploadSuccess}
          color="success"
        />
      )}
    </PageContainer>
  );
};

export default ServiceFormView;
