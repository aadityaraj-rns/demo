import { UserRound } from "lucide-react";
import PropTypes from "prop-types";

const TechnicianPerformance = ({ technicians, selected, setSelected }) => {
  const getStatusCount = (status) => {
    return (
      selected?.statuses.find((s) => s.status === status)?.count || 0
    );
  };

  const totalTasks =
    selected?.statuses.reduce((sum, s) => sum + s.count, 0) || 0;

  const completed = getStatusCount("Completed");
  const waiting = getStatusCount("Waiting for approval");
  const rejected = getStatusCount("Rejected");

  const completedPct = ((completed / totalTasks) * 100).toFixed(0);
  const waitingPct = ((waiting / totalTasks) * 100).toFixed(0);
  const rejectedPct = ((rejected / totalTasks) * 100).toFixed(0);
  return (
    <div className="p-2 rounded-xl bg-[#F9F9F9] md:col-start-2 md:row-start-3 xl:col-start-2 xl:row-start-2">
      <p className="text-lg font-medium mb-2">
        Technician Performance
      </p>

      <div className="flex items-center space-x-1 mb-4">
        <div className="flex items-center space-x-1">
          <span className="text-2xl md:text-2xl font-semibold">
            {totalTasks}
          </span>
          <span className="text-sm text-[#737373] font-medium mt-3">
            Total Tasks
          </span>
        </div>
              {/* Technician dropdown */}
      <div className="flex items-center space-x-0.5 ml-auto">
          <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center">
            <UserRound className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
          {/* <span className="text-xs sm:text-sm font-medium truncate">
            {selected?.name}
          </span> */}
          <div>
            <select
        className="rounded w-full sm:w-auto text-sm font-medium truncate border-none outline-none"
        value={selected?.technicianId}
        onChange={(e) => {
          const tech = technicians?.find(
            (t) => t?.technicianId === e.target.value
          );
          setSelected(tech);
        }}
      >
        {technicians?.map((tech) => (
          <option key={tech?.technicianId} value={tech?.technicianId}>
            {tech?.name}
          </option>
        ))}
      </select>
          </div>
        </div>
        
      </div>

      {/* Progress Bar */}
      <div className="h-2 mb-4 flex gap-0.5 rounded-full px-0.5">
        <div
          className="bg-[#10B981] h-full rounded-full"
          style={{ width: `${completedPct}%` }}
        ></div>
        <div
          className="bg-[#F59E0B] h-full rounded-full"
          style={{ width: `${waitingPct}%` }}
        ></div>
        <div
          className="bg-[#9CA3AF] h-full rounded-full"
          style={{ width: `${rejectedPct}%` }}
        ></div>
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full flex-shrink-0"></div>
          <span className="text-[#727272]">Completed</span> <span className="text-black">({completed})</span>
        </div>
        <div className="flex items-center space-x-2 whitespace-nowrap">
          <div className="w-2.5 h-2.5 bg-[#F59E0B] rounded-full flex-shrink-0"></div>
          <span className="text-[#727272]">Waiting for Approval</span> <span className="text-black">({waiting})</span>
        </div>
        <div className="flex items-center space-x-2 whitespace-nowrap">
          <div className="w-2.5 h-2.5 bg-[#9CA3AF] rounded-full flex-shrink-0"></div>
          <span className="text-[#727272]">Rejected</span> <span className="text-black">({rejected})</span>
        </div>
      </div>
    </div>
  );
};
TechnicianPerformance.propTypes = {
  technicians: PropTypes.any,
  selected: PropTypes.any,
  setSelected: PropTypes.any,
};
export default TechnicianPerformance;
