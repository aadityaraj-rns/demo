import { Navigate } from "react-router-dom";

function TechnicianProtected({ isAuth, userType, children }) {

  if (isAuth && userType === "technician") {
    return children;
  } else {
    return <Navigate to="/technician/login" />;
  }
}
export default TechnicianProtected;
