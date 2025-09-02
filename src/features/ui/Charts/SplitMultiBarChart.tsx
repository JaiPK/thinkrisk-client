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
    id?: any;
    name: string;
    volume1: number;
    volume2: number;
    value1: number;
    value2: number;
  }[];
  activeBar?: any;
  onBarClick: (value: any) => void;
}

const SplitMultiBarChart: React.FC<SplitDataProps> = ({ data, activeBar = null, onBarClick }) => {
  const [activeBarId, setActiveBarId] = useState(data.find((item: any) => item.value1 > 0)?.id ?? null);
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
            <strong>Vendor: </strong>
            {label}
            <br />
            {
              currentItem.volume1 > 0 &&
              <>
                <strong>Approved: </strong> {currentItem.volume1}
                <br />
              </>
            }
            {
              currentItem.volume2 > 0 &&
              <>
                <strong>Rejected: </strong> {currentItem.volume2}
                <br />
              </>
            }
            {
              currentItem.value1 > 0 &&
              <>
                <strong>Approved Amount: </strong> {currentItem.value1}
                <br />
              </>
            }
            {
              currentItem.value2 > 0 &&
              <>
                <strong>Rejected Amount: </strong> {currentItem.value2}
                <br />
              </>
            }
          </div>
        );
      }
    }
    return null;
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
      }}
    >
      <div className="w-full"
      >
        <span className="font-roboto font-normal text-[14px] text-black ml-16">
          Volume
        </span>
        <ResponsiveContainer width="100%" height="100%" maxHeight={data.length * 80}>
          <BarChart
            layout="vertical"
            data={data}
            syncId="Sync"
            onClick={(e: any) => {
              onBarClick(e.activePayload?.length ? e.activePayload[0].payload.id : null);
              setActiveBarId(e.activePayload[0].payload.id);
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
              }}
              tickLine={false}
              width={85}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="volume1"
              fill="#1565C0"
              stackId="a"
              barSize={45}
            >
              {data.map((e) => (
                <Cell
                  key={`cell-${e.name}`}
                  fill="#1565C0"
                  opacity={(e.id === activeBarId || e.id == activeBar) ? 1 : 0.5}
                />
              ))}
            </Bar>

            <Bar
              dataKey="volume2"
              fill="#EDC216"
              stackId="a"
            >
              {data.map((e) => (
                <Cell
                  key={`cell-${e.name}`}
                  fill="#EDC216"
                  opacity={(e.id === activeBarId || e.id == activeBar)? 1 : 0.5}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full">
        <span className="font-roboto font-normal text-[14px] text-black ml-12">
          Value
        </span>
        <ResponsiveContainer width="100%" height="100%" maxHeight={data.length * 80}>
          <BarChart
            layout="vertical"
            data={data}
            syncId="Sync"
            onClick={(e: any) => {
              onBarClick(e.activePayload?.length ? e.activePayload[0].payload.id : null);
              setActiveBarId(e.activePayload[0].payload.name);
            }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey=" "
              type="category"
              tick={{
                fontSize: 14,
                fontWeight: "400",
                fontFamily: "roboto",
                fill: "black",
              }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value1"
              fill="#1565C0"
              stackId="b"
              barSize={45}
            >
              {data.map((e) => (
                <Cell
                  key={`cell-${e.name}`}
                  fill="#1565C0"
                  opacity={(e.id === activeBarId || e.id == activeBar)? 1 : 0.5}
                />
              ))}
            </Bar>
            <Bar
              dataKey="value2"
              fill="#EDC216"
              stackId="b"
            >
              {data.map((e) => (
                <Cell
                  key={`cell-${e.name}`}
                  fill="#EDC216"
                  opacity={(e.id === activeBarId || e.id == activeBar)? 1 : 0.5}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default SplitMultiBarChart;
