import React from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import img1 from "/src/assets/images/profile/user-1.jpg";
import { IconPower } from "@tabler/icons";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../../../api/admin/internal";
import { resetUser } from "../../../../../store/userSlice";

export const Profile = () => {
  const nameFromStore = useSelector((state) => state.user.name);
  const contactNoFromStore = useSelector((state) => state.user.phone);
  const emailFromStore = useSelector((state) => state.user.email);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignout = async () => {
    const response = await logout();
    if (response.status === 200) {
      dispatch(resetUser());
      navigate("/login");
    } else {
      console.error("Logout failed:", response);
    }
  };

  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const hideMenu = lgUp
    ? customizer.isCollapse && !customizer.isSidebarHover
    : "";
  return (
    <Box
      display={"flex"}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${"secondary.light"}` }}
    >
      {!hideMenu ? (
        <>
          <Avatar alt="Remy Sharp" src={img1} />

          <Box>
            <Typography variant="h6" color="textPrimary">
              {nameFromStore}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {emailFromStore}
            </Typography>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <Tooltip title="Logout" placement="top">
              <IconButton
                onClick={handleSignout}
                color="primary"
                component={Link}
                aria-label="logout"
                size="small"
              >
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ""
      )}
    </Box>
  );
};
