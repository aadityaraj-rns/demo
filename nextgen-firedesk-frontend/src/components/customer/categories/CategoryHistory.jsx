import { Close } from "@mui/icons-material";
import {
  Typography,
  Box,
  DialogTitle,
  Dialog,
  IconButton,
  DialogContent,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";

const CategoryHistory = ({ history }) => {
  const [modal, setModal] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const toggle = () => setModal(!modal);

  const toggleExpand = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  if (!history?.length) return <Typography variant="body2"></Typography>;

  return (
    <>
      <Box display="flex" justifyContent="flex-start">
        <Typography onClick={toggle} variant="body2" color={"blue"}>
          History
        </Typography>
      </Box>
      <Dialog
        open={modal}
        onClose={toggle}
        maxWidth="xs"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle
          id="alert-dialog-title"
          variant="body2"
          sx={dialogTitleStyles}
        >
          {"Category History"}
          <IconButton aria-label="close" onClick={toggle}>
            <Close sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 1 }}>
          {history.map((item, index) => {
            const isExpanded = expandedItems[index];
            return (
              <>
                <Box
                  key={item._id || index}
                  sx={{
                    borderRadius: 2,
                    p: 2,
                    my: 1,
                    boxShadow: 2,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    mb={1}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      Editor Name: {item.editedBy?.name || "Unknown User"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(item.editedAt).toLocaleString()}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-line",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: isExpanded ? "unset" : 2,
                    }}
                  >
                    {item.changes}
                  </Typography>

                  {item.changes.length > 120 && (
                    <Typography
                      onClick={() => toggleExpand(index)}
                      sx={{
                        color: "primary.main",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                      }}
                    >
                      {isExpanded ? "See less" : "See more"}
                    </Typography>
                  )}
                </Box>
              </>
            );
          })}
        </DialogContent>
      </Dialog>
    </>
  );
};
CategoryHistory.propTypes = {
  history: PropTypes.object,
};

export default CategoryHistory;
