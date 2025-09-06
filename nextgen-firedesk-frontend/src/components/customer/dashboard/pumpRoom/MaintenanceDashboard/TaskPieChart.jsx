import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import PropTypes from "prop-types";

const defaultPieData = [
  { name: "Inspection", value: 0, color: "#10B981" },
  { name: "Testing", value: 0, color: "#F59E0B" },
  { name: "Maintenance", value: 0, color: "#3B82F6" },
];

const CustomTooltip = ({ active, payload }) =>
  active && payload?.length ? (
    <div className="bg-white p-2 rounded-md border shadow-sm text-sm">
      <p>
        <strong>{payload[0].name}</strong>: {payload[0].value}
      </p>
    </div>
  ) : null;
CustomTooltip.propTypes = {
  active: PropTypes.array,
  payload: PropTypes.array,
};
const TaskPieChart = ({ data }) => {
  const pieData = defaultPieData.map((item) => {
    const match = data?.find((d) => d._id === item.name);
    return { ...item, value: match?.count || 0 };
  });

  const total = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="p-2 rounded-xl md:row-span-2 bg-[#F9F9F9]">
      <p className="text-lg font-medium">
        Total Maintenance Tasks
      </p>
      <p className="text-xs">(This Month)</p>
      <div className="flex flex-col items-center justify-evenly">
        <div className="relative h-60 w-60">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
                cornerRadius={8}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-sm text-[#727272]">Total Task</p>
            <p className="text-3xl font-semibold">{total}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {pieData.map((item, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div
                className="w-5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-base text-[#727272]">
                {item.name} <span className="text-black"> ({item.value}) </span> 
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

TaskPieChart.propTypes = {
  data: PropTypes.array,
};

export default TaskPieChart;
