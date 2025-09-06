import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ServicesTab = ({ events }) => {
  return (
    <Box className="services-tab-scroll-container">
      {events.length === 0 ? (
        <Typography>No events for this date.</Typography>
      ) : (
        <>
          {events.map((groupItem, idx) => (
            <Box key={`group-${idx}`} className="event-item">
              {groupItem.individualService ? (
                <Link
                  to={`/customer/assets`}
                  // sx={{ color: "blue", fontSize: "12px" }}
                >
                  <strong>{groupItem?.assetsId[0]?.assetId}</strong>
                </Link>
              ) : (
                <Link
                  to={`/customer/group-service`}
                  // sx={{ color: "blue", fontSize: "12px" }}
                >
                  <strong>
                    {groupItem?.groupServiceId?.groupId}(
                    {groupItem?.groupServiceId?.groupName})
                  </strong>
                </Link>
              )}
              <Typography fontSize="12px">
                serviceType:{" "}
                <span className="fw-bold text-capitalize">
                  {groupItem?.serviceType}
                </span>
              </Typography>
              <Typography fontSize="12px">
                Assets:{" "}
                <span className="fw-bold text-capitalize">
                  {groupItem?.assetsId?.map((a) => a?.assetId).join(", ")}
                </span>
              </Typography>
              <Typography fontSize="12px">
                Plant:{" "}
                <span className="fw-bold text-capitalize">
                  {groupItem?.plantId?.plantName}
                </span>
              </Typography>
              {/* Add more group fields if needed */}
            </Box>
          ))}
        </>
      )}
    </Box>
  );
};

ServicesTab.propTypes = {
  events: PropTypes.array.isRequired,
  filteredGoupServiceData: PropTypes.array.isRequired,
};

export default ServicesTab;
