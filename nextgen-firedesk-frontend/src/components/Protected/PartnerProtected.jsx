import { Navigate } from "react-router-dom";

function PartnerProtected({ isAuth, userType, children }) {
  if (isAuth && userType === "partner") {
    return children;
  } else {
    return <Navigate to="/partner/login" />;
  }
}
export default PartnerProtected;
