import { useEffect, useState } from "react";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { CardContent, Grid, Typography, Avatar, Box } from "@mui/material";
import BlankCard from "../../../components/shared/BlankCard";
import PartnerEditProfile from "../../../components/partner/profile/PartnerEditProfile";
import { styled } from "@mui/system";
import userimg from "../../../assets/images/profile/Profile.jpeg";
import ViewTextInput from "../../../components/forms/theme-elements/ViewTextInput";
import Spinner from "../../admin/spinner/Spinner";
import { getPartnerProfile } from "../../../api/partner/internal";

const BCrumb = [
  { to: "/customer", title: "Home" },
  { title: "Profile & Settings" },
];

const Profile = () => {
  const [Profile, setProfile] = useState("");
  const [loading, setLoading] = useState(true);

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

  const fetchData = async () => {
    const response = await getPartnerProfile();
    console.log(response);

    if (response.status === 200) {
      setProfile(response.data.partner);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <PageContainer title="Profile & Settings" description="Profile page">
      <Breadcrumb title="Profile & Settings" items={BCrumb} />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <BlankCard>
              <CardContent>
                <div className="d-flex justify-content-between mb-2">
                  <Typography variant="h5" mb={3}>
                    Customer Details
                  </Typography>
                  <PartnerEditProfile
                    Profile={Profile}
                    editSuccess={fetchData}
                  />
                </div>
                <Grid container className="text-align-center">
                  <Grid item xs={12} className="mb-4 fw-bold">
                    <center>
                      <ProfileImage>
                        <Avatar
                          src={
                            Profile.userId?.profile
                              ? Profile.userId?.profile
                              : userimg
                          }
                          alt={userimg}
                          sx={{
                            borderRadius: "50%",
                            width: "100px",
                            height: "100px",
                            border: "4px solid #fff",
                          }}
                        />
                      </ProfileImage>
                    </center>
                  </Grid>
                  <Grid item xs={12} lg={6} px={1}>
                    <ViewTextInput
                      label="Customer Name"
                      value={Profile.userId?.name}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6} px={1}>
                    <ViewTextInput
                      label="Email"
                      value={Profile.userId?.email}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6} px={1}>
                    <ViewTextInput
                      label="Contact Number"
                      value={Profile.userId?.phone}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6} px={1}>
                    <ViewTextInput
                      label="State Name"
                      value={Profile.cityId?.stateId?.stateName}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6} px={1}>
                    <ViewTextInput
                      label="City Name"
                      value={Profile.cityId?.cityName}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6} px={1}>
                    <ViewTextInput label="Address" value={Profile.address} />
                  </Grid>
                  {/* <Grid item xs={12} lg={6} px={1}>
                    <ViewTextInput
                      label="Branch Name"
                      value={Profile.branchName}
                    />
                  </Grid> */}
                  <Grid item xs={12} lg={6} px={1}>
                    <ViewTextInput label="GST" value={Profile.gst} />
                  </Grid>
                </Grid>
              </CardContent>
            </BlankCard>
          </Grid>
        </Grid>
      </CardContent>
    </PageContainer>
  );
};

export default Profile;
