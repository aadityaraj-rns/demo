import {
  Box,
  Grid,
  Button,
  Typography,
  Paper,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import loginBgImage from "../../../assets/images/login/login-bg-image.png";
import FiredeskLogo from "../../../assets/images/logos/firedesk_orange_logo.png";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { customerLogin } from "../../../api/organization/internal";
import { setUser } from "../../../store/userSlice";
import { showAlert } from "../../../components/common/showAlert";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginSchema = Yup.object().shape({
    loginID: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      loginID: "",
      password: "",
    },
    enableReinitialize: true,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const data = {
        loginID: values.loginID,
        password: values.password,
      };
      const response = await customerLogin(data);
      if (response.status === 200) {
        if (response.data?.data?.userType == "admin") {
          const admin = {
            _id: response.data.data._id,
            userType: response.data.data.userType,
            name: response.data.data.name,
            phone: response.data.data.phone,
            email: response.data.data.email,
            profile: response.data.data.profile,
            displayName: response.data.data.displayName,
            auth: response.data.auth,
          };
          dispatch(setUser(admin));
          navigate("/");
          showAlert({
            text: `Welcome back to firedesk admin`,
            icon: "success",
          });
        } else {
          const customer = {
            _id: response.data.data._id,
            userType: response.data.data.userType,
            loginID: response.data.data.loginID,
            name: response.data.data.name,
            phone: response.data.data.phone,
            email: response.data.data.email,
            profile: response.data.data.profile,
            auth: response.data.auth,
          };
          dispatch(setUser(customer));
          navigate("/customer");
          showAlert({
            text: `Welcome to Firedesk, Mr./Ms. ${response.data.organization.name}`,
            icon: "success",
          });
        }
      } else {
        showAlert({
          text: response.data.message,
          icon: "error",
        });
      }
    },
  });
  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `url(${loginBgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Content Grid */}
      <Grid container sx={{ height: "100%", position: "relative", zIndex: 2 }}>
        {/* Left Column */}
        <Grid
          item
          xs={6}
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
            flexDirection: "column",
            justifyContent: "space-between",
            pl: 8,
            py: 15,
            color: "#fff",
          }}
        >
          {/* Logo */}
          <Box>
            <img
              src={FiredeskLogo}
              alt="Firedesk Logo"
              style={{ height: 50 }}
            />
          </Box>

          {/* Center Text */}
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Welcome Back!
            </Typography>
            <Typography variant="body1">
              Fire maintenance made smart—track, inspect, and comply anytime,
              anywhere.
            </Typography>
          </Box>

          {/* Learn More Button */}
          <Box>
            <Button
              variant="contained"
              color="primary"
              href="https://firedesk.in/"
              rel="noopener noreferrer"
              target="_blank"
              sx={{
                px: 3,
                py: 0.6,
                borderRadius: 5,
                fontSize: "0.75rem",
                color: "#fff",
                borderColor: "#fff",
                textTransform: "none",
                minWidth: "auto",
              }}
            >
              Learn More
            </Button>
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid
          item
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 4,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: 400,
              bgcolor: "rgba(193, 158, 158, 0.605)",
              color: "white",
              borderRadius: 3,
            }}
          >
            <form onSubmit={formik.handleSubmit}>
              <Typography variant="h2" gutterBottom textAlign="center">
                Sign In
              </Typography>
              <TextField
                id="loginID"
                name="loginID"
                fullWidth
                variant="outlined"
                value={formik.values.loginID}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter login credential"
                error={formik.touched.loginID && Boolean(formik.errors.loginID)}
                helperText={formik.touched.loginID && formik.errors.loginID}
                sx={{
                  mb: 2,
                  input: { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "white" },
                    "&:hover fieldset": { borderColor: "#ddd" },
                    "&.Mui-focused fieldset": { borderColor: "#fff" },
                  },
                  "& .MuiFormHelperText-root": { color: "red" },
                }}
              />
              <TextField
                id="password"
                name="password"
                fullWidth
                variant="outlined"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                sx={{
                  input: {
                    color: "white",
                    // Hide default browser eye icon
                    "&::-ms-reveal": { display: "none" },
                    "&::-webkit-credentials-auto-fill-button": {
                      visibility: "hidden",
                    },
                    "&::placeholder": { color: "rgba(255,255,255,0.6)" },
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "white" },
                    "&:hover fieldset": { borderColor: "#ddd" },
                    "&.Mui-focused fieldset": { borderColor: "#fff" },
                  },
                  "& .MuiFormHelperText-root": { color: "red" },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        sx={{ color: "white" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Stack
                justifyContent="space-between"
                direction="row"
                alignItems="center"
                my={2}
              >
                <Box flexGrow={1}></Box>
                <Typography
                  component={Link}
                  to={`/forgot-password?loginID=${formik.values.loginID}`}
                  fontWeight="500"
                  sx={{ textDecoration: "none", color: "white" }}
                >
                  Forgot Password?
                </Typography>
              </Stack>
              <Button variant="contained" size="large" fullWidth type="submit">
                {formik.isSubmitting ? "Submitting..." : "Sign In"}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
