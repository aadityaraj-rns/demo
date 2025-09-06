import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Loadable from "../layouts/technicianLayout/shared/loadable/Loadable";
import Home from "../pages/technician/home/Home";
import TechnicianProtected from "../components/Protected/TechnicianProtected";
import { useSelector } from "react-redux";
// import Spinner from "../pages/admin/spinner/Spinner";
// import useAutoLogin from "../hooks/useAutoLogin";
import Error from "../pages/authentication/Error";
// import PlantDetails from "../pages/technician/home/PlantDetails";
import MyAssets from "../pages/technician/myAssets/MyAssets";
import AssetDetails from "../pages/technician/myAssets/AssetDetails";
import ServiceReport from "../pages/technician/report/ServiceReport";
// import Reports from "../pages/technician/report/Reports";

const FullLayout = Loadable(
  lazy(() => import("../layouts/technicianLayout/FullLayout"))
);

const Login = Loadable(lazy(() => import("../pages/technician/login/Login")));

const TechnicianRoutes = () => {
  const isAuth = useSelector((state) => state.user.auth);
  const userType = useSelector((state) => state.user.userType);
  // const loading = useAutoLogin();

  // if (loading) {
  //   return <Spinner />;
  // }

  return (
    <Routes>
      <Route path="/technician" element={<FullLayout />}>
        <Route
          path=""
          element={
            <TechnicianProtected isAuth={isAuth} userType={userType}>
              <Home />
            </TechnicianProtected>
          }
        />
        {/* <Route
          path="plant/:plantId"
          element={
            <TechnicianProtected isAuth={isAuth} userType={userType}>
              <PlantDetails />
            </TechnicianProtected>
          }
        /> */}
        <Route
          path="my-assets"
          element={
            <TechnicianProtected isAuth={isAuth} userType={userType}>
              <MyAssets />
            </TechnicianProtected>
          }
        />
        <Route
          path="asset/:assetId"
          element={
            <TechnicianProtected isAuth={isAuth} userType={userType}>
              <AssetDetails />
            </TechnicianProtected>
          }
        />
        <Route
          path="service-reports"
          element={
            <TechnicianProtected isAuth={isAuth} userType={userType}>
              <ServiceReport />
            </TechnicianProtected>
          }
        />
        {/* <Route
          path="reports"
          element={
            <TechnicianProtected isAuth={isAuth} userType={userType}>
              <Reports />
            </TechnicianProtected>
          }
        /> */}
      </Route>

      <Route path="/technician/*" element={<Error />} />

      <Route
        path="/technician/login"
        element={
          <div>
            <Login />
          </div>
        }
      />
    </Routes>
  );
};

export default TechnicianRoutes;
