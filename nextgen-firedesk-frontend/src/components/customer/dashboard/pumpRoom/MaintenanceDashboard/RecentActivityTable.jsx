import PropTypes from "prop-types";

const RecentActivityTable = ({ activities }) => {
  return (
    <div className="p-2 rounded-xl bg-[#F9F9F9]">
      <div className="rounded-t-lg">
        <p className="text-lg font-medium">
          Recent Maintenance Activity Table
        </p>
      </div>

      <div className="overflow-x-auto max-w-full">
        <table className="sm:min-w-[500px] text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2 font-medium text-[#737373] text-sm">
                Asset
              </th>
              <th className="text-left p-2 font-medium text-[#737373] text-sm">
                Task
              </th>
              <th className="text-left p-2 font-medium text-[#737373] text-sm">
                Technician
              </th>
              <th className="text-left p-2 font-medium text-[#737373] text-sm">
                Date
              </th>
              <th className="text-left p-2 font-medium text-[#737373] text-sm">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {activities?.map((activity, index) => (
              <tr key={index} className="border-b-2">
                <td className="p-2 text-xs xl:text-md">
                  {activity?.assets?.join(", ") || "—"}
                </td>
                <td className="p-2 text-xs xl:text-md">
                  {`${activity?.serviceType} (${activity?.serviceFrequency})`}
                </td>
                <td className="p-2 text-xs xl:text-md">
                  {activity?.serviceDoneBy || "Unassigned"}
                </td>
                <td className="p-2 text-xs xl:text-md">
                  {new Date(activity?.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="p-2 text-xs xl:text-md">
                  {activity?.completedStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
RecentActivityTable.propTypes = {
  activities: PropTypes.any,
};
export default RecentActivityTable;
