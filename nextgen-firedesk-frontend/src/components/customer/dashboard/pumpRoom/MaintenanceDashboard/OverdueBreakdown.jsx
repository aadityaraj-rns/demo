import PropTypes from "prop-types";

const OverdueBreakdown = ({ data }) => {
  const defaultRanges = [
    { _id: "Next 3 Days", color: "#FBBF24" },
    { _id: "Next 4–7 Days", color: "#FB923C" },
    { _id: "More Than 7 Days", color: "#F87171" },
  ];

  const overdueRawData = data || [];

  const overdueData = defaultRanges?.map(({ _id, color }) => {
    const found = overdueRawData.find((d) => d._id === _id);
    return {
      period: _id,
      count: found?.count || 0,
      color,
    };
  });
  return (
    <div className="p-2 rounded-xl md:row-span-1 md:col-start-2 xl:col-start-3 bg-[#F9F9F9]">
      <p className="text-lg font-medium mb-2">
        Overdue Maintenance Tasks
      </p>

      <div className="flex items-center space-x-2 mb-2.5">
        <span className="text-3xl font-semibold text-[#B91C1C]">
          {overdueData.reduce((a, c) => a + c.count, 0)}
        </span>
        <span className="text-sm font-medium mt-2 text-[#B91C1C]">
          Tasks Overdue
        </span>
      </div>

      <div className="space-y-3">
        {overdueData.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-1">
            <span className="text-sm text-[#727272] flex-shrink-0 w-30">
              {item.period}
            </span>
            <div className="flex items-center space-x-2 flex-1">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${Math.min((item.count / 12) * 100, 100)}%`, // adjust denominator if needed
                    backgroundColor: item.color,
                  }}
                ></div>
              </div>
              <span className="text-sm font-medium w-4 text-right">
                {item.count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
OverdueBreakdown.propTypes = {
  data: PropTypes.any,
};
export default OverdueBreakdown;
