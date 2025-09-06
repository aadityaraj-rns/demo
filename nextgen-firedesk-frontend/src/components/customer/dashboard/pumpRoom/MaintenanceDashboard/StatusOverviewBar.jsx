import PropTypes from "prop-types";

const StatusOverviewBar = ({ data }) => {
  const STATUS_COLORS = {
    Completed: "#10B981",
    "In Progress": "#F59E0B", // if applicable
    Pending: "#9CA3AF",
    Lapsed: "#EF4444",
    "Waiting for approval": "#3B82F6",
    Rejected: "#A855F7",
  };

  const rawStatusData = data || [];
  const allStatuses = Object.keys(STATUS_COLORS);

  const normalizedData = allStatuses?.map((status) => {
    const found = rawStatusData.find((item) => item._id === status);
    return {
      label: status,
      count: found?.count || 0,
      color: STATUS_COLORS[status],
    };
  });

  const total = normalizedData.reduce((a, c) => a + c.count, 0);

  const percentData = normalizedData?.map((item) => ({
    ...item,
    percent: total > 0 ? (item.count / total) * 100 : 0,
  }));
  return (
    <div className="p-2 rounded-xl md:row-span-1 bg-[#F9F9F9]">
      <p className="text-lg font-medium mb-2">
        Task Status Overview
      </p>

      <div className="flex items-center space-x-1 mb-3">
        <span className="text-2xl md:text-2xl font-semibold">
          {data?.reduce((a, c) => a + c.count, 0)}
        </span>
        <span className="text-sm text-[#737373] font-medium mt-3">Total Task</span>
      </div>
      <div className="w-full h-2 mb-4 flex gap-0.5 rounded-full overflow-hidden">
        {percentData?.map(
          (item, index) =>
            item.percent > 0 && (
              <div
                key={index}
                className="h-full"
                style={{
                  width: `${item.percent}%`,
                  backgroundColor: item.color,
                  borderRadius: "9999px",
                }}
              />
            )
        )}
      </div>

      <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2 text-sm text-[#727272]">
        {normalizedData.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            ></div>
            <span>
              {item.label} <span className="text-black">({item.count})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
StatusOverviewBar.propTypes = {
  data: PropTypes.any,
};

export default StatusOverviewBar;
