import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";

const PumpRoomCard = ({
  header,
  level1,
  level2,
  value1,
  value2,
  percent,
  icon,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        width: "100%",
        border: "1px solid #e1cfcf",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column", // 🔥 Ensures vertical layout
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {icon}
          <Typography variant="body2" fontWeight="bold">
            {header}
          </Typography>
        </Stack>

        <Typography variant="body2">
          <strong>{level1}:</strong> <span className="f-normal">{value1}</span>
        </Typography>

        <Typography variant="body2">
          <strong>{level2}:</strong> <span className="f-normal">{value2}</span>
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress
              variant="determinate"
              value={percent}
              sx={{
                height: 7,
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {Math.floor(percent)}%
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

PumpRoomCard.propTypes = {
  icon: PropTypes.node,
  header: PropTypes.string,
  level1: PropTypes.string,
  level2: PropTypes.string,
  value1: PropTypes.any,
  value2: PropTypes.any,
  percent: PropTypes.number,
};

export default PumpRoomCard;
