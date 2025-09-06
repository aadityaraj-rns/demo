import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { customerLogin } from "../../../api/organization/internal";
import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
import { setUser } from "../../../store/userSlice";
import { showAlert } from "../../../components/common/showAlert";

const loginSchema = Yup.object().shape({
  loginID: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

const AuthLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
        const customer = {
          _id: response.data.organization._id,
          userType: response.data.organization.userType,
          loginID: response.data.organization.loginID,
          name: response.data.organization.name,
          phone: response.data.organization.phone,
          email: response.data.organization.email,
          profile: response.data.organization.profile,
          auth: response.data.auth,
        };
        dispatch(setUser(customer));
        navigate("/customer");
        showAlert({
          text: `Welcome to Firedesk, Mr./Ms. ${response.data.organization.name}`,
          icon: "success",
        });
      } else {
        showAlert({
          text: response.data.message,
          icon: "error",
        });
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <Box px={10}>
            <CustomTextField
              color="secondary"
              id="loginID"
              name="loginID"
              placeholder="Enter loginID/Mobile"
              value={formik.values.loginID}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              variant="outlined"
              fullWidth
              error={formik.touched.loginID && Boolean(formik.errors.loginID)}
              sx={{
                backgroundColor: "white",
                width: "100%",
                my: 4,
                borderRadius: "8px",
              }}
            />
            {formik.touched.loginID && formik.errors.loginID && (
              <Typography color="white" variant="caption">
                {formik.errors.loginID}
              </Typography>
            )}
            <CustomTextField
              color="secondary"
              id="password"
              name="password"
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              variant="outlined"
              fullWidth
              error={formik.touched.password && Boolean(formik.errors.password)}
              sx={{
                backgroundColor: "white",
                width: "100%",
                mb: 2,
                borderRadius: "8px",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {formik.touched.password && formik.errors.password && (
              <Typography color="white" variant="caption">
                {formik.errors.password}
              </Typography>
            )}
            <Stack
              justifyContent="space-between"
              direction="row"
              alignItems="center"
              my={2}
            >
              <Box flexGrow={1}></Box>
              <Typography
                component={Link}
                to={`/customer/forgot-password?loginID=${formik.values.loginID}`}
                fontWeight="500"
                sx={{ textDecoration: "none", color: "white" }}
              >
                Forgot Password?
              </Typography>
            </Stack>
            <Button
              variant="contained"
              size="large"
              fullWidth
              type="submit"
              disabled={
                !formik.values.loginID ||
                !formik.values.password ||
                !!formik.errors.loginID ||
                !!formik.errors.password ||
                formik.isSubmitting
              }
              sx={{
                backgroundColor: "#7a96d5 !important", // Enforcing background color
                color: "#ffffff !important", // Enforcing text color
                "&:hover": {
                  backgroundColor: "#5b7db7 !important", // Custom hover background color
                },
              }}
            >
              {formik.isSubmitting ? "Submitting..." : "Sign In"}
            </Button>
          </Box>
        </Stack>
      </form>
    </>
  );
};

export default AuthLogin;
