import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

function LoginProtected({ isAuth, userType, children }) {
  if (isAuth && userType === "admin") {
    return <Navigate to="/" />;
  } else if (isAuth && userType === "organization") {
    return <Navigate to="/customer" />;
  } else {
    return children;
  }
}
LoginProtected.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  userType: PropTypes.string.isRequired,
  children: PropTypes.node,
};
export default LoginProtected;
