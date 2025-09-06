import {
  AlertTriangle,
  CheckCircle,
  Fuel,
  Droplets,
  Battery,
  Gauge,
  ChartNoAxesCombined,
  // Dot,
  // RefreshCw,
} from "lucide-react";
import PropTypes from "prop-types";

const CircularProgress = ({ percentage, isRed, children }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className={isRed ? "text-[#FFEBEB]" : "text-[#ECFDF5]"}
        />
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={isRed ? "text-[#B91C1C]" : "text-[#047857]"}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`text-center font-bold ${
            isRed ? "text-[#B91C1C]" : "text-[#047857]"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
CircularProgress.propTypes = {
  percentage: PropTypes.any,
  isRed: PropTypes.any,
  children: PropTypes.any,
};

const StatusCard = ({
  title,
  icon: Icon,
  display,
  status,
  capacity,
  present,
  required,
  progress,
  isRed,
}) => (
  <div className="p-3 rounded-lg border bg-white shadow-sm">
    <div className="flex mb-4">
      <CircularProgress percentage={progress} isRed={isRed}>
        {display}
      </CircularProgress>
    </div>

    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-7 h-7 bg-gray-100 p-1 rounded-lg" />
      <p className="font-medium text-lg">{title}</p>
    </div>

    <div className="flex items-center gap-2 mb-6 border-b-1 pb-4">
      {isRed ? (
        <span className="text-sm font-medium text-[#B91C1C] bg-[#FFEBEB] flex gap-2 px-2 py-1 rounded-full">
          <AlertTriangle className="w-5 h-5 text-[#B91C1C]" /> {status}
        </span>
      ) : (
        <span className="text-sm font-medium text-[#047857] bg-[#ECFDF5] flex gap-2 px-2 py-1 rounded-full">
          <CheckCircle className="w-5 h-5 text-[#047857]" /> {status}
        </span>
      )}
    </div>

    <div className="space-y-2 text-[#727272]">
      <div className="flex justify-between">
        <span className="text-base">Capacity:</span>
        <span className="font-semibold text-base text-black">{capacity}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-base">Present:</span>
        <span className="font-semibold text-base text-black">{present}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-base">Required:</span>
        <span className="font-semibold text-base text-black">{required}</span>
      </div>
    </div>
  </div>
);
StatusCard.propTypes = {
  title: PropTypes.any,
  icon: PropTypes.any,
  display: PropTypes.any,
  status: PropTypes.any,
  capacity: PropTypes.any,
  present: PropTypes.any,
  required: PropTypes.any,
  progress: PropTypes.any,
  isRed: PropTypes.any,
};

export default function SupportSystemStatus({
  pumpData,
  pumpIotData,
  timestamp,
}) {
  return (
    <div className="h-full p-3 font-[Figtree] w-full bg-white rounded-xl shadow-sm border-1 border-[#E3E3E3]">
      <div className="w-full mx-auto">
        <div className="flex items-center justify-between md:hidden mb-3 pl-2">
          <div className="text-[#727272] flex items-center justify-center">
            <ChartNoAxesCombined strokeWidth={1.5} size={30} />
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
        <div className="flex flex-row justify-between items-center border-b mb-4 pb-4 border-[#E3E3E3] gap-4">
          <div className="flex items-center justify-start h-14 gap-2 md:gap-4 ml-1">
            <div className="flex items-center gap-4">
              <div className="text-[#727272] items-center justify-center hidden md:block">
                <ChartNoAxesCombined strokeWidth={1.5} size={40} />
              </div>
            </div>
            <div className="md:border-l-1 lg:border-l-2 border-[#E3E3E3] md:pl-4">
              <p className="text-xs font-medium lg:text-xl text-left">
                Support System Status
              </p>
              <p className="text-[10px] -mt-5 leading-tight text-[#A2A2A2] md:text-[12px]">
                Stay informed on storage levels and system health to prevent
                outages and reduce downtime.
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatusCard
            title={"Diesel Storage"}
            icon={Fuel}
            display={
              <div className="text-2xl font-medium">
                {Math.round(
                  (pumpIotData?.DLS / pumpData?.dieselStorage) * 100
                ) || 0}
                %
              </div>
            }
            status={
              (pumpIotData?.DLS / pumpData?.dieselStorage) * 100 < 75
                ? " Need Attention"
                : "Satisfactory"
            }
            capacity={`${pumpData?.dieselStorage} Ltrs`}
            present={`${pumpIotData?.DLS ?? 0} Ltrs`}
            required={`${pumpData?.dieselStorage * 0.75} Ltrs`}
            progress={(pumpIotData?.DLS / pumpData?.dieselStorage) * 100 || 0}
            isRed={(pumpIotData?.DLS / pumpData?.dieselStorage) * 100 < 75}
          />
          <StatusCard
            title={"Water Storage"}
            icon={Droplets}
            display={
              <div className="text-2xl font-medium">
                {Math.round(
                  (pumpIotData?.WLS / pumpData?.mainWaterStorage) * 100
                ) || 0}
                %
              </div>
            }
            status={
              (pumpIotData?.WLS / pumpData?.mainWaterStorage) * 100 < 75
                ? " Need Attention"
                : "Satisfactory"
            }
            capacity={`${pumpData?.mainWaterStorage} Ltrs`}
            present={`${pumpIotData?.WLS ?? 0} Ltrs`}
            required={`${pumpData?.mainWaterStorage * 0.75} Ltrs`}
            progress={
              (pumpIotData?.WLS / pumpData?.mainWaterStorage) * 100 || 0
            }
            isRed={(pumpIotData?.WLS / pumpData?.mainWaterStorage) * 100 < 75}
          />
          <StatusCard
            title={"Battery Status"}
            icon={Battery}
            display={
              <div className="text-2xl font-medium">{pumpIotData?.BAT1}V</div>
            }
            status={
              (pumpIotData?.BAT1 / 12) * 100 < 75
                ? " Need Attention"
                : "Satisfactory"
            }
            capacity={"12 V"}
            present={`${pumpIotData?.BAT1 ?? 0} V`}
            required={"12 V"}
            progress={(pumpIotData?.BAT1 / 12) * 100 || 0}
            isRed={pumpIotData?.BAT1 <= 10}
          />
          <StatusCard
            title={"Header Pressure"}
            icon={Gauge}
            display={
              <div className="text-[14px] font-medium">
                {pumpIotData?.PLS}
                {pumpData?.pressureUnit}
              </div>
            }
            status={
              Math.abs(pumpIotData?.PLS - pumpData?.headerPressure) > 2
                ? "Need Attention"
                : "Satisfactory"
            }
            capacity={pumpData?.headerPressure + " " + pumpData?.pressureUnit}
            present={`${
              pumpIotData?.PLS
                ? pumpIotData?.PLS + " " + pumpData?.pressureUnit
                : 0
            }`}
            required={pumpData?.headerPressure + " " + pumpData?.pressureUnit}
            progress={
              Math.abs(pumpIotData?.PLS - pumpData?.headerPressure) > 2
                ? 30
                : 90
            }
            isRed={Math.abs(pumpIotData?.PLS - pumpData?.headerPressure) > 2}
          />
        </div>
      </div>
    </div>
  );
}
SupportSystemStatus.propTypes = {
  timestamp: PropTypes.any,
  pumpData: PropTypes.any,
  pumpIotData: PropTypes.any,
};
