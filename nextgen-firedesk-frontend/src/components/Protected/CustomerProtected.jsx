import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

function CustomerProtected({ isAuth, userType, children }) {
  if (isAuth && (userType === "organization" || userType === "manager")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
CustomerProtected.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  userType: PropTypes.string.isRequired,
  children: PropTypes.node,
};
export default CustomerProtected;
