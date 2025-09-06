import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Loadable from "../layouts/technicianLayout/shared/loadable/Loadable";
import PartnerProtected from "../components/Protected/PartnerProtected";
import { useSelector } from "react-redux";
// import Spinner from "../pages/admin/spinner/Spinner";
// import useAutoLogin from "../hooks/useAutoLogin";
import MyOrganizations from "../pages/partner/myOrganizations/MyOrganizations";
import Profile from "../pages/partner/profile/Profile";
import Reports from "../pages/partner/reports/Reports";
import Dashboard from "../pages/partner/Dashboard";
import ForgotPassword from "../pages/customer/login/ForgotPassword";
import ChangePassword from "../pages/customer/login/ChangePassword";

const FullLayout = Loadable(
  lazy(() => import("../layouts/partnerLayout/FullLayout"))
);

const Login = Loadable(lazy(() => import("../pages/partner/login/Login")));

const PartnerRoutes = () => {
  const isAuth = useSelector((state) => state.user.auth);
  const userType = useSelector((state) => state.user.userType);
  // const loading = useAutoLogin();

  // if (loading) {
  //   return <Spinner />;
  // }

  return (
    <Routes>
      <Route path="/partner" element={<FullLayout />}>
        <Route
          path=""
          element={
            <PartnerProtected isAuth={isAuth} userType={userType}>
              <Dashboard />
            </PartnerProtected>
          }
        />
        <Route
          path="/partner/my-customers"
          element={
            <PartnerProtected isAuth={isAuth} userType={userType}>
              <MyOrganizations />
            </PartnerProtected>
          }
        />
        <Route
          path="/partner/profile"
          element={
            <PartnerProtected isAuth={isAuth} userType={userType}>
              <Profile />
            </PartnerProtected>
          }
        />
        <Route
          path="/partner/reports"
          element={
            <PartnerProtected isAuth={isAuth} userType={userType}>
              <Reports />
            </PartnerProtected>
          }
        />
      </Route>
      <Route
        path="/partner/login"
        element={
          <div>
            <Login />
          </div>
        }
      />
      <Route path="/partner/forgot-password" element={<ForgotPassword />} />
      <Route path="/partner/change-password" element={<ChangePassword />} />
    </Routes>
  );
};

export default PartnerRoutes;
