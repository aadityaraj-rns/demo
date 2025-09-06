import {
  Card,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { ThemeSettings } from "../../../theme/Theme";
import { MoreVert, Refresh } from "@mui/icons-material";
import { useState } from "react";

const DashboardCard = ({ title, children, dropDown = false, fetchData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const theme = ThemeSettings();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ padding: "0px", border: "1px solid #e1cfcf", bgcolor: "#bdcbbd1a" }}>
      <CardHeader
        title={
          <Typography variant="body1" fontWeight={400}>
            {title}
          </Typography>
        }
        sx={{
          px: 1,
          py: 1.5,
          backgroundColor:
            theme.palette.mode === "dark" ? "#2a2a2a" : "#f5f5f5",
          color: theme.palette.mode === "dark" ? "#fff" : "#000",
          fontWeight: "normal",
          borderBottom: "1px solid #e1cfcf",
        }}
        action={
          <>
            {fetchData && (
              <IconButton onClick={fetchData}>
                <Refresh />
              </IconButton>
            )}
            {dropDown && (
              <>
                <IconButton onClick={handleClick}>
                  <MoreVert />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleClose}>Last 3 months</MenuItem>
                  <MenuItem onClick={handleClose}>Last 6 months</MenuItem>
                  <MenuItem onClick={handleClose}>Last 12 months</MenuItem>
                </Menu>
              </>
            )}
          </>
        }
      />

      {children}
    </Card>
  );
};
DashboardCard.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  dropDown: PropTypes.bool,
  fetchData: PropTypes.func,
};

export default DashboardCard;
