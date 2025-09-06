import { Box } from "@mui/system";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { IconChevronDown } from "@tabler/icons";
import PropTypes from "prop-types";

const TicketsTab = ({ events }) => {
  return (
    <div className="services-tab-scroll-container">
      {events.length === 0 ? (
        <p>No events for this date.</p>
      ) : (
        events.map((event, index) => (
          <Box
            key={index}
            sx={{
              border: "1px solid",
              borderColor: "grey.400",
              borderRadius: 1,
              padding: 2,
              boxShadow: 5,
              marginTop: 2,
            }}
          >
            <Typography>
              <span className="fw-bold text-capitalize">Ticket Id: </span>
              {event.ticketId}
            </Typography>
            <Typography>
              <span className="fw-bold text-capitalize">Description: </span>
              {event.taskDescription}
            </Typography>
            <span className="fw-bold text-capitalize">Tasks: </span>
            {event.taskNames.map((task, index) => (
              <li key={index}>{task}</li>
            ))}

            <Accordion>
              <AccordionSummary
                expandIcon={<IconChevronDown />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h6">Assets</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {event.assetsId.map((asset, index) => (
                  <div key={index} className="event-item">
                    <div className="row">
                      <div className="col-lg-9">
                        <strong>{asset.assetId}</strong>
                        <Typography>
                          Technician Name:{" "}
                          <span className="fw-bold text-capitalize">
                            {[
                              ...new Set(
                                asset.technicianUserId?.map((t) => t.name)
                              ),
                            ].join(", ")}
                          </span>
                        </Typography>
                        <Typography>
                          product Name:{" "}
                          <span className="fw-bold text-capitalize">
                            {asset.productId.productName}
                          </span>
                        </Typography>
                        <Typography>
                          Building:{" "}
                          <span className="fw-bold text-capitalize">
                            {asset.building}
                          </span>
                        </Typography>
                        <Typography>
                          Location:{" "}
                          <span className="fw-bold text-capitalize">
                            {asset.location}
                          </span>
                        </Typography>
                      </div>
                    </div>
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>
          </Box>
        ))
      )}
    </div>
  );
};

TicketsTab.propTypes = {
  events: PropTypes.array,
};

export default TicketsTab;
