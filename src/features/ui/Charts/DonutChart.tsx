import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import { useNavigate } from "react-router-dom";

interface DonutDataProps {
  data: { name: string; value: number }[];
  onSelect(value: any): void;
  highlightActiveTab(tabIndex: number): void;
}
const COLORS = ["#1565C0", "#EDC216"];

const RADIAN = Math.PI / 180;

export default function DonutChart({
  data,
  onSelect,
  highlightActiveTab,
}: DonutDataProps) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = React.useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  const handlePieClick = (data: any, index: number) => {
    highlightActiveTab(2);
    navigate("/home/iv/audits/transactions");
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
  }) => {
    const radius = innerRadius + (outerRadius - (innerRadius + 20)) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        color="#1565C0"
        dominantBaseline="central"
      >
        {`${percent > 0 ? (percent * 100).toFixed(0) + "%" : ""}`}
      </text>
    );
  };

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            padding: 10,
            fontSize: 14,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            fontFamily: "roboto",
          }}
        >
          <strong>{payload[0].name}</strong> : {payload[0].value}
          <br />
        </div>
      );
    }
    return null;
  };
  return (
    <ResponsiveContainer width={"100%"} style={{ flex: "2" }}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          activeIndex={activeIndex}
          labelLine={false}
          label={renderCustomizedLabel}
          innerRadius={"50%"}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
          onDoubleClick={(e) => handlePieClick(e, activeIndex)}
          onClick={(e: any) => onSelect(e.payload)}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "34px", fontWeight: "bold", color: "#1565C0" }}
        >
          {`${data[0].value + data[1].value}`}
        </text>
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "16px", fontWeight: "400", color: "#1565C0" }}
        >
          Invoices
        </text>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
