import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceArea,
  Area, // Import Area
} from 'recharts';

const rawStatus = [
  { day: 'Sun', status: 1, tooltipTrigger: 0 }, // Added tooltipTrigger
  { day: 'Mon', status: -1, tooltipTrigger: 0 },
  { day: 'Tue', status: 0, tooltipTrigger: 0 },
  { day: 'Wed', status: 0, tooltipTrigger: 0 },
  { day: 'Thu', status: -1, tooltipTrigger: 0 },
  { day: 'Fri', status: 1, tooltipTrigger: 0 },
  { day: 'Sat', status: 1, tooltipTrigger: 0 },
];

// Define the Y-axis boundaries for each status band
const Y_BAND_ON = { top: 1.5, bottom: 0.5 };
const Y_BAND_OFF = { top: 0.5, bottom: -0.5 };
const Y_BAND_TRIPPED = { top: -0.5, bottom: -1.5 };

const statusColors = {
  1: '#2d6a4f', // On
  0: '#b85c00', // Off
  '-1': '#c1121f', // Tripped
};

const statusLabels = {
  1: 'On',
  0: 'Off',
  '-1': 'Tripped',
};

export default function StatusChart() {
  // Define Y-axis ticks at the *top* boundary of each band
  const yAxisTicks = [Y_BAND_ON.top, Y_BAND_OFF.top, Y_BAND_TRIPPED.top]; // [1.5, 0.5, -0.5]

  // Custom Tick Formatter for YAxis - now maps top band value to label
  const customYAxisTickFormatter = (value) => {
    if (value === Y_BAND_ON.top) return 'On';
    if (value === Y_BAND_OFF.top) return 'Off';
    if (value === Y_BAND_TRIPPED.top) return 'Tripped';
    return '';
  };

  const dataForReferenceAreas = rawStatus.map((item, index) => {
    const nextDayIndex = index + 1;
    const x1 = item.day;
    const x2 = nextDayIndex < rawStatus.length ? rawStatus[nextDayIndex].day : null;

    let y1, gradientId,stroke;

    switch (item.status) {
      case 1: // On
        y1 = Y_BAND_ON.top;
        gradientId = 'onFill';
        stroke="green";
        break;
      case 0: // Off
        y1 = Y_BAND_OFF.top;
        gradientId = 'offFill';
        stroke="orange";
        break;
      case -1: // Tripped
        y1 = Y_BAND_TRIPPED.top;
        gradientId = 'trippedFill';
        stroke="red";
        break;
      default:
        y1 = 0;
        gradientId = '';
    }

    return {
      x1,
      x2,
      y1,
      y2: Y_BAND_TRIPPED.bottom, 
      gradientId,
      status: item.status, 
      stroke
    };
  });

  return (
    <ResponsiveContainer width="100%" height={310}>
      <AreaChart data={rawStatus}>
        <defs>
          <linearGradient id="onFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={statusColors[1]} stopOpacity={0.8} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="offFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={statusColors[0]} stopOpacity={0.8} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="trippedFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={statusColors[-1]} stopOpacity={0.8} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <XAxis dataKey="day" />

        <YAxis
          type="number"
          domain={[Y_BAND_TRIPPED.bottom, Y_BAND_ON.top+0.8]}
          ticks={yAxisTicks}
          tickFormatter={customYAxisTickFormatter}
          axisLine={true}
          tickLine={false}
        />

        <Tooltip
          formatter={(value, name, props) => {
            if (props.payload && props.payload.status !== undefined) {
              return statusLabels[props.payload.status];
            }
            
            if (props.payload && props.payload.day) {
                const currentDayData = rawStatus.find(d => d.day === props.payload.day);
                if (currentDayData && currentDayData.status !== undefined) {
                    return statusLabels[currentDayData.status];
                }
            }
            return '';
          }}
          labelFormatter={(label) => `Day: ${label}`}
          cursor={{ stroke: '#ccc', strokeWidth: 1 }}
        />

        <Legend
          payload={[
            { value: 'On', type: 'square', color: statusColors[1] },
            { value: 'Off', type: 'square', color: statusColors[0] },
            { value: 'Tripped', type: 'square', color: statusColors[-1] },
          ]}
        />

        {/* Dummy Area to make Tooltip active on hover over the chart area */}
        {/* This `Area` component has a `dataKey` that matches one of the values on the Y-axis.
            Its fill/stroke are transparent, so it's invisible, but it makes the Tooltip interactive.
            It's important that this Area spans across the entire X-axis. */}
        <Area
          dataKey="tooltipTrigger" 
          strokeOpacity={0} // Make stroke invisible
          fillOpacity={0}   // Make fill invisible
          activeDot={{ r: 0 }} // No visible dots
          isAnimationActive={false} // Disable animation for this dummy layer
        />

        {dataForReferenceAreas.map((areaProps, index) => (
          <ReferenceArea
            key={`ref-area-${index}`}
            x1={areaProps.x1}
            x2={areaProps.x2}
            y1={areaProps.y1}
            y2={areaProps.y2} // Use the calculated y2 from dataForReferenceAreas
            // fill={areaProps.fill}
            fill={`url(#${areaProps.gradientId})`}


            stroke={areaProps.stroke}
            strokeOpacity={0.2}
            // IMPORTANT: The payload here is what the Tooltip will *try* to read if it's directly hovered over.
            // However, the dummy Area often takes precedence for activating the tooltip cursor.
            payload={areaProps.payload}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}