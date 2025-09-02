import React, { useState } from "react";
import {
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  TooltipProps,
  Cell,
  LabelList,
} from "recharts";
import { useNavigate } from "react-router-dom";
import numberSuffixPipe from "../../../shared/helpers/numberSuffixPipe";



function StackedBarChart({ data, labels, highlightActiveTab, onBarClick }: any) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
  }) => {
    if (active && payload && payload.length && activeIndex !== null) {
      return (
        <div
          style={{
            padding: 10,
            fontSize: 14,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            fontFamily: "roboto",
            fontWeight: "400",
          }}
          >
          <strong>{labels[activeIndex].name}</strong> : { " "}
          {numberSuffixPipe(payload[activeIndex].value as any)}
        </div>
      );
    }
    return null;
  };

  function formatNumber(num: number) {
    const numStr = num.toString();
    const lastThreeDigits = numStr.slice(-3);
    const otherDigits = numStr.slice(0, -3);
    if (otherDigits !== '') {
      return otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThreeDigits;
    } else {
      return lastThreeDigits;
    }
  }

  const getTotalValue = () => {
    let total = 0;
    if (data?.length) {
      labels.forEach((label: any) => {
        total += parseInt(data[0][label.key]);
      });
    }
    return formatNumber(total);
  };

  const CustomStackedBarShape = (props: any) => {
    const { fill, x, y, width, height, value } = props;

    const lineEndX = x + width + 20;
    const lineEndY = y + height / 2;
    const textX = lineEndX + 10;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          rx={5}
          ry={5}
        />
        <line
          x1={x + width}
          y1={lineEndY}
          x2={lineEndX}
          y2={lineEndY}
          stroke={fill}
          strokeWidth={2}
        />
        <text x={textX} y={lineEndY} dy={5} textAnchor="start" fill="#000">
          {numberSuffixPipe(Math.abs(value[1] - value[0]))}
        </text>
      </g>
    );
  };
  const renderCustomizedLabel = (props: any) => {
  const { x, y, width, height } = props;

  return (
    <g>
      <text x={x + width / 2} y={y - height} fill="#000" textAnchor="middle" dominantBaseline="middle">
        {getTotalValue()}
      </text>
    </g>
  );
};

  return (
    <div className="flex flex-col items-center w-full">
      <ResponsiveContainer height={400} width={"100%"} style={{ flex: "1" }} >
        <BarChart 
          layout="horizontal" 
          data={data}           
          margin={{
            top: 30,
            right: 100,
            bottom: 10,
            left: 20,
          }}
        >
          <XAxis
            dataKey="name"
            type="category"
            tick={{
              fontSize: 14,
              fontWeight: "400",
              fontFamily: "roboto",
              fill: "black",
            }}
            scale="point"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {labels?.length > 0 &&
            labels.map((label: any, index: number) => {
              return (
                <Bar
                  dataKey={label.key}
                  fill={index === 0 ? "#1565C0" : "#EDC216"}
                  barSize={80}
                  stackId="a"
                  onMouseEnter={() => {
                    setActiveIndex(index);
                  }}
                  onClick={()=>{
                    onBarClick(index)
                  }}
                  shape={<CustomStackedBarShape />}
                >
                  {data[0][label.key] > 0 && (
                    <>
                      <Cell
                        cursor="pointer"
                        key={`cell-${index}`}
                        onClick={(e: any) => {
                          console.log(e);
                        }}
                        onDoubleClick={() => {
                          navigate("/home/iv/audits/transactions");
                          highlightActiveTab(2);
                        }}
                      />
                      <LabelList dataKey="name" content={renderCustomizedLabel} />
                    </>
                  )}

                </Bar>
              );
            })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StackedBarChart;
