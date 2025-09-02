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
import numberSuffixPipe from "../../../shared/helpers/numberSuffixPipe";
import BarChartIcon from '@mui/icons-material/BarChart';

interface SimpleBarChartDataProps {
  data: any[];
}

const SimpleBarChart: React.FC<SimpleBarChartDataProps> = ({ data }) => {
  const [showBar, setShowBar] = useState(true);
  const currencySymbol = localStorage.getItem("CurrencySymbol");
  const formatYAxis = (tickItem: number) => `${currencySymbol}${numberSuffixPipe(tickItem)}`;
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
    label,
  }) => {
      if (active && payload && payload.length) {
        const currentItem = payload[0].payload;
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
                <strong>Account Id</strong> {currentItem.accid}
                <br />
                <strong>Description</strong> {currentItem.des}
                <br />
                <strong>Amount</strong> {numberSuffixPipe(currentItem.amount)}
            </div>
            );
        }
    }
    return null;
  };
  return (
    <>
        <div className='flex justify-center w-full items-center'>
            <div className='flex font-roboto  cursor-pointer items-center' onClick={() => setShowBar(!showBar)} >
                <BarChartIcon style={{ color: showBar ? "#0397d6" : "grey", marginLeft: "8px" }} />
                <p
                    style={{ opacity: showBar ? "0.8" : "0.5", color: showBar ? "black" : "grey", marginRight: "8px" }}
                >
                    Amount
                </p>
            </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
        <BarChart
            data={data}
            margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
            }}
        >
            <XAxis
            dataKey="des"
            tickLine={false}
            tick={{
                fontSize: 14,
                fontWeight: "400",
                fontFamily: "roboto",
                fill: "black",
            }}
            />
            <YAxis
                yAxisId="left" 
                tickFormatter={formatYAxis}
                tickLine={false}
                tick={{
                    fontSize: 14,
                    fontWeight: "400",
                    fontFamily: "roboto",
                    fill: "black",
                }}
            />
            <Tooltip content={<CustomTooltip />} />
            {showBar && (
                <Bar
                    yAxisId="left"
                    dataKey="amount"
                    fill="#1565C0"
                    >
                    {data.map((e: any) => (
                        <Cell
                        key={`cell-${e.name}`}
                        fill="#1565C0"
                        />
                    ))}
                </Bar>
            )}
        </BarChart>
        </ResponsiveContainer>
    </>
  );
};

export default SimpleBarChart;
