import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

function Protected({ isAuth, userType, children }) {
  if (isAuth && userType === "admin") {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
Protected.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  userType: PropTypes.string.isRequired,
  children: PropTypes.node,
};
export default Protected;
