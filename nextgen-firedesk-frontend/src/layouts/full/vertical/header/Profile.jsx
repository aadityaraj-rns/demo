import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import * as dropdownData from "./data";

import { IconMail } from "@tabler/icons";
import { Stack } from "@mui/system";

import ProfileImg from "/src/assets/images/profile/user-1.jpg";
import unlimitedImg from "/src/assets/images/backgrounds/unlimited-bg.png";
import Scrollbar from "/src/components/custom-scroll/Scrollbar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../../api/admin/internal";
import { resetUser } from "../../../../store/userSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const nameFromStore = useSelector((state) => state.user.name);
  const contactNoFromStore = useSelector((state) => state.user.phone);
  const emailFromStore = useSelector((state) => state.user.email);
  const profileFromStore = useSelector((state) => state.user.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignout = async () => {
    const response = await logout();
    if (response.status === 200) {
      dispatch(resetUser());
      navigate("/login");
    } else {
      dispatch(resetUser());
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
          src={profileFromStore}
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
            width: "360px",
          },
        }}
      >
        <Scrollbar sx={{ height: "100%", maxHeight: "85vh" }}>
          <Box p={3}>
            {/* <Typography variant="h5">User Profile</Typography> */}
            <Stack direction="row" py={3} spacing={2} alignItems="center">
              <Avatar
                src={profileFromStore}
                alt={ProfileImg}
                sx={{ width: 95, height: 95 }}
              />
              <Box>
                <Typography
                  variant="subtitle2"
                  color="textPrimary"
                  fontWeight={600}
                >
                  {nameFromStore}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  {contactNoFromStore}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <IconMail width={15} height={15} />
                  {emailFromStore}
                </Typography>
              </Box>
            </Stack>
            <Divider />
            {dropdownData.profile.map((profile) => (
              <Box key={profile.title}>
                <Box sx={{ py: 2, px: 0 }} className="hover-text-primary">
                  <Link to={profile.href}>
                    <Stack direction="row" spacing={2}>
                      <Box
                        width="45px"
                        height="45px"
                        bgcolor="primary.light"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Avatar
                          src={profile.icon}
                          alt={profile.icon}
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: 0,
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          color="textPrimary"
                          className="text-hover"
                          noWrap
                          sx={{
                            width: "240px",
                          }}
                        >
                          {profile.title}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                          sx={{
                            width: "240px",
                          }}
                          noWrap
                        >
                          {profile.subtitle}
                        </Typography>
                      </Box>
                    </Stack>
                  </Link>
                </Box>
              </Box>
            ))}
            <Box mt={2}>
              <Button
                onClick={handleSignout}
                variant="outlined"
                color="primary"
                component={Link}
                fullWidth
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Scrollbar>
      </Menu>
    </Box>
  );
};

export default Profile;
