import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Grid,
  TextField,
  useMediaQuery,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomFormLabel from "../../../components/forms/theme-elements/CustomFormLabel";
import { setUser } from "../../../store/userSlice";
import Toaster from "../../../components/toaster/Toaster";
import {
  registerCheck,
  technicianLogin,
} from "../../../api/technician/internal";
import FiredeskLogo from "src/assets/images/logos/firedesk_orange_logo1.png";

const loginSchema = Yup.object().shape({
  contactNo: Yup.string()
    .matches(/^\d{10}$/, "Contact number must be exactly 10 digits")
    .required("Required"),
  otp0: Yup.string()
    .length(1, "OTP should be 1 digit")
    .matches(/^[0-9]+$/, "OTP should contain only digits")
    .required("Required"),
  otp1: Yup.string()
    .length(1, "OTP should be 1 digit")
    .matches(/^[0-9]+$/, "OTP should contain only digits")
    .required("Required"),
  otp2: Yup.string()
    .length(1, "OTP should be 1 digit")
    .matches(/^[0-9]+$/, "OTP should contain only digits")
    .required("Required"),
  otp3: Yup.string()
    .length(1, "OTP should be 1 digit")
    .matches(/^[0-9]+$/, "OTP should contain only digits")
    .required("Required"),
});

const AuthLogin = () => {
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const isSmDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md")
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      contactNo: "",
      otp0: "",
      otp1: "",
      otp2: "",
      otp3: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const otp = `${values.otp0}${values.otp1}${values.otp2}${values.otp3}`;

      const data = {
        contactNo: values.contactNo,
        otp: otp,
      };

      const response = await technicianLogin(data);
      if (response.status === 200) {
        const technician = {
          _id: response.data.technician._id,
          userType: response.data.technician.userType,
          name: response.data.technician.name,
          phone: response.data.technician.phone,
          email: response.data.technician.email,
          loginID: response.data.technician.loginID,
          profile: response.data.technician.profile,
          auth: response.data.auth,
        };
        dispatch(setUser(technician));

        navigate("/technician");
      } else {
        setError(response.data.msg);
        setTimeout(() => setError(false), 6000);
      }
    },
  });

  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      formik.setFieldValue(`otp${index}`, value);
      if (value.length === 1 && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !formik.values[`otp${index}`] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    const data = {
      contactNo: formik.values.contactNo,
    };
    const response = await registerCheck(data);
    if (response.status === 200) {
      setOtpSent(true);
      setOtpMessage(response.data.message);
      setCountdown(60);
    } else {
      setOtpMessage(response.data.message);
      setOtpSent(false);
    }
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Stack>
          <Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={isSmDown ? 2 : isTablet ? 3 : 4}
            >
              <img
                src={FiredeskLogo}
                alt="Logo"
                style={{
                  height: isSmDown ? "50px" : isTablet ? "60px" : "60px",
                  width: isSmDown ? "30vw" : isTablet ? "20vw" : "10vw",
                  overflow: "hidden",
                }}
              />
            </Box>
            <CustomFormLabel htmlFor="contactNo">
              Technician Number
            </CustomFormLabel>
            <TextField
              id="contactNo"
              name="contactNo"
              placeholder="Enter contact number"
              value={formik.values.contactNo}
              onChange={(e) => {
                const { value } = e.target;
                if (/^\d*$/.test(value) && value.length <= 10) {
                  formik.handleChange(e);
                }
              }}
              onBlur={formik.handleBlur}
              inputProps={{
                maxLength: 10,
                style: { fontSize: "24px" },
              }}
              type="text"
              variant="outlined"
              fullWidth
              InputProps={{
                endAdornment: (
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      whiteSpace: "nowrap",
                      textTransform: "none",
                    }}
                    onClick={handleSendOtp}
                    disabled={!formik.values.contactNo || countdown > 0}
                  >
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : "Send OTP"}

                    {/* Send OTP */}
                  </Button>
                ),
              }}
              error={
                formik.touched.contactNo && Boolean(formik.errors.contactNo)
              }
              helperText={formik.touched.contactNo && formik.errors.contactNo}
            />
          </Box>
          <Grid item xs={12}>
            <Typography variant="body1" align="center" color="#d71b1b">
              {otpMessage}
            </Typography>
          </Grid>
          <Box>
            <CustomFormLabel htmlFor="otp">OTP</CustomFormLabel>
            <Grid container spacing={2}>
              {[0, 1, 2, 3].map((index) => (
                <Grid item xs={3} key={index}>
                  <TextField
                    id={`otp${index}`}
                    name={`otp${index}`}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    value={formik.values[`otp${index}`]}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    variant="outlined"
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: "center", fontSize: "24px" },
                    }}
                    error={
                      formik.touched[`otp${index}`] &&
                      Boolean(formik.errors[`otp${index}`])
                    }
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>
            {/* No need for formik.errors.otp here, check for individual fields */}
          </Box>
        </Stack>
        <Box mt={4}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={
              !formik.values.contactNo ||
              !formik.values.otp0 ||
              !formik.values.otp1 ||
              !formik.values.otp2 ||
              !formik.values.otp3 ||
              !!formik.errors.contactNo ||
              !!formik.errors.otp0 ||
              !!formik.errors.otp1 ||
              !!formik.errors.otp2 ||
              !!formik.errors.otp3 ||
              formik.isSubmitting
            }
          >
            {formik.isSubmitting ? "Submitting..." : "Log In"}
          </Button>
        </Box>
      </form>
      {error && <Toaster title="Login" message={error} color="error" />}
    </>
  );
};

export default AuthLogin;
