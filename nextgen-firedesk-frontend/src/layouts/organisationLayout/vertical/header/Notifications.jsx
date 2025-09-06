import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import Scrollbar from "/src/components/custom-scroll/Scrollbar";

import { IconBellRinging } from "@tabler/icons";
import { Stack } from "@mui/system";
import { getMyNotification } from "../../../../api/organization/internal";
import { AlertTriangle, CheckCircle, Clock, Info } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl2, setAnchorEl2] = useState(null);

  const getIconByImportanceColor = (importance) => {
    switch (importance) {
      case "Critical":
        return "text-[#B91C1C]";
      case "Warning":
        return "text-[#FFF7ED]";
      case "Reminder":
        return "text-[#1D4ED8]";
      case "Success":
        return "text-[#047857]";
      default:
        return "text-[#727272]";
    }
  };

  const getIconByImportance = (importance) => {
    const commonProps = { className: "w-fit h-fit" };

    switch (importance) {
      case "Critical":
        return <AlertTriangle {...commonProps} fill="#FEE2E2" />;
      case "Warning":
        return <AlertTriangle {...commonProps} fill="#FFF7ED" />;
      case "Reminder":
        return <Clock {...commonProps} />;
      case "Success":
        return <CheckCircle {...commonProps} fill="#ECFDF5" />;
      default:
        return <Info {...commonProps} fill="#FFFFFF" />;
    }
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const fetchNotification = async () => {
    const response = await getMyNotification();
    if (response.status === 200) {
      setNotifications(response.data);
    }
  };
  useEffect(() => {
    anchorEl2 && fetchNotification();
  }, [anchorEl2]);

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(anchorEl2 && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        {notifications.length > 0 ? (
          <Badge variant="dot" color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>
        ) : (
          <IconBellRinging size="21" stroke="1.5" />
        )}
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "360px",
          },
        }}
      >
        <Stack
          direction="row"
          py={2}
          px={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Notifications</Typography>
          <Chip
            label={`${notifications.length} notifications`}
            color="primary"
            size="small"
          />
        </Stack>
        <Scrollbar sx={{ height: "385px" }}>
          {notifications.map((notification, index) => (
            <Box key={index}>
              <MenuItem sx={{ py: 2, px: 4 }}>
                <Stack direction="row" spacing={2}>
                  <Box>
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center`}
                    >
                      <span
                        className={getIconByImportanceColor(
                          notification.importance
                        )}
                      >
                        {getIconByImportance(notification.importance)}
                      </span>
                    </div>
                    <Typography
                      variant="subtitle2"
                      color="textPrimary"
                      fontWeight={600}
                      noWrap
                      sx={{
                        width: "240px",
                      }}
                    >
                      {notification.title}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      sx={{
                        width: "240px",
                      }}
                      noWrap
                    >
                      {notification.message}
                    </Typography>
                  </Box>
                </Stack>
              </MenuItem>
            </Box>
          ))}
        </Scrollbar>
        {notifications.length > 0 && (
          <Box p={3} pb={1}>
            <Button
              to="/customer/notifications"
              variant="outlined"
              component={Link}
              color="primary"
              fullWidth
            >
              See all Notifications
            </Button>
          </Box>
        )}
      </Menu>
    </Box>
  );
};

export default Notifications;
