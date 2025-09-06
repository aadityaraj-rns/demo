import { useEffect, useState } from "react";
import PageContainer from "../../../components/container/PageContainer";
import CustomCalendar from "../../../components/calendar/Calendar";
import { getServiceSchedules } from "../../../api/organization/internal";
import { Divider } from "@mui/material";
import ServiceDetails from "./ServiceDetails";

const Services = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchEvents = async (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const response = await getServiceSchedules(year, month);
    if (response.status === 200) {
      setEvents(response.data);
    }
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
    fetchEvents(newDate);
  };

  useEffect(() => {
    fetchEvents(currentDate);
  }, []);

  return (
    <PageContainer title="Service" description="this is Service Table page">
      <CustomCalendar events={events} onNavigate={handleNavigate} />
      <Divider sx={{ borderColor: "gray", borderWidth: 1, my: 2 }} />
      <ServiceDetails />
    </PageContainer>
  );
};

export default Services;
