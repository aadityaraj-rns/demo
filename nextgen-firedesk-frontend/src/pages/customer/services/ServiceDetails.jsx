import React from "react";
import { Tab, Tabs, Typography } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import CompleteService from "../../../components/customer/service/CompleteService";
import LapsedService from "../../../components/customer/service/LapsedService";
import ServiceDue from "../../../components/customer/service/ServiceDue";

const COMMON_TAB = [
  {
    value: "1",
    label: "COMPLETED",
    disabled: false,
    content: <CompleteService />,
  },
  {
    value: "2",
    label: "SERVICE DUE",
    disabled: false,
    content: <ServiceDue />,
  },
  {
    value: "3",
    label: "LAPSED",
    disabled: false,
    content: <LapsedService />,
  },
];

const ServiceDetails = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <TabContext value={value}>
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          value={value}
          onChange={handleChange}
          aria-label="icon tabs example"
          sx={{ margin: "10px" }}
        >
          {COMMON_TAB.map((tab) => (
            <Tab
              key={tab.value}
              label={<Typography variant="body2">{tab.label}</Typography>}
              value={tab.value}
            />
          ))}
        </Tabs>
        {COMMON_TAB.map((panel) => (
          <TabPanel key={panel.value} value={panel.value} sx={{ p: 0 }}>
            {panel.content}
          </TabPanel>
        ))}
      </TabContext>
    </>
  );
};

export default ServiceDetails;
