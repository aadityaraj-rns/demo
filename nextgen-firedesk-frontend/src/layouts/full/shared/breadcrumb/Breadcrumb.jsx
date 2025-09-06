import { Typography, Breadcrumbs, Link, Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import { IconCircle } from "@tabler/icons";
import PropTypes from "prop-types";

const Breadcrumb = ({ items }) => (
  <Box sx={{ ml: 2 }}>
    <Breadcrumbs
      separator={
        <IconCircle
          size="5"
          fill="textSecondary"
          fillOpacity={"0.6"}
          style={{ margin: "0 5px" }}
        />
      }
      sx={{ alignItems: "center", mt: items ? "10px" : "" }}
      aria-label="breadcrumb"
    >
      {items
        ? items.map((item) => (
            <Box key={item.title}>
              {item.to ? (
                <Link
                  underline="none"
                  color="inherit"
                  component={NavLink}
                  to={item.to}
                >
                  <Typography variant="body2">{item.title}</Typography>
                </Link>
              ) : (
                <Typography variant="body2">{item.title}</Typography>
              )}
            </Box>
          ))
        : ""}
    </Breadcrumbs>
  </Box>
);
Breadcrumb.propTypes = {
  items: PropTypes.array,
};
export default Breadcrumb;
