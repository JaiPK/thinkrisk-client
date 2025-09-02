import React, {useState} from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
  TooltipProps
} from "recharts";
import dayjs from "dayjs";
import numberSuffixPipe from "../../../shared/helpers/numberSuffixPipe";

interface MultiLineChartProps {
  data: {
    name: string;
    data: { x: string; y: number; y1: number }[];
  }[];
  colour: string[];
  tenure: number;
  activeTab: number;
  onPeriodChange: (value: any) => void;
}

const MultiLineChart: React.FC<MultiLineChartProps> = ({
  data,
  colour,
  tenure,
  activeTab,
  onPeriodChange
}) => {
  const [activeName, setActiveName] = useState("") as any;

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
    label
  }) => {
    if (active && payload && payload.length) {
      const matchingData = payload[0].payload.value.find(
        (item: any) => item.name === activeName
      );

      if (matchingData !== undefined) {
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
            <strong>{matchingData.name}</strong><br/>  
            <strong>{activeTab === 0 ? "No. of Invoice" : "Amount"}</strong>:{" "}
            {activeTab === 0 ? matchingData.y : numberSuffixPipe(matchingData.y)}
          </div>
        );
      }
    }
    return null;
  };

  const formatX = (value: any, tenure: number) => {
    switch (tenure) {
      case 0:
        return dayjs(value).format('YYYY');
      case 1:
        return `${`Q${Math.ceil((dayjs(value).month() + 1) / 3)}`} ${dayjs(value).format("YYYY")}`;
      case 2:
        return dayjs(value).format('MMM YYYY');
    }
  };

    const prepareChartData = (series: any, tenure: number, activeTab: number) => {
    const combinedData = series.reduce((acc: any, currentSeries: any) => {
      currentSeries.data.forEach((item: any) => {
        const existingEntry = tenure === 1 
          ? acc.find((d: any) => d.x === formatX(item.x, 1)) 
          : acc.find((d: any) => formatX(d.x, tenure) === formatX(item.x, tenure));
        const existingName = existingEntry ? existingEntry.value.find((data: any) => data.name === currentSeries.name) : null;
        if (existingEntry && existingName && item.y > 0) {
          existingName.y = activeTab === 0 ? existingName.y + item.y : parseFloat(existingName.y) + parseFloat(item.y1);
        } else if (existingEntry && item.y > 0) {
          existingEntry.value.push({ name: currentSeries.name, y: activeTab === 0 ? item.y : item.y1 });
        } else if (item.y > 0) {
          acc.push({
            x: item.x === null ? "No Date" : formatX(item.x, tenure),
            value: [{ name: currentSeries.name, y: activeTab === 0 ? item.y : item.y1 }],
          });
        }
      });
      return acc;
    }, []);
    const noDateEntries = combinedData.filter((item: any) => item.x === "No Date");
    const dateEntries = combinedData.filter((item: any) => item.x !== "No Date");
    const sortedDateEntries = tenure === 1 
      ? dateEntries.sort((a: any, b: any) => dayjs(a.x, 'Q[Q] YYYY').valueOf() - dayjs(b.x, 'Q[Q] YYYY').valueOf()) 
      : dateEntries.sort((a: any, b: any) => dayjs(a.x).valueOf() - dayjs(b.x).valueOf());
    return [...sortedDateEntries, ...noDateEntries];
  };

  const ChartData = prepareChartData(data, tenure, activeTab);

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={500}>
      <LineChart 
        data={ChartData}           
        margin={{
          top: 50,
          right: 10,
          bottom: 90,
          left: 10,
        }}>
        <XAxis
          dataKey="x"
          type="category"
          allowDuplicatedCategory={false}
          tickLine={false}
          padding={{ left: 30, right: 30 }}
          interval={0}
          tick={{fontSize: 12, fontFamily:"Roboto", fill:"#000"}}
        />
        <YAxis 
          tickLine={false}
          padding={{ top: 30, bottom: 30 }} 
          tick={{fontSize: 12, fontFamily:"Roboto", fill:"#000"}} 
          label={{
            value: activeTab === 0 ? "Volume" : "Value", 
            position: "top",
            fill: "#000",
            offset: 25,
            dx: 30
          }}
        />
        <Tooltip content={<CustomTooltip />}/>
        {data.map((series: any, index: any) => (
          <Line
            isAnimationActive={false}
            key={series.name}   
            type="linear"
            dataKey={(d: any) => {
              const entry = d.value.find((v: any) => v.name === series.name);
              return entry ? entry.y : null;
            }}
            stroke={colour[index]}
            activeDot={false}
            connectNulls
            dot={{onMouseEnter: (e: any)=>{setActiveName(series.name)}}}
          >
          </Line>
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MultiLineChart;