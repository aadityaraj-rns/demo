// import { Avatar, Box, Button, Grid, Paper, styled } from "@mui/material";
// import PageContainer from "../../../components/container/PageContainer";
// import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
// import * as Yup from "yup";
// import { useFormik } from "formik";
// import { useEffect, useState } from "react";
// import {
//   editCustomerProfile,
//   getOrgProfile,
// } from "../../../api/organization/internal";
// import userimg from "../../../assets/images/profile/Profile.jpeg";
// import { showAlert } from "../../../components/common/showAlert";
// import { useDispatch } from "react-redux";
// import { setUser } from "../../../store/userSlice";
// import Spinner from "../../admin/spinner/Spinner";
// import FormikTextField from "../../../components/common/InputBox/FormikTextField";

// const BCrumb = [{ to: "/customer", title: "Home" }, { title: "Profile" }];

// const Profile = () => {
//   const [orgProfile, setOrgProfile] = useState("");
//   const [imageSrc, setImageSrc] = useState("");
//   const [loading, setLoading] = useState(true);
//   const dispatch = useDispatch();

//   const ProfileImage = styled(Box)(() => ({
//     backgroundImage: "linear-gradient(#50b2fc,#f44c66)",
//     borderRadius: "50%",
//     width: "110px",
//     height: "110px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     margin: "0 auto",
//   }));

//   const fetchData = async () => {
//     setLoading(true);
//     const response = await getOrgProfile();
//     if (response.status === 200) {
//       setOrgProfile(response.data.organization);
//       setImageSrc(response.data.organization.userId.profile);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);
//   const schema = Yup.object({
//     name: Yup.string()
//       .min(3, "Name must be at least 3 characters")
//       .required("Name is required"),
//     contactNo: Yup.string()
//       .matches(/^\d{10,15}$/, "Contact must be 10 to 15 digits")
//       .required("Contact is required"),
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     cityId: Yup.string().required("City is required"),
//     address: Yup.string()
//       .min(5, "Address must be at least 5 characters")
//       .required("Address is required"),
//     gst: Yup.string().notRequired(),
//     pincode: Yup.string()
//       .matches(/^\d{5,6}$/, "Pincode must be 5 or 6 digits")
//       .required("Pincode is required"),
//   });

//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       name: orgProfile?.userId?.name || "",
//       contactNo: orgProfile?.userId?.phone || "",
//       email: orgProfile?.userId?.email || "",
//       cityId: orgProfile?.cityId?.cityName || "",
//       address: orgProfile?.address || "",
//       gst: orgProfile?.gst || "",
//       pincode: orgProfile?.pincode || "",
//     },
//     validationSchema: schema,
//     onSubmit: async (values) => {
//       const formData = new FormData();
//       formData.append("_id", orgProfile?.userId?._id);
//       formData.append("userType", orgProfile?.userId?.userType);
//       formData.append("name", values.name);
//       formData.append("phone", values.contactNo);
//       formData.append("email", values.email);
//       if (values.cityId) formData.append("cityId", values.cityId);
//       if (values.address) formData.append("address", values.address);
//       if (values.gst) formData.append("gst", values.gst);
//       if (values.currentPassword)
//         formData.append("currentPassword", values.currentPassword);
//       if (values.newPassword)
//         formData.append("newPassword", values.newPassword);
//       if (values.cNewPassword)
//         formData.append("cNewPassword", values.cNewPassword);
//       if (values.pincode) formData.append("pincode", values.pincode);

//       const profileImageInput = document.getElementById("user-profile-image");
//       const file = profileImageInput.files[0];
//       if (file) {
//         formData.append("profile", file);
//       }

//       try {
//         const response = await editCustomerProfile(formData);
//         if (response && response.status === 200) {
//           showAlert({
//             text: "Profile data updated successfully",
//             icon: "success",
//           });
//           const customer = {
//             _id: response.data.organization?._id,
//             userType: response.data.organization.userType,
//             loginID: response.data.organization.loginID,
//             displayName: response.data.organization.displayName,
//             name: response.data.organization.name,
//             phone: response.data.organization.phone,
//             email: response.data.organization.email,
//             profile: response.data.organization.profile,
//             auth: response.data.auth,
//           };
//           dispatch(setUser(customer));
//         } else {
//           showAlert({
//             text: response.data.message,
//             icon: "error",
//           });
//         }
//       } catch (error) {
//         showAlert({
//           text: error.message,
//           icon: "error",
//         });
//       }
//     },
//   });

//   const handleProfileImageUpload = () => {
//     const profile = document.getElementById("user-profile-image");
//     profile.click();
//   };

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = function (e) {
//         setImageSrc(e.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   if (loading) {
//     return <Spinner />;
//   }

//   return (
//     <PageContainer title="Profile" description="this is Account Settings page">
//       <Breadcrumb title="Profile & Settings" items={BCrumb} />

//       <Paper elevation={3} sx={{ p: 4, maxWidth: 1000, mx: "auto", mt: 4 }}>
//         <form onSubmit={formik.handleSubmit}>
//           <Grid container spacing={1}>
//             <Grid item xs={12} sm={2}>
//               <ProfileImage>
//                 <Avatar
//                   id="profile"
//                   src={imageSrc ? imageSrc : userimg}
//                   alt={userimg}
//                   onClick={handleProfileImageUpload}
//                   sx={{
//                     borderRadius: "50%",
//                     width: "100px",
//                     height: "100px",
//                     border: "4px solid #fff",
//                   }}
//                 />
//               </ProfileImage>
//               <input
//                 type="file"
//                 className="d-none"
//                 accept="image/*"
//                 id="user-profile-image"
//                 onChange={handleImageChange}
//               />
//             </Grid>
//             <Grid item xs={12} sm={10}>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <FormikTextField label="Name" id="name" formik={formik} />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormikTextField
//                     label="Contact Number"
//                     id="contactNo"
//                     formik={formik}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormikTextField label="Email" id="email" formik={formik} />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormikTextField label="GST" id="gst" formik={formik} />
//                 </Grid>

//                 <Grid item xs={12} sm={6}>
//                   <FormikTextField
//                     label="City"
//                     id="cityId"
//                     formik={formik}
//                     InputProps={{
//                       readOnly: true,
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormikTextField
//                     label="Address"
//                     id="address"
//                     formik={formik}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormikTextField
//                     label="Pincode"
//                     id="pincode"
//                     formik={formik}
//                   />
//                 </Grid>
//               </Grid>
//             </Grid>
//             <Grid item xs={12} textAlign="end">
//               <Button variant="contained" type="submit">
//                 Save Changes
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>
//     </PageContainer>
//   );
// };

// export default Profile;
