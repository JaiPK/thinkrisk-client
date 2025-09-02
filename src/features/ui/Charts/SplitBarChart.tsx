import React, { useState } from "react";
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

interface SplitDataProps {
  data: {
    id: number;
    name: string;
    volume1: number;
    volume2: number;
  }[];
  onBarClick?: (id: any) => void;
  height?: number;
  opacity?: boolean;
  lables: string[];
}

const SplitBarChart: React.FC<SplitDataProps> = ({
  data,
  onBarClick,
  height,
  opacity,
  lables
}) => {
  
  const [activeBarId, setActiveBarId] = useState(data.length ? data[0].id : null);
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
            <strong>{label}</strong>
            <br />
            <strong>{lables[0]}: </strong>
            {currentItem.volume1}
            <br />
            <strong>{lables[1]}: </strong>
            {currentItem.volume2}
          </div>
        );
      }
    }

    return null;
  };
  return (
    <div className="w-[85%]">
      <span className="font-roboto font-normal text-[14px] text-black ml-12">
        Volume
      </span>
      <ResponsiveContainer
        width="100%"
        height="100%"
        maxHeight={height ? height : 700}
      >
        <BarChart
          layout="vertical"
          data={data}
          onClick={(e) => {
            if (e.activePayload && onBarClick) {
              setActiveBarId(e.activePayload[0].payload.id);
              onBarClick(e.activePayload[0].payload.id);
            }
          }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            tick={{
              fontSize: 14,
              fontWeight: "400",
              fontFamily: "roboto",
              fill: "black",
              x: 65,
            }}
            tickLine={false}
            width={82}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="volume1"
            fill= {lables[0] === 'Extraction success' ? "#008000":"#1565C0"} 
            stackId="a"
            barSize={40}
          >
            {opacity &&
              data.map((e) => (
                <Cell
                  key={`cell-${e.id}`}
                  opacity={(e.id === activeBarId) ? 1 : 0.5}
                />
              ))}
          </Bar>
          <Bar
            dataKey="volume2"
              fill= {lables[0] === 'Extraction success' ? "#FF7454":"#EDC216"} 
            stackId="a"
            barSize={40}
          >
            {opacity &&
              data.map((e) => (
                <Cell
                  key={`cell-${e.id}`}
                 
                  opacity={(e.id === activeBarId) ? 1 : 0.5}
                />
              ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default SplitBarChart;
