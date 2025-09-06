import { useEffect, useState } from "react";
// import icon from "/maintenance_icon.png";
import PropTypes from "prop-types";
import TaskPieChart from "./TaskPieChart";
import StatusOverviewBar from "./StatusOverviewBar";
import OverdueBreakdown from "./OverdueBreakdown";
import RecentActivityTable from "./RecentActivityTable";
import TechnicianPerformance from "./TechnicianPerformance";
import { getPumpMaintenanceOverviewData } from "../../../../../api/organization/internal";
import { PanelsTopLeft } from "lucide-react";
// import { GrHostMaintenance } from "react-icons/gr";

const MaintenanceDashboard = ({ timestamp, plantId, categoryId }) => {
  const [maintenanceData, setMaintenanceData] = useState({});
  const [selectedTechnician, setSelectedTechnician] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = { plantId, categoryId };
      const response = await getPumpMaintenanceOverviewData(data);
      setMaintenanceData(response.data);
    };
    fetchData();
  }, [plantId, categoryId]);

  useEffect(() => {
    if (maintenanceData?.technicianStatusCounts?.length > 0) {
      setSelectedTechnician(maintenanceData.technicianStatusCounts[0]);
    }
  }, [maintenanceData]);

  return (
    <section className="mt-3 font-[Figtree] w-full p-3 bg-white border rounded-2xl overflow-x-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between md:hidden mb-3 pl-2">
        <div className="text-[#727272] flex items-center justify-center">
          <PanelsTopLeft strokeWidth={1.5} size={30} />
        </div>
        <div className="flex items-center">
          <p className="text-[10px] leading-tight">
            Last Updated: {new Date(timestamp).toLocaleString()}
          </p>
          {/* <span>
            <Dot />
          </span>
          <span>
            <RefreshCw className="w-3 h-3 stroke-1" />
          </span> */}
        </div>
      </div>
      <div className="flex flex-row justify-between items-center border-b mb-1 pb-4 border-[#E3E3E3] gap-4">
        <div className="flex items-center justify-start h-14 gap-2 md:gap-4 ml-1">
          <div className="flex items-center gap-4">
            <div className="text-[#727272] items-center justify-center hidden md:block">
              <PanelsTopLeft strokeWidth={1.5} size={40} />
            </div>
          </div>
          <div className="md:border-l-1 lg:border-l-2 border-[#E3E3E3] md:pl-4">
            <p className="text-xs font-medium lg:text-xl text-left">
              Maintenance Overview
            </p>
            <p className="text-[10px] -mt-5 leading-tight text-[#A2A2A2] md:text-[12px]">
              Stay on top of tasks, team activity, and overdue risks — all in
              one view.
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <p className="text-[12px] leading-tight hidden md:block">
            Last Updated: {new Date(timestamp).toLocaleString()}
          </p>
          {/* <Dot className="hidden md:block" />
          <span>
            <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 stroke-1 hidden md:block" />
          </span> */}
        </div>
      </div>
      {/* <div className="flex justify-between items-center border-b pb-6 border-[#E3E3E3] gap-4">
        <div className="flex gap-4 items-center">
          <img src={icon} className="w-12 h-12" alt="icon" />
          <div className="border-l-2 border-[#E3E3E3] pl-4">
            <p className="text-sm lg:text-xl font-medium">
              Maintenance Overview
            </p>
            <p className="text-[10px] text-[#A2A2A2] -mt-2 lg:text-xs">
              Stay on top of tasks, team activity, and overdue risks — all in
              one view.
            </p>
          </div>
        </div>
        <p className="text-xs">
          Last Updated: {new Date(timestamp).toLocaleString()}
        </p>
      </div> */}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 xl:grid-cols-3 xl:grid-rows-2 gap-4 mt-4">
        <TaskPieChart data={maintenanceData?.serviceTypeCounts} />
        <StatusOverviewBar data={maintenanceData?.statusCounts} />
        <OverdueBreakdown data={maintenanceData?.pendingByRange} />
        <RecentActivityTable activities={maintenanceData?.recentActivities} />
        <TechnicianPerformance
          technicians={maintenanceData?.technicianStatusCounts}
          selected={selectedTechnician}
          setSelected={setSelectedTechnician}
        />
      </div>
    </section>
  );
};

MaintenanceDashboard.propTypes = {
  timestamp: PropTypes.any,
  plantId: PropTypes.any,
  categoryId: PropTypes.any,
};

export default MaintenanceDashboard;
