import PropTypes from "prop-types";
import { Card, CardContent, Divider, Box } from "@mui/material";
import { useSelector } from "react-redux";

const ParentCard = ({ children, footer }) => {
  const customizer = useSelector((state) => state.customizer);
  return (
    <Card
      sx={{ padding: 0 }}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? "outlined" : undefined}
    >
      <Divider />

      <CardContent>{children}</CardContent>
      {footer ? (
        <>
          <Divider />
          <Box p={3}>{footer}</Box>
        </>
      ) : (
        ""
      )}
    </Card>
  );
};

ParentCard.propTypes = {
  children: PropTypes.node,
  footer: PropTypes.node,
};

export default ParentCard;
