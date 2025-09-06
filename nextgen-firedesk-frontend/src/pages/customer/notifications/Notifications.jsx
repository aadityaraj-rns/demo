import React, { useEffect, useState } from "react";
import { getMyNotification } from "../../../api/organization/internal";
import { Box, Card, MenuItem, Stack, Typography } from "@mui/material";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { formatDate } from "../../../utils/helpers/formatDate";
import Spinner from "../../admin/spinner/Spinner";

const BCrumb = [
  {
    to: "/customer",
    title: "Home",
  },
  {
    title: "Notification",
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchNotification = async () => {
    setLoading(true);
    const response = await getMyNotification();
    if (response.status === 200) {
      setNotifications(response.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchNotification();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  
  return (
    <PageContainer
      title="Notification"
      description="this is Notification Table page"
    >
      <Breadcrumb title="Notification" items={BCrumb} />
      {notifications.map((notification, index) => (
        <Box key={index} display="flex" justifyContent="center">
          <MenuItem sx={{ py: 2, px: 4 }}>
            <Card>
              <Stack direction="row" spacing={2}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="textPrimary"
                    fontWeight={600}
                    noWrap
                  >
                    {notification.title}
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle2" noWrap>
                    {notification.message}
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle2" noWrap>
                    {formatDate(notification.createdAt)}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </MenuItem>
        </Box>
      ))}
    </PageContainer>
  );
};

export default Notifications;
