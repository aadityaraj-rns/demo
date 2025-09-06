import { Box, Container, Typography, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import ErrorImg from "src/assets/images/backgrounds/errorimg.svg";

const Error = () => {
  const location = useLocation();

  // Determine where to redirect based on the current URL
  let redirectTo = "/";
  if (location.pathname.startsWith("/customer")) {
    redirectTo = "/customer";
  } else if (location.pathname.startsWith("/technician")) {
    redirectTo = "/technician";
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      textAlign="center"
      justifyContent="center"
    >
      <Container maxWidth="md">
        <img src={ErrorImg} alt="404" style={{ margin: "0 auto" }} />
        <Typography align="center" variant="h1" mb={4}>
          Opps!!!
        </Typography>
        <Typography align="center" variant="h4" mb={4}>
          This page you are looking for could not be found.
        </Typography>
        <Button
          color="primary"
          variant="contained"
          component={Link}
          to={redirectTo}
          disableElevation
        >
          Go Back to Home
        </Button>
      </Container>
    </Box>
  );
};

export default Error;
