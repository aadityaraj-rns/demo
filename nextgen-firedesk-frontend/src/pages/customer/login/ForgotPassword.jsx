import { useEffect, useState, useRef } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { forgotPassword, verifyOtp } from "../../../api/organization/internal";
import FiredeskLogo from "src/assets/images/logos/firedesk_orange_logo1.png";

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loginID, setLoginID] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpMessage, setOtpMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const isSmDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md")
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const loginIDFromQuery = queryParams.get("loginID");
    if (loginIDFromQuery) {
      setLoginID(loginIDFromQuery);
    }
  }, [location]);

  useEffect(() => {
    // Start countdown if it's greater than 0
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    const response = await forgotPassword(loginID);
    if (response.status === 200) {
      setOtpSent(true);
      setOtpMessage(`OTP sent to ******${response.data.phoneSlice}`);
      setCountdown(60);
    } else {
      setOtpMessage(response.data.message);
      setOtpSent(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    const data = {
      loginID,
      otp: otpCode,
    };
    const response = await verifyOtp(data);
    if (response.status === 200) {
      if (response.data.userType == "partner") {
        navigate("/partner/change-password", {
          state: { user: response.data },
        });
      } else {
        navigate("/change-password", {
          state: { user: response.data },
        });
      }
    } else {
      setOtpMessage(response.data.message);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });
      if (value.length === 1 && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const inputRefs = useRef([]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#4c6fc0",
      }}
    >
      <Card sx={{ width: 400 }}>
        <CardContent>
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
          <Typography variant="h5" gutterBottom align="center">
            Forgot Password
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ position: "relative" }}>
              <TextField
                label="Login ID"
                variant="outlined"
                fullWidth
                value={loginID}
                onChange={(e) => setLoginID(e.target.value)}
                required
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendOtp}
                sx={{
                  position: "absolute",
                  top: "63%",
                  right: 3,
                  transform: "translateY(-50%)",
                }}
                disabled={!loginID || countdown > 0}
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : "Send OTP"}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" align="center" color="#d71b1b">
                {otpMessage}
              </Typography>
            </Grid>
            {otpSent && (
              <>
                <Grid item xs={12}>
                  <Typography variant="body1" align="center" gutterBottom>
                    Enter OTP
                  </Typography>
                  <Grid container spacing={2}>
                    {[0, 1, 2, 3].map((index) => (
                      <Grid item xs={3} key={index}>
                        <TextField
                          id={`otp${index}`}
                          value={otp[index]}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          inputRef={(el) => (inputRefs.current[index] = el)}
                          variant="outlined"
                          inputProps={{
                            maxLength: 1,
                            style: { textAlign: "center", fontSize: "24px" },
                          }}
                          fullWidth
                          error={otp[index] === ""}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item xs={12} sx={{ marginTop: 2 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    disabled={otp.join("").length !== 4}
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
