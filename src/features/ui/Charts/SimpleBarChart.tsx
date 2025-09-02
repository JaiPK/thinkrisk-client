import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Cell,
} from "recharts";

interface SimpleBarChartDataProps {
  data: { name: string; uv: number }[];
   onBarClick : (name: string) => void;
}

const SimpleBarChart: React.FC<SimpleBarChartDataProps> = ({ data,onBarClick}) => {
  const [activeBarId, setActiveBarId] = useState(data.find((val:any) => val?.uv > 0)?.name ?? null); 
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      const currentItem = data.find((item: any) => item.name === label);
      if (currentItem) {
        return (
          <div
            style={{
              backgroundColor: "#fff",
              padding: "10px",
              border: "1px solid #ccc",
              fontFamily: "roboto",
            }}
          >
            <strong>Extraction Points:</strong> {currentItem.name}
            <br />
            <strong>No. of Invoice:</strong> {currentItem.uv}
          </div>
        );
      }
    }
    return null;
  };
  const handleBarClick = (key: string) => {
    console.log("Bar clicked:", key);
    onBarClick(key);
  }
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        onClick={(e) =>
         { e.activePayload && setActiveBarId(e.activePayload[0].payload.name)
          handleBarClick( e.activePayload && e.activePayload[0].payload.name)
         }
        }
      >
        <XAxis
          dataKey="name"
          tickLine={false}
          tick={{
            fontSize: 14,
            fontWeight: "400",
            fontFamily: "roboto",
            fill: "black",
          }}
        />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="uv"
          fill="#1565C0"
          onClick={(e) => setActiveBarId(e.name)}
        >
          {data.map((e: any) => (
            <Cell
              key={`cell-${e.name}`}
              fill="#1565C0"
              opacity={e.name === activeBarId ? 1 : 0.5}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart;
