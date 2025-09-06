import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Menu,
  Avatar,
  Typography,
  // Divider,
  Button,
  IconButton,
} from "@mui/material";
// import * as dropdownData from "./data";
import { Stack } from "@mui/system";

import ProfileImg from "/src/assets/images/profile/user-1.jpg";
import Scrollbar from "/src/components/custom-scroll/Scrollbar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../../api/admin/internal";
import { resetUser } from "../../../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../../../../components/common/showAlert";
import { Edit, Email, Phone } from "@mui/icons-material";

const Profile = () => {
  const storeInfo = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignout = async () => {
    const response = await logout();
    if (response.status === 200) {
      dispatch(resetUser());
      navigate("/login");
      showAlert({
        text: "Logout Successfully",
        icon: "success",
      });
    } else {
      dispatch(resetUser());
      showAlert({
        text: response.data.message,
        icon: "error",
      });
      console.error("Logout failed:", response);
    }
  };

  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={storeInfo.profile}
          alt={ProfileImg}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "300px",
          },
        }}
      >
        <Scrollbar sx={{ height: "100%", maxHeight: "85vh" }}>
          <Box
            p={1}
            sx={{
              textAlign: "center",
            }}
          >
            <Avatar
              src={storeInfo.profile}
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                bgcolor: "grey.200",
              }}
            >
              <Edit sx={{ fontSize: 40 }} />
            </Avatar>

            <Typography variant="h6" mt={1}>
              {storeInfo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {storeInfo.loginID}
            </Typography>

            {/* <Typography variant="h5" mt={1}>
              John Doe
            </Typography> */}
            <Typography variant="body2" color="text.secondary">
              {storeInfo.userType == "organization" ? "Admin" : "Manager"}
            </Typography>

            <Stack spacing={0.5} mt={1} alignItems="center">
              <Box display="flex" alignItems="center">
                <Email sx={{ mr: 1 }} />
                <Typography>{storeInfo.email}</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Phone sx={{ mr: 1 }} />
                <Typography>{storeInfo.phone}</Typography>
              </Box>
              {/* <Box display="flex" alignItems="center">
                <LocationOn sx={{ mr: 1 }} />
                <Typography>City, Country</Typography>
              </Box> */}
            </Stack>

            <Stack mt={2} spacing={1}>
              <Button
                variant="outlined"
                onClick={() => navigate("/customer/profile")}
              >
                Edit Profile
              </Button>
              <Button
                onClick={handleSignout}
                variant="contained"
                color="primary"
                component={Link}
                // fullWidth
              >
                Logout
              </Button>
            </Stack>
          </Box>
        </Scrollbar>
      </Menu>
    </Box>
  );
};

export default Profile;
