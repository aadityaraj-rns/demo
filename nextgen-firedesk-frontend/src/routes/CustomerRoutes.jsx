import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loadable from "../layouts/full/shared/loadable/Loadable";
import { useSelector } from "react-redux";
import CustomerProtected from "../components/Protected/CustomerProtected";
import Services from "../pages/customer/services/Services";
// import Profile from "../pages/customer/profile/Profile";
// import DateWiseServices from "../pages/customer/services/DateWiseServices";
import ServiceDetails from "../pages/customer/services/ServiceDetails";
import ViewServiceForm from "../pages/customer/services/ViewServiceForm";
import Archive from "../pages/customer/archive/Archive";
import AuditDetails from "../pages/customer/audits/AuditDetails";
import TicketDetails from "../pages/customer/tickets/TicketDetails";
import TicketResponse from "../pages/customer/tickets/TicketResponse";
import Categories from "../pages/customer/categories/Categories";
import AuditFormDownload from "../components/customer/audits/AuditFormDownload";
import Manager from "../pages/customer/manager/Manager";
import Assets from "../pages/customer/assets/Assets";
// import AssetDetails from "../pages/customer/assets/AssetDetails";
import Audits from "../pages/customer/audits/Audits";
import Tickets from "../pages/customer/tickets/Tickets";
import PlantDetails from "../components/customer/plant/PlantDetails";

const Technician = Loadable(
  lazy(() => import("../pages/customer/technician/Technician"))
);
import Plant from "../pages/customer/plant/Plant";
import ServiceFormView from "../pages/customer/services/ServiceFormView";
import ServiceFormDownload from "../pages/admin/service/ServiceFormDownload";
import Error from "../pages/authentication/Error";
import Dashboard from "../pages/customer/dashboard/Dashboard";
import AssetInformaitonDownload from "../components/customer/assets/AssetInformaitonDownload";
import ViewRejectedServiceLogsForm from "../pages/customer/services/ViewRejectedServiceLogsForm";
import Reports from "../pages/customer/reports/Reports";
import Notifications from "../pages/customer/notifications/Notifications";
import GroupService from "../pages/customer/group/GroupService";
import ViewGroupService from "../components/customer/group/ViewGroupService";
import UploadOldServices from "../pages/customer/assets/UploadOldServices";
import LayoutFullViewPage from "../components/customer/dashboard/layouts/LayoutFullViewPage";
import KnowMore from "../components/customer/dashboard/pumpRoom/knowMore";
import EditProfile from "../components/customer/dashboard/pumpRoom/profile/EditProfile";
import ChangePassword from "../pages/customer/login/ChangePassword";

const FullLayout = Loadable(
  lazy(() => import("../layouts/organisationLayout/FullLayout"))
);

const CustomerRoutes = () => {
  const isAuth = useSelector((state) => state.user.auth);
  const userType = useSelector((state) => state.user.userType);

  return (
    <Routes>
      <Route path="/customer" element={<FullLayout />}>
        <Route
          path=""
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <Dashboard />
            </CustomerProtected>
          }
        />
        <Route
          path="pump-product-details/:id"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <KnowMore />
            </CustomerProtected>
          }
        />
        <Route
          path="service-calendar"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <Services />
            </CustomerProtected>
          }
        />
        {/* <Route
          path="service-calendar/services"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <DateWiseServices />
            </CustomerProtected>
          }
        /> */}
        <Route
          path="service-details/view-form/:serviceTicketId"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <ViewServiceForm />
            </CustomerProtected>
          }
        />
        <Route
          path="service-calendar/view-rejected-logs/:serviceId"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <ViewRejectedServiceLogsForm />
            </CustomerProtected>
          }
        />
        <Route
          path="service-details"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <ServiceDetails />
            </CustomerProtected>
          }
        />
        <Route
          path="service-form-view"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <ServiceFormView />
            </CustomerProtected>
          }
        />
        <Route
          path="service/form-download/:serviceId"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <ServiceFormDownload />
            </CustomerProtected>
          }
        />
        <Route
          path="manager"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <Manager />
            </CustomerProtected>
          }
        />
        <Route
          path="tickets"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <Tickets />
            </CustomerProtected>
          }
        />
        <Route
          path="technician"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <Technician />
            </CustomerProtected>
          }
        />
        <Route
          path="plant"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <Plant />
            </CustomerProtected>
          }
        />
        <Route
          path="plantDetails"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <PlantDetails />
            </CustomerProtected>
          }
        />
        <Route
          path="assets"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <Assets />
            </CustomerProtected>
          }
        />
        <Route
          path="group-service"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <GroupService />
            </CustomerProtected>
          }
        />
        <Route
          path="group-service/:_id/details"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <ViewGroupService />
            </CustomerProtected>
          }
        />
        <Route
          path="assets/view/:id"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <AssetInformaitonDownload />
            </CustomerProtected>
          }
        />
        <Route
          path="assets/:assetId/upload-old-services"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <UploadOldServices />
            </CustomerProtected>
          }
        />
        <Route
          path="audits"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <Audits />
            </CustomerProtected>
          }
        />
        <Route
          path="reports"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <Reports />
            </CustomerProtected>
          }
        />
        <Route
          path="audits/:auditId"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <AuditDetails />
            </CustomerProtected>
          }
        />
        <Route
          path="audits/download-view"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <AuditFormDownload />
            </CustomerProtected>
          }
        />
        <Route
          path="archive"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <Archive />
            </CustomerProtected>
          }
        />
        <Route
          path="profile"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              {/* {userType === "manager" ? <ManagerProfile /> : <Profile />} */}
              <EditProfile />
            </CustomerProtected>
          }
        />
        <Route
          path="tickets/:ticketId"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <TicketDetails />
            </CustomerProtected>
          }
        />
        <Route
          path="tickets/:ticketId/response/:responseId"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <TicketResponse />
            </CustomerProtected>
          }
        />
        <Route
          path="categories"
          element={
            <CustomerProtected isAuth={isAuth} userType={userType}>
              <Categories />
            </CustomerProtected>
          }
        />
        <Route path="/customer/notifications" element={<Notifications />} />
      </Route>
      <Route
        path="/customer/plant-layouts/:plantId"
        element={<LayoutFullViewPage />}
      />
      {/* <Route path="/customer/forgot-password" element={<ForgotPassword />} /> */}
      <Route path="/customer/change-password" element={<ChangePassword />} />
      {/* <Route
        path="/customer/change-password"
        element={
          <CustomerProtected isAuth={isAuth} userType={userType}>
            <ChangePassword />
          </CustomerProtected>
        }
      /> */}
      <Route path="/customer/*" element={<Error />} />
    </Routes>
  );
};

export default CustomerRoutes;
