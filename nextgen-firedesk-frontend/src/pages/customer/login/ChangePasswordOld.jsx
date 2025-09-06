import  {  useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { changePassword } from "../../../api/organization/internal";
import FiredeskLogo from "src/assets/images/logos/firedesk_orange_logo1.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ChangePasswordOld = () => {
  const isSmDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md")
  );
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // useEffect(() => {
  //   if (!user || !user?.loginID) {
  //     if (user?.userType == "admin") {
  //       navigate("/forgot-password");
  //     }
  //     navigate("/customer/forgot-password");
  //   }
  // }, [user, navigate]);

  const handlePasswordChange = async () => {
    if (newPassword === confirmPassword) {
      const data = {
        loginID: user?.loginID,
        newPassword,
      };
      const response = await changePassword(data);
      if (response.status === 200) {
        if (response.data.user?.userType == "partner") {
          navigate("/partner/login", {
            state: { success: response.data.message },
          });
        } else {
          navigate("/login", {
            state: { success: response.data.message },
          });
        }
      } else {
        setErrorMessage(
          response.data.message || "An error occurred. Please try again."
        );
      }
    } else {
      setErrorMessage("Passwords do not match");
    }
  };

  const isFormValid =
    newPassword && confirmPassword && newPassword === confirmPassword;

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
          <Typography variant="h5" align="center">
            Change Password
          </Typography>
          {user?.message && (
            <Typography
              variant="body1"
              align="center"
              sx={{ my: 2, color: "green" }}
            >
              {user?.message} for {user?.loginID}
            </Typography>
          )}

          {errorMessage && (
            <Typography
              variant="body1"
              align="center"
              sx={{ my: 2, color: "red" }}
            >
              {errorMessage}
            </Typography>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ position: "relative" }}>
              <TextField
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)} // Toggle visibility
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ position: "relative" }}>
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 2 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handlePasswordChange}
                sx={{ mt: 2 }}
                disabled={!isFormValid}
              >
                Change Password
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangePasswordOld;
