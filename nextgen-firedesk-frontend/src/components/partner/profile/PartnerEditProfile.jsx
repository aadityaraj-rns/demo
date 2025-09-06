import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  styled,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomFormLabel from "../../forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../forms/theme-elements/CustomTextField";
import { getActiveCities } from "../../../api/admin/internal";
import userimg from "../../../assets/images/profile/Profile.jpeg";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { editPartnerProfile } from "../../../api/partner/internal";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/userSlice";
import PropTypes from "prop-types";
import { showAlert } from "../../common/showAlert";

const PartnerEditProfile = ({ Profile, editSuccess }) => {
  const [modal, setModal] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [passwordCollapse, setPasswordCollapse] = useState(false);
  // const [stateDatas, setStateDatas] = useState([]);
  const [cityDatas, setCityDatas] = useState([]);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();

  const handleToggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword((prev) => !prev);
  };
  console.log(Profile);

  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  useEffect(() => {
    // const fetchData = async () => {
    //   const response = await getAllActiveState();
    //   if (response.status === 200) {
    //     setStateDatas(response.data.allState);
    //   }
    // };
    // fetchData();
    fetchCities();
  }, []);

  const ProfileImage = styled(Box)(() => ({
    backgroundImage: "linear-gradient(#50b2fc,#f44c66)",
    borderRadius: "50%",
    width: "110px",
    height: "110px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  }));

  const formik = useFormik({
    initialValues: {
      name: Profile?.userId?.name || "",
      contactNo: Profile?.userId?.phone || "",
      email: Profile?.userId?.email || "",
      cityId: Profile?.cityId?._id || "",
      currentPassword: "",
      newPassword: "",
      cNewPassword: "",
      hasGST: Profile.gst ? true : false,
      gst: Profile?.gst || "",
      address: Profile?.address || "",
      pincode: Profile?.pincode || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Customer Name is required"),
      contactNo: Yup.string().required("Contact No is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      cityId: Yup.string().required("City is required"),
      currentPassword: Yup.string(),
      newPassword: Yup.string(),
      cNewPassword: Yup.string().oneOf(
        [Yup.ref("newPassword"), null],
        "Passwords must match with new password"
      ),
      gst: Yup.string(),
      address: Yup.string(),
      pincode: Yup.string(),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("userType", "partner");
      formData.append("name", values.name);
      formData.append("phone", values.contactNo);
      formData.append("email", values.email);
      // formData.append("stateId", values.stateId);
      formData.append("cityId", values.cityId);
      if (values.address) formData.append("address", values.address);
      if (values.currentPassword)
        formData.append("currentPassword", values.currentPassword);
      if (values.newPassword)
        formData.append("newPassword", values.newPassword);
      if (values.cNewPassword)
        formData.append("cNewPassword", values.cNewPassword);
      if (values.gst) formData.append("gst", values.gst);
      if (values.pincode) formData.append("pincode", values.pincode);

      const profileImageInput = document.getElementById("user-profile-image");
      const file = profileImageInput.files[0];
      if (file) {
        formData.append("profile", file);
      }

      try {
        const response = await editPartnerProfile(formData);
        if (response && response.status === 200) {
          const partner = {
            _id: response.data.partner._id,
            userType: response.data.partner.userType,
            displayName: response.data.partner.displayName,
            name: response.data.partner.name,
            phone: response.data.partner.phone,
            email: response.data.partner.email,
            profile: response.data.partner.profile,
            auth: response.data.auth,
          };
          dispatch(setUser(partner));
          editSuccess();
          toggle();
          showAlert({
            text: "Profile updated successfully",
            icon: "success",
          });
        } else {
          toggle();
          showAlert({
            text: response.data.message,
            icon: "error",
          });
        }
      } catch (error) {
        showAlert({
          text: error.message,
          icon: "error",
        });
      }
    },
  });

  useEffect(() => {
    if (Profile?.cityId?.stateId?._id) {
      fetchCities(Profile?.cityId?.stateId?._id);
    }
    if (Profile?.userId?.profile) {
      setImageSrc(Profile.userId.profile);
    }
  }, [Profile]);

  const fetchCities = async () => {
    const response = await getActiveCities();
    if (response.status === 200) {
      setCityDatas(response.data.cities);
    }
  };

  const handleProfileImageUpload = () => {
    const profile = document.getElementById("user-profile-image");
    profile.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggle = () => {
    setModal(!modal);
  };

  return (
    <>
      <Box>
        <Button color="warning" variant="contained" onClick={toggle}>
          Edit
        </Button>
      </Box>
      <Dialog
        open={modal}
        onClose={toggle}
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          variant="h5"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {"Edit Profile"}
          <IconButton aria-label="close" onClick={toggle}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            {Profile ? (
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3} className="d-flex">
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <ProfileImage>
                      <Avatar
                        id="profile"
                        src={imageSrc ? imageSrc : userimg}
                        alt={userimg}
                        onClick={handleProfileImageUpload}
                        sx={{
                          borderRadius: "50%",
                          width: "100px",
                          height: "100px",
                          border: "4px solid #fff",
                        }}
                      />
                    </ProfileImage>
                    <input
                      type="file"
                      className="d-none"
                      id="user-profile-image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="name">
                      Customer Name <span className="text-danger">*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      id="name"
                      name="name"
                      variant="outlined"
                      placeholder="Enter name"
                      fullWidth
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="contactNo">
                      Contact No <span className="text-danger">*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      id="contactNo"
                      name="contactNo"
                      type="text"
                      variant="outlined"
                      placeholder="contact no"
                      fullWidth
                      value={formik.values.contactNo}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.contactNo &&
                        Boolean(formik.errors.contactNo)
                      }
                      helperText={
                        formik.touched.contactNo && formik.errors.contactNo
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="email">
                      Email <span className="text-danger">*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      id="email"
                      name="email"
                      type="text"
                      variant="outlined"
                      placeholder="email"
                      fullWidth
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="cityId">
                      City <span className="text-danger">*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      select
                      id="cityId"
                      name="cityId"
                      variant="outlined"
                      placeholder="Select City"
                      fullWidth
                      value={formik.values.cityId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.cityId && Boolean(formik.errors.cityId)
                      }
                      helperText={formik.touched.cityId && formik.errors.cityId}
                    >
                      {cityDatas.length > 0 ? (
                        cityDatas.map((city) => (
                          <MenuItem value={city._id} key={city._id}>
                            {city.cityName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">No cities available</MenuItem>
                      )}
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="gst">
                      Address
                    </CustomFormLabel>
                    <CustomTextField
                      id="address"
                      name="address"
                      variant="outlined"
                      placeholder="Address"
                      fullWidth
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.address && Boolean(formik.errors.address)
                      }
                      helperText={
                        formik.touched.address && formik.errors.address
                      }
                    />
                  </Grid>
                  {passwordCollapse && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <CustomFormLabel
                          sx={{ mt: 0 }}
                          htmlFor="currentPassword"
                        >
                          Current Password
                        </CustomFormLabel>
                        <CustomTextField
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          variant="outlined"
                          placeholder="Current Password"
                          fullWidth
                          value={formik.values.currentPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.currentPassword &&
                            Boolean(formik.errors.currentPassword)
                          }
                          helperText={
                            formik.touched.currentPassword &&
                            formik.errors.currentPassword
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={
                                    handleToggleCurrentPasswordVisibility
                                  }
                                  onMouseDown={(event) =>
                                    event.preventDefault()
                                  }
                                  edge="end"
                                >
                                  {showCurrentPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomFormLabel sx={{ mt: 0 }} htmlFor="newPassword">
                          New Password
                        </CustomFormLabel>
                        <CustomTextField
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          variant="outlined"
                          placeholder="New Password"
                          fullWidth
                          value={formik.values.newPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.newPassword &&
                            Boolean(formik.errors.newPassword)
                          }
                          helperText={
                            formik.touched.newPassword &&
                            formik.errors.newPassword
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleToggleNewPasswordVisibility}
                                  onMouseDown={(event) =>
                                    event.preventDefault()
                                  }
                                  edge="end"
                                >
                                  {showNewPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomFormLabel sx={{ mt: 0 }} htmlFor="cNewPassword">
                          Confirm New Password
                        </CustomFormLabel>
                        <CustomTextField
                          id="cNewPassword"
                          name="cNewPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          variant="outlined"
                          placeholder="Confirm New Password"
                          fullWidth
                          value={formik.values.cNewPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.cNewPassword &&
                            Boolean(formik.errors.cNewPassword)
                          }
                          helperText={
                            formik.touched.cNewPassword &&
                            formik.errors.cNewPassword
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={
                                    handleToggleConfirmPasswordVisibility
                                  }
                                  onMouseDown={(event) =>
                                    event.preventDefault()
                                  }
                                  edge="end"
                                >
                                  {showConfirmPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12} sm={6}>
                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="gst">
                      {" "}
                      Pincode{" "}
                    </CustomFormLabel>
                    <CustomTextField
                      id="pincode"
                      name="pincode"
                      variant="outlined"
                      placeholder="pincode"
                      fullWidth
                      value={formik.values.pincode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.gst && Boolean(formik.errors.pincode)
                      }
                      helperText={formik.touched.gst && formik.errors.pincode}
                    />
                  </Grid>
                  {formik.values.hasGST && (
                    <Grid item xs={12} sm={6}>
                      <CustomFormLabel sx={{ mt: 0 }} htmlFor="gst">
                        GST Number
                      </CustomFormLabel>
                      <CustomTextField
                        id="gst"
                        name="gst"
                        variant="outlined"
                        placeholder="GST Number"
                        fullWidth
                        value={formik.values.gst}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.gst && Boolean(formik.errors.gst)}
                        helperText={formik.touched.gst && formik.errors.gst}
                      />
                    </Grid>
                  )}
                </Grid>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ justifyContent: "space-between" }}
                  mt={3}
                >
                  <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    style={{ height: "5vh" }}
                    onClick={() => setPasswordCollapse(!passwordCollapse)}
                  >
                    Change Password
                  </Button>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.hasGST}
                        onChange={(e) =>
                          formik.setFieldValue("hasGST", e.target.checked)
                        }
                      />
                    }
                    label={<Typography variant="h6">Has GST</Typography>}
                  />
                  <div>
                    <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      className="me-3"
                      type="submit"
                      onClick={formik.handleSubmit}
                    >
                      Save
                    </Button>
                    <Button
                      size="large"
                      variant="text"
                      color="error"
                      onClick={toggle}
                    >
                      Cancel
                    </Button>
                  </div>
                </Stack>
              </form>
            ) : (
              <Typography>Loading profile...</Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

PartnerEditProfile.propTypes = {
  Profile: PropTypes.object,
  editSuccess: PropTypes.func,
};

export default PartnerEditProfile;
