import { useEffect, useState } from "react";
import PageContainer from "../../../components/container/PageContainer";
import { CardContent, Grid, Typography } from "@mui/material";
import BlankCard from "../../../components/shared/BlankCard";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import Toaster from "../../../components/toaster/Toaster";
import EditProfile from "../../../components/admin/profileandsetting/EditProfile.jsx";
import { getAdminProfile } from "../../../api/admin/internal.js";
import Spinner from "../spinner/Spinner.jsx";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Profile & Settings",
  },
];

const ProfileAndSettings = () => {
  const [admin, setAdmin] = useState("");
  const [loading, setLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const fetchData = async () => {
    try {
      const response = await getAdminProfile();
      if (response.status === 200) {
        setAdmin(response.data.admin);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <PageContainer
      title="Profile & Settings"
      description="this is Account Settings page"
    >
      <Breadcrumb title="Profile & Settings" items={BCrumb} />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <BlankCard>
              <CardContent>
                <div className="d-flex justify-content-between mb-2">
                  <Typography variant="h5" mb={3}>
                    Personal Details
                  </Typography>
                  <EditProfile
                    admin={admin}
                    setUpdateSuccess={setUpdateSuccess}
                    editSuccess={fetchData}
                  />
                </div>
                <form>
                  <Grid container className="text-align-center">
                    <Grid item xs={5} className="mb-4 fw-bold">
                      <center>
                        <img
                          src={admin.profile}
                          alt="profile image"
                          style={{ height: "20vh", width: "20vh" }}
                          className="rounded-circle"
                        />
                      </center>
                    </Grid>
                    <Grid item xs={7} className="mb-4"></Grid>

                    <Grid item xs={3} className="mb-4 fw-bold">
                      Full Name
                    </Grid>
                    <Grid item xs={1} className="mb-4 fw-bold">
                      :
                    </Grid>
                    <Grid item xs={8} className="mb-4 fw-bold">
                      {admin.name}
                    </Grid>

                    <Grid item xs={3} className="mb-4 fw-bold">
                      Display Name
                    </Grid>
                    <Grid item xs={1} className="mb-4 fw-bold">
                      :
                    </Grid>
                    <Grid item xs={8} className="mb-4 fw-bold">
                      {admin.displayName}
                    </Grid>

                    <Grid item xs={3} className="mb-4 fw-bold">
                      Contact Number
                    </Grid>
                    <Grid item xs={1} className="mb-4 fw-bold">
                      :
                    </Grid>
                    <Grid item xs={8} className="mb-4 fw-bold">
                      {admin.phone}
                    </Grid>

                    <Grid item xs={3} className="mb-4 fw-bold">
                      Email
                    </Grid>
                    <Grid item xs={1} className="mb-4 fw-bold">
                      :
                    </Grid>
                    <Grid item xs={8} className="mb-4 fw-bold">
                      {admin.email}
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </BlankCard>
          </Grid>
        </Grid>
      </CardContent>
      {updateSuccess && (
        <Toaster
          title="Admin Details"
          message="Updated successfully"
          color="success"
        />
      )}
    </PageContainer>
  );
};

export default ProfileAndSettings;
