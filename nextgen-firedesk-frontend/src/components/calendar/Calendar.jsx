import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import calendar CSS
import { format } from "date-fns";
import "./CalendarStyles.css"; // Custom styles for the calendar
import PageContainer from "../container/PageContainer";
import { Tab, Tabs, Box, Grid, Typography } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import ServicesTab from "./ServicesTab";
import TicketsTab from "./TicketsTab";
import AddTickets from "../customer/tickets/AddTickets";
import PropTypes from "prop-types";

const CustomCalendar = ({ events, onNavigate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Handle date click on the calendar
  const handleDateChange = (date) => setSelectedDate(date);

  const handleActiveStartDateChange = ({ activeStartDate }) => {
    onNavigate(activeStartDate); // Trigger onNavigate with the new start date of the month
  };

  // Filter events based on the selected date
  const filteredEvents = events.filter(
    (event) =>
      format(event.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );
  const filteredAssets = filteredEvents
    .map((event) => event.serviceDatas)
    .flat();
  // const filteredGoupServiceData = filteredEvents
  //   .map((event) => event.groupServiceData)
  //   .flat();
  const filteredTickets = filteredEvents.map((event) => event.tickets).flat();

  // Define tabs inside the component to access filtered events
  const COMMON_TAB = [
    {
      value: "1",
      label: "SERVICE",
      disabled: false,
      content: (
        <ServicesTab
          events={filteredAssets}
          // filteredGoupServiceData={filteredGoupServiceData}
        />
      ), // Pass filtered events to ServicesTab
    },
    {
      value: "2",
      label: "TICKET",
      disabled: false,
      content: <TicketsTab events={filteredTickets} />, // Pass filtered events to TicketsTab
    },
  ];

  return (
    <PageContainer title="Calendar" description="This is the Calendar page">
      <Grid container spacing={3} style={{ padding: "20px" }}>
        {/* Legend/Instructions Section */}

        {/* Calendar Section */}

        <Grid item xs={12} md={8}>
          <Box>
            <Typography
              variant="h6"
              textAlign="center"
              fontWeight="bold"
              mb={1}
            >
              SERVICE CALENDAR
            </Typography>
          </Box>

          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
            view="month"
            onClickDay={(value) => handleDateChange(value)}
            onActiveStartDateChange={handleActiveStartDateChange}
            tileContent={({ date, view }) => {
              if (view === "month") {
                const dayEvents = events.filter(
                  (event) =>
                    format(event.date, "yyyy-MM-dd") ===
                    format(date, "yyyy-MM-dd")
                );

                if (dayEvents.length) {
                  const hasAssets = dayEvents.some(
                    (event) =>
                      event.serviceDatas && event.serviceDatas.length > 0
                  );
                  const hasTickets = dayEvents.some(
                    (event) => event.tickets && event.tickets.length > 0
                  );

                  let dotColor = "";

                  if (hasAssets && hasTickets) {
                    dotColor = "green";
                  } else if (hasAssets) {
                    dotColor = "red";
                  } else if (hasTickets) {
                    dotColor = "blue";
                  }

                  return (
                    <div
                      className="calendar-event-dot"
                      style={{ backgroundColor: dotColor }}
                    ></div>
                  );
                }
                return null;
              }
            }}
          />
          <Grid item xs={12} mt={1}>
            <Box display="flex" flexWrap="wrap" gap={3}>
              <Box display="flex" alignItems="center" ml="auto">
                <Box
                  sx={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    backgroundColor: "green",
                    borderRadius: "50%",
                    marginRight: 1,
                  }}
                />
                <Typography variant="body2">Service and Ticket</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    backgroundColor: "red",
                    borderRadius: "50%",
                    marginRight: 1,
                  }}
                />
                <Typography variant="body2">Service</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    backgroundColor: "blue",
                    borderRadius: "50%",
                    marginRight: 1,
                  }}
                />
                <Typography variant="body2">Ticket</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Tab Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            {format(selectedDate, "MMMM do, yyyy")}
          </Typography>
          <TabContext value={value}>
            <Box display="flex" alignItems="center">
              <Tabs
                variant="scrollable"
                scrollButtons="auto"
                value={value}
                onChange={handleChange}
                aria-label="Calendar Tabs"
              >
                {COMMON_TAB.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={<Typography variant="body2">{tab.label}</Typography>}
                    value={tab.value}
                    disabled={tab.disabled}
                  />
                ))}
              </Tabs>
              <AddTickets
                name="Ticket"
                onTicketAdded={() => {
                  console.log("Ticket added");
                }}
              />
            </Box>
            <Box mt={2}>
              {COMMON_TAB.map((panel) => (
                <TabPanel
                  key={panel.value}
                  value={panel.value}
                  sx={{ padding: 1 }}
                >
                  {panel.content}
                </TabPanel>
              ))}
            </Box>
          </TabContext>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

CustomCalendar.propTypes = {
  events: PropTypes.array,
  onNavigate: PropTypes.func,
};
export default CustomCalendar;
