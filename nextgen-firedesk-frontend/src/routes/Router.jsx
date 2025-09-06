import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Protected from "../components/Protected/Protected";
import { useSelector } from "react-redux";
import Loadable from "../layouts/full/shared/loadable/Loadable";
import ServiceForm from "../pages/admin/service/ServiceForm";
import ClientData from "../pages/admin/client/ClientData";
import Industry from "../pages/admin/masterData/Industry";
// import DetailsPage from "../pages/admin/client/DetailsPage";
import ServiceFormDownload from "../pages/admin/service/ServiceFormDownload";
import SelfAuditView from "../components/admin/masterData/selfAudit/SelfAuditView";
import ForgotPassword from "../pages/customer/login/ForgotPassword";
import ChangePassword from "../pages/customer/login/ChangePassword";
import ServiceForms from "../pages/admin/masterData/ServiceForms";
import LoginPage from "../pages/customer/login/LoginPage";
import LoginProtected from "../components/Protected/LoginProtected";

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import("../layouts/full/FullLayout")));

/* Error Page */
const Error = Loadable(lazy(() => import("../pages/authentication/Error")));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import("../pages/admin/Dashboard")));
const City = Loadable(lazy(() => import("../pages/admin/masterData/City")));
const Categories = Loadable(
  lazy(() => import("../pages/admin/masterData/Categories"))
);
const SelfAudit = Loadable(
  lazy(() => import("../pages/admin/masterData/SelfAudit"))
);
const Product = Loadable(lazy(() => import("../pages/admin/product/Product")));
const Service = Loadable(lazy(() => import("../pages/admin/service/Service")));
const Reports = Loadable(lazy(() => import("../pages/admin/reports/Reports")));
const ProfileAndSettings = Loadable(
  lazy(() => import("../pages/admin/profileAndSettings/ProfileAndSettings"))
);
// const Login = Loadable(lazy(() => import("../pages/admin/login/Login")));

const Router = () => {
  const isAuth = useSelector((state) => state.user.auth);
  const userType = useSelector((state) => state.user.userType);

  return (
    <Routes>
      <Route path="/" element={<FullLayout />}>
        <Route
          index
          element={
            <Protected isAuth={isAuth} userType={userType}>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/masterData/industry"
          element={
            <Protected isAuth={isAuth} userType={userType}>
              <Industry />
            </Protected>
          }
        />
        <Route
          path="/masterData/city"
          element={
            <Protected isAuth={isAuth} userType={userType}>
              <City />
            </Protected>
          }
        />
        <Route
          path="/masterData/categories"
          element={
            <Protected isAuth={isAuth} userType={userType}>
              <Categories />
            </Protected>
          }
        />
        <Route
          path="/masterData/service-form"
          element={
            <Protected isAuth={isAuth} userType={userType}>
              <ServiceForms />
            </Protected>
          }
        />
        <Route
          path="/masterData/selfAudit"
          element={
            <Protected isAuth={isAuth} userType={userType}>
              <SelfAudit />
            </Protected>
          }
        />
        <Route
          path="/masterData/selfAudit/view-audit"
          element={
            <Protected isAuth={isAuth} userType={userType}>
              <SelfAuditView />
            </Protected>
          }
        />

        <Route
          path="/client/data"
          element={
            <Protected isAuth={isAuth} userType={userType}>
              <ClientData />
            </Protected>
          }
        />
        {/* <Route
          path="/client/details/:userId"
          element={
            <Protected isAuth={isAuth} userType={userType}>
              <DetailsPage />
            </Protected>
          }
        /> */}
        <Route
          path="/product"
          element={
            <Protected isAuth={isAuth} userType={userType}>
              <Product />
            </Protected>
          }
        />
        <Route
          path="/service"
          element={
            <Protected isAuth={isAuth} userType={userType}>
              <Service />
            </Protected>
          }
        />
        <Route
          path="/service/serviceForm/:id"
          element={
            <Protected isAuth={isAuth} userType={userType}>
              <ServiceForm />
            </Protected>
          }
        />
        <Route
          path="/service/form-download/:serviceId"
          element={
            <Protected isAuth={isAuth} userType={userType}>
              <ServiceFormDownload />
            </Protected>
          }
        />
        <Route
          path="/reports"
          element={
            <Protected isAuth={isAuth} userType={userType}>
              <Reports />
            </Protected>
          }
        />
        <Route
          path="/profileAndSettings"
          element={
            <Protected isAuth={isAuth} userType={userType}>
              <ProfileAndSettings />
            </Protected>
          }
        />
      </Route>

      {/* Error Route */}
      <Route path="*" element={<Error />} />

      {/* Public Route */}
      {/* <Route path="/login" element={<Login />} /> */}
      <Route
        path="/login"
        element={
          <LoginProtected isAuth={isAuth} userType={userType}>
            <LoginPage />
          </LoginProtected>
        }
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
    </Routes>
  );
};

export default Router;
