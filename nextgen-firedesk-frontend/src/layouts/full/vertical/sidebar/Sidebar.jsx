import {
  useMediaQuery,
  Box,
  Drawer,
  useTheme,
  IconButton,
} from "@mui/material";
import SidebarItems from "./SidebarItems";
import Logo from "../../shared/logo/Logo";
import { useSelector, useDispatch } from "react-redux";
import {
  // hoverSidebar,
  toggleMobileSidebar,
  toggleSidebar,
} from "/src/store/customizer/CustomizerSlice";
import Scrollbar from "/src/components/custom-scroll/Scrollbar";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";

const Sidebar = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const customizer = useSelector((state) => state.customizer);
  const dispatch = useDispatch();
  const theme = useTheme();
  const toggleWidth =
    customizer.isCollapse && !customizer.isSidebarHover
      ? customizer.MiniSidebarWidth
      : customizer.SidebarWidth;

  if (lgUp) {
    return (
      <Box
        sx={{
          width: toggleWidth,
          flexShrink: 0,
          ...(customizer.isCollapse && {
            position: "absolute",
          }),
        }}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}
        <Drawer
          anchor="left"
          open
          variant="permanent"
          PaperProps={{
            sx: {
              transition: theme.transitions.create("width", {
                duration: theme.transitions.duration.shortest,
              }),
              width: toggleWidth,
              boxSizing: "border-box",
              backgroundColor: "#181c2e",
            },
          }}
        >
          {/* ------------------------------------------- */}
          {/* Sidebar Box */}
          {/* ------------------------------------------- */}
          <Box
            sx={{
              backgroundColor:
                customizer.activeSidebarBg === "#181c2e" &&
                customizer.activeMode === "dark"
                  ? customizer.darkBackground900
                  : "#181c2e",
              color: customizer.activeSidebarBg === "#181c2e" ? "" : "white",
              height: "100%",
            }}
          >
            {/* ------------------------------------------- */}
            {/* Logo */}
            {/* ------------------------------------------- */}
            <Box
              my={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Logo />
            </Box>
            <Scrollbar sx={{ height: "calc(100% - 170px)" }}>
              {/* earlier value calc(100% - 190px) */}
              {/* ------------------------------------------- */}
              {/* Sidebar Items */}
              {/* ------------------------------------------- */}
              <SidebarItems />
            </Scrollbar>
            {/* <Profile /> */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 1,
                borderTop: "2px solid rgb(3, 14, 21)",
              }}
            >
              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={() => dispatch(toggleSidebar())}
              >
                {customizer.isCollapse ? (
                  <IconChevronRight size="20" color="#f0f0f0" />
                ) : (
                  <IconChevronLeft size="20" color="#f0f0f0" />
                )}
              </IconButton>
            </Box>
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={customizer.isMobileSidebar}
      onClose={() => dispatch(toggleMobileSidebar())}
      variant="temporary"
      PaperProps={{
        sx: {
          width: customizer.SidebarWidth,
          backgroundColor:
            customizer.activeMode === "dark"
              ? customizer.darkBackground900
              : customizer.activeSidebarBg,
          color: customizer.activeSidebarBg === "#ffffff" ? "" : "white",
          border: "0 !important",
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      {/* ------------------------------------------- */}
      {/* Logo */}
      {/* ------------------------------------------- */}
      <Box px={2}>
        <Logo />
      </Box>
      {/* ------------------------------------------- */}
      {/* Sidebar For Mobile */}
      {/* ------------------------------------------- */}
      <SidebarItems />
    </Drawer>
  );
};

export default Sidebar;
