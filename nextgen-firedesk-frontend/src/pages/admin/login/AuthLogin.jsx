// import { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Stack,
//   InputAdornment,
//   IconButton,
// } from "@mui/material";
// import { Link, useLocation } from "react-router-dom";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { login } from "../../../api/admin/internal";
// import { Visibility, VisibilityOff } from "@mui/icons-material";

// import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
// import { setUser } from "../../../store/userSlice";
// import { showAlert } from "../../../components/common/showAlert";

// const loginSchema = Yup.object().shape({
//   email: Yup.string().email("Invalid email").required("Required"),
//   password: Yup.string().required("Required"),
// });

// const AuthLogin = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const location = useLocation();

//   const message = location.state?.success;

//   useEffect(() => {
//     if (message) {
//       showAlert({
//         text: message,
//         icon: "success",
//       });
//       setTimeout(() => {
//         window.history.replaceState({}, document.title);
//       }, 6000);
//     }
//   }, [message]);

//   const handleClickShowPassword = () => setShowPassword(!showPassword);

//   const handleMouseDownPassword = (event) => event.preventDefault();

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema: loginSchema,
//     onSubmit: async (values) => {
//       const data = {
//         email: values.email,
//         password: values.password,
//       };
//       const response = await login(data);
//       if (response.status === 200) {
//         const admin = {
//           _id: response.data.admin._id,
//           userType: response.data.admin.userType,
//           name: response.data.admin.name,
//           phone: response.data.admin.phone,
//           email: response.data.admin.email,
//           profile: response.data.admin.profile,
//           displayName: response.data.admin.displayName,
//           auth: response.data.auth,
//         };
//         dispatch(setUser(admin));
//         navigate("/");
//         showAlert({
//           text: `Welcome back to firedesk admin`,
//           icon: "success",
//         });
//       } else {
//         showAlert({
//           text: response.data.message,
//           icon: "error",
//         });
//       }
//     },
//   });
//   return (
//     <Box sx={{ width: "100%", maxWidth: "400px", mx: "auto" }}>
//       <form onSubmit={formik.handleSubmit}>
//         <Stack spacing={2} px={8}>
//           {/* Email Input */}
//           <CustomTextField
//             color="secondary"
//             id="email"
//             name="email"
//             placeholder="Enter your email"
//             value={formik.values.email}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             type="text"
//             variant="outlined"
//             fullWidth
//             error={formik.touched.email && Boolean(formik.errors.email)}
//             InputProps={{
//               sx: {
//                 backgroundColor: "white",
//                 borderRadius: "8px",
//               },
//             }}
//             helperText={formik.touched.email && formik.errors.email}
//           />

//           <CustomTextField
//             color="secondary"
//             id="password"
//             name="password"
//             placeholder="Enter your password"
//             type={showPassword ? "text" : "password"}
//             value={formik.values.password}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             variant="outlined"
//             fullWidth
//             error={formik.touched.password && Boolean(formik.errors.password)}
//             helperText={formik.touched.password && formik.errors.password}
//             InputProps={{
//               sx: {
//                 backgroundColor: "white",
//                 borderRadius: "8px",
//               },
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={handleClickShowPassword}
//                     onMouseDown={handleMouseDownPassword}
//                     edge="end"
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <Stack
//             justifyContent="space-between"
//             direction="row"
//             alignItems="center"
//             my={2}
//           >
//             <Box flexGrow={1}></Box>
//             <Typography
//               component={Link}
//               to="/forgot-password"
//               fontWeight="500"
//               sx={{ textDecoration: "none", color: "white" }}
//             >
//               Forgot Password?
//             </Typography>
//           </Stack>
//           {/* Submit Button */}
//           <Button
//             variant="contained"
//             size="large"
//             fullWidth
//             type="submit"
//             disabled={
//               !formik.values.email ||
//               !formik.values.password ||
//               !!formik.errors.email ||
//               !!formik.errors.password ||
//               formik.isSubmitting
//             }
//             sx={{
//               backgroundColor: "#2d55b1 !important",
//               color: "#ffffff !important",
//               "&:hover": {
//                 backgroundColor: "#43464b !important",
//               },
//             }}
//           >
//             {formik.isSubmitting ? "Submitting..." : "Sign In"}
//           </Button>
//         </Stack>
//       </form>
//     </Box>
//   );
// };

// export default AuthLogin;
