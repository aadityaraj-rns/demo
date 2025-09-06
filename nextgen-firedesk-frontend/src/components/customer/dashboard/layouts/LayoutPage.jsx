import { Box, Divider, IconButton, Tab, Tabs, Typography } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import AddLayout from "./AddLayout";
import PropTypes from "prop-types";
import ZoomableImageWithMarkers from "./ZoomableImageWithMarkers";
import { useEffect, useState } from "react";
import { getLayoutsByPlant } from "../../../../api/organization/internal";
import { useLocation, useNavigate } from "react-router-dom";
import { FullscreenExit, OpenInNew } from "@mui/icons-material";

export default function LayoutPage({ selectedPlantId }) {
  const [layouts, setLayout] = useState([]);
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isFullPageView = location.pathname.includes("/customer/plant-layouts/");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getLayoutsByPlant(selectedPlantId);
      if (response.status === 200) {
        setLayout(response.data.layouts);
        if (response.data.layouts.length > 0) {
          setValue(response.data.layouts[0].layoutName);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openInNewPage = () => {
    if (isFullPageView) {
      navigate(-1);
    } else {
      navigate(`/customer/plant-layouts/${selectedPlantId}`);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        height: "100vh",
        p: 1,
        overflow: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <TabContext value={value}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {layouts.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Typography variant="body2">{tab.layoutName}</Typography>
                }
                value={tab.layoutName}
              />
            ))}
          </Tabs>
          <Box gap={1} display="flex">
            <IconButton onClick={openInNewPage}>
              {isFullPageView ? <FullscreenExit /> : <OpenInNew />}
            </IconButton>
            <AddLayout
              selectedPlantId={selectedPlantId}
              fetchPlats={fetchData}
            />
          </Box>
        </Box>
        <Divider sx={{ border: "1px solid", borderColor: "#ddd6d6" }} />
        {layouts.map((panel, index) => (
          <TabPanel key={index} value={panel.layoutName} sx={{ p: 0 }}>
            <ZoomableImageWithMarkers
              imageUrl={panel?.layoutImage}
              selectedPlantId={selectedPlantId}
              layoutName={panel.layoutName}
            />
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}

LayoutPage.propTypes = {
  selectedPlantId: PropTypes.any,
};
