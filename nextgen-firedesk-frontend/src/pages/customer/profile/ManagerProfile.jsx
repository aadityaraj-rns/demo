import React from "react";
import PageContainer from "../../../components/container/PageContainer";
import { Grid } from "@mui/material";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";

const BCrumb = [
  { to: "/customer", title: "Home" },
  { title: "Profile & Settings" },
];

const ManagerProfile = () => {
  return (
    <PageContainer
      title="Profile & Settings"
      description="this is Account Settings page"
    >
      <Breadcrumb title="Profile & Settings" items={BCrumb} />
      <Grid container></Grid>
    </PageContainer>
  );
};

export default ManagerProfile;
