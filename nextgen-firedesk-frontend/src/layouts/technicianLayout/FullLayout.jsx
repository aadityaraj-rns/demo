import { styled, Container, Box, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import Header from "./vertical/header/Header";
// import HorizontalHeader from "../full/horizontal/header/Header";
import Sidebar from "./vertical/sidebar/Sidebar";
// import Customizer from './shared/customizer/Customizer';
// import Navigation from './horizontal/navbar/Navbar';

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  width: "100%",
  backgroundColor: "transparent",
  overflow: "hidden",
}));

const FullLayout = () => {
  const customizer = useSelector((state) => state.customizer);

  const theme = useTheme();

  return (
    <MainWrapper
      className={
        customizer.activeMode === "dark" ? "darkbg mainwrapper" : "mainwrapper"
      }
    >
      {customizer.isHorizontal ? "" : <Sidebar />}

      <PageWrapper
        className="page-wrapper"
        sx={{
          ...(customizer.isCollapse && {
            [theme.breakpoints.up("lg")]: {
              ml: `${customizer.MiniSidebarWidth}px`,
            },
          }),
        }}
      >
        {/* {customizer.isHorizontal ? <HorizontalHeader /> : <Header />} */}
        <Header />

        {/* {customizer.isHorizontal ? <Navigation /> : ''} */}
        {/* <Container
          sx={{
            maxWidth: "100%!important",
          }}
        > */}
        <Box sx={{ minHeight: "calc(100vh - 170px)", marginTop: "30px" }}>
          <Outlet />
        </Box>
        {/* </Container> */}
        {/* <Customizer /> */}
      </PageWrapper>
    </MainWrapper>
  );
};

export default FullLayout;
