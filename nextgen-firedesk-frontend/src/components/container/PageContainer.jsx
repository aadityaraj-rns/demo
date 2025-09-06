import { Box } from "@mui/material";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

const PageContainer = ({ title, description, children }) => (
  <Box>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
    {children}
  </Box>
);

PageContainer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
};

export default PageContainer;
