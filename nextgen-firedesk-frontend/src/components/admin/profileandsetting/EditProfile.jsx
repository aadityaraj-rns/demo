import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import CustomFormLabel from "../../forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../forms/theme-elements/CustomTextField";
import { useDispatch, useSelector } from "react-redux";
import { editAdmin } from "../../../api/admin/internal";
import { setUser } from "../../../store/userSlice";

const EditProfile = ({ admin, setUpdateSuccess, editSuccess }) => {
  const [modal, setModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(admin.profile || "");

  const toggle = () => {
    setModal(!modal);
  };

  const dispatch = useDispatch();

  const nameFromStore = useSelector((state) => state.user.name);
  const contactNoFromStore = useSelector((state) => state.user.phone);
  const emailFromStore = useSelector((state) => state.user.email);
  const displayNameFromStore = useSelector((state) => state.user.displayName);

  const [name, setName] = useState(nameFromStore);
  const [displayName, setdisplayName] = useState(displayNameFromStore);
  const [contactNo, setContactNo] = useState(contactNoFromStore);
  const [email, setEmail] = useState(emailFromStore);
  const [passwordCollapse, setPasswordCollapse] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [cNewPassword, setCNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordChange = (event) => {
    event.preventDefault();
    setPasswordCollapse(!passwordCollapse);
  };

  const handleContactNoChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setContactNo(value);
    }
  };

  const handleNewConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setCNewPassword(value);
    if (value !== newPassword) {
      setErrorMessage("Confirm password should be the same as new password");
    } else {
      setErrorMessage("");
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("userType", "admin");
    formData.append("displayName", displayName);
    formData.append("name", name);
    formData.append("phone", contactNo);
    formData.append("email", email);
    if (currentPassword) formData.append("currentPassword", currentPassword);
    if (newPassword) formData.append("newPassword", newPassword);
    if (cNewPassword) formData.append("cNewPassword", cNewPassword);

    // Append the profile image file to the form data
    const profileImageInput = document.getElementById("user-profile-image");
    const file = profileImageInput.files[0];
    if (file) {
      formData.append("profile", file);
    }

    try {
      const response = await editAdmin(formData); // Pass FormData directly to the API function
      if (response && response.status === 200) {
        const admin = {
          _id: response.data.admin._id,
          userType: response.data.admin.userType,
          displayName: response.data.admin.displayName,
          name: response.data.admin.name,
          phone: response.data.admin.phone,
          email: response.data.admin.email,
          profile: response.data.admin.profile,
          auth: response.data.auth,
        };
        dispatch(setUser(admin));
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 1500);
        editSuccess();
        toggle();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

  function handleProfileImageUpload() {
    const profile = document.getElementById("user-profile-image");
    profile.click();
  }

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
  useEffect(() => {
    if (admin.profile) {
      setImageSrc(admin.profile);
    }
  }, [admin]);
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
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" variant="h5">
          {"Edit Profile"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form>
              <Grid
                container
                spacing={3}
                className="d-flex justify-content-center"
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
                  <img
                    src={imageSrc}
                    alt="profile"
                    id="profile"
                    onClick={handleProfileImageUpload}
                    style={{ height: "20vh", width: "20vh" }}
                    className="rounded-circle"
                  />
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
                    Full Name <span className="text-danger">*</span>
                  </CustomFormLabel>
                  <CustomTextField
                    id="name"
                    value={name}
                    variant="outlined"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="name"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="displayName">
                    Display Name <span className="text-danger">*</span>
                  </CustomFormLabel>
                  <CustomTextField
                    id="displayName"
                    value={displayName}
                    variant="outlined"
                    onChange={(e) => setdisplayName(e.target.value)}
                    placeholder="display name"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="contactNo">
                    Contact No <span className="text-danger">*</span>
                  </CustomFormLabel>
                  <CustomTextField
                    id="contactNo"
                    type="text"
                    value={contactNo}
                    variant="outlined"
                    onChange={handleContactNoChange}
                    placeholder="contact no"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="email">
                    Email <span className="text-danger">*</span>
                  </CustomFormLabel>
                  <CustomTextField
                    id="email"
                    type="text"
                    value={email}
                    variant="outlined"
                    placeholder="email"
                    fullWidth
                    InputProps={{
                      style: { color: "rgba(0, 0, 0, 0.5)" },
                    }}
                  />
                </Grid>

                {passwordCollapse && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <CustomFormLabel sx={{ mt: 0 }} htmlFor="currentPassword">
                        Current Password
                      </CustomFormLabel>
                      <CustomTextField
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        variant="outlined"
                        placeholder="current password"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomFormLabel sx={{ mt: 0 }} htmlFor="newPassword">
                        New Password
                      </CustomFormLabel>
                      <CustomTextField
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        variant="outlined"
                        placeholder="new password"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomFormLabel sx={{ mt: 0 }} htmlFor="cNewPassword">
                        Confirm New Password
                      </CustomFormLabel>
                      <CustomTextField
                        id="cNewPassword"
                        type="password"
                        value={cNewPassword}
                        onChange={handleNewConfirmPasswordChange}
                        variant="outlined"
                        placeholder="new password"
                        fullWidth
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel
                    sx={{ mt: 0 }}
                    htmlFor="cNewPassword"
                  ></CustomFormLabel>
                </Grid>
              </Grid>
              {errorMessage && (
                <Typography
                  color="error"
                  variant="body2"
                  className="text-center mt-3"
                >
                  {errorMessage}
                </Typography>
              )}
            </form>
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
                onClick={handlePasswordChange}
              >
                Change Password
              </Button>
              <div>
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  className="me-3"
                  onClick={handleSubmit}
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
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditProfile;
