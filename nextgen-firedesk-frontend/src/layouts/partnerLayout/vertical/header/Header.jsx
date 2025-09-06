import React from "react";
import {
  IconButton,
  Box,
  AppBar,
  useMediaQuery,
  Toolbar,
  styled,
  Stack,
} from "@mui/material";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleSidebar,
  toggleMobileSidebar,
} from "/src/store/customizer/CustomizerSlice";
import { IconMenu2 } from "@tabler/icons";

// components
// import Notifications from "./Notifications";
import Profile from "./Profile";
import MobileRightSidebar from "./MobileRightSidebar";

const Header = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  // drawer
  const customizer = useSelector((state) => state.customizer);
  const dispatch = useDispatch();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    // [theme.breakpoints.up('lg')]: {
    //   minHeight: customizer.TopbarHeight,
    // },
    backgroundColor: "#f7f7fe",
    maxHeight: "50px",
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="fixed" color="default">
      <ToolbarStyled>
        {/* ------------------------------------------- */}
        {/* Toggle Button Sidebar */}
        {/* ------------------------------------------- */}
        {lgDown && (
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={() => dispatch(toggleMobileSidebar())}
          >
            <IconMenu2 size="20" />
          </IconButton>
        )}

        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          {/* End Ecommerce Dropdown */}
          {/* ------------------------------------------- */}
          {/* <Notifications /> */}
          {/* ------------------------------------------- */}
          {/* Toggle Right Sidebar for mobile */}
          {/* ------------------------------------------- */}
          {lgDown ? <MobileRightSidebar /> : null}
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  toggleSidebar: PropTypes.func,
};

export default Header;
