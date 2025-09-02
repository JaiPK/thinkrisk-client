import React from 'react';
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  TooltipProps,
  Cell,
} from 'recharts';
import numberSuffixPipe from '../../../shared/helpers/numberSuffixPipe';

interface ComposedBarChartProps {
    topControlData: any[];
    doubleClick: (event: any) => void;
}

const ComposedBarChart: React.FC<ComposedBarChartProps> = ({ topControlData, doubleClick }) => {
    const currencySymbol = localStorage.getItem("CurrencySymbol");
    const formatYAxis = (tickItem: number) => `${currencySymbol}${(tickItem / 1000000).toFixed(0)}M`;
    const maxDocCount = topControlData.length > 0 ? Math.ceil((Math.max(...topControlData?.map(item => parseInt(item.doccount)))) / Math.ceil((Math.max(...topControlData?.map(item => parseInt(item.doccount)))))) * Math.ceil((Math.max(...topControlData?.map(item => parseInt(item.doccount))))) : 0;

    const [showBar, setShowBar] = React.useState(true);
    const [showLine, setShowLine] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState<any>(null);

    const handleLegendClick = (key: string) => {
        if (key === "Amount") {
            setShowBar(!showBar)
        } else if (key === "Transactions") {
            setShowLine(!showLine)
        }
    };
    const CustomTooltip: React.FC<TooltipProps<number, string>> = () => {
        if (activeTab !== null) {
            const isLine = activeTab.strokeWidth;
            const data = isLine ? activeTab.payload : activeTab;
            return (
                <div
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        padding: '10px',
                        color: 'white',
                        fontFamily: 'Roboto, sans-serif',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(8px)',
                        maxWidth: 'max-content',
                    }}
                >
                    <strong style={{ display: "flex", alignItems: "center", marginBottom: "-30px" }}>{isLine > 0 ? "Transactions" : "Amount"}</strong> <br /> <hr />
                    <p style={{ display: "flex" }}>
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", marginRight: "4px", background: isLine > 0 ? "#f90000" : "#0397d6" }}></div>
                        <strong>{data.ruletitle}</strong><br />
                    </p>
                    <strong>No. of Document</strong>:{" "} { data.doccount}<br />
                    <strong>Total Credit</strong>:{" "} {numberSuffixPipe(data.totalcredit)}<br />
                    <strong>Total Debit</strong>:{" "} {numberSuffixPipe(data.totaldebit)}<br />
                </div>
            );
        }
        return null;
    }
    return (
        <>
            <div className='flex justify-center w-full items-center'>
                <div className='flex font-roboto  cursor-pointer items-center' onClick={() => handleLegendClick("Amount")} >
                    <BarChartIcon style={{ color: showBar ? "#0397d6" : "grey", marginLeft: "8px" }} />
                    <p
                        style={{ opacity: showBar ? "0.8" : "0.5", color: showBar ? "black" : "grey", marginRight: "8px" }}
                    >
                        Amount
                    </p>
                </div>
                <div className='flex font-roboto cursor-pointer items-center' onClick={() => handleLegendClick("Transactions")} >
                    <TimelineIcon style={{ color: showLine ? "#f90000" : "grey", marginLeft: "8px" }} />
                    <p
                        style={{ opacity: showLine ? "0.8" : "0.5", color: showLine ? "black" : "grey" }}
                    >
                        Transactions
                    </p>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                    data={topControlData}
                    margin={{
                        top: 0,
                        right: 10,
                        bottom: 90,
                        left: 10,
                    }}
                >
                    <CartesianGrid />
                    <XAxis dataKey="ruletitle" fontSize={12} tickLine={false} textAnchor='start' angle={45} />
                    <Tooltip content={<CustomTooltip />} />
                    {showBar && (
                        <>
                            <YAxis yAxisId="left" tickFormatter={formatYAxis} fontSize={12} fontFamily='roboto' />
                            <Bar
                                yAxisId="left"
                                dataKey="totalcredit"
                                fill="#0397d6"
                                onDoubleClick={(e: any) => { doubleClick(e) }}
                            >
                                {topControlData?.map((e: any, index: any) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill="#1565C0"
                                        onMouseEnter={() => setActiveTab(e)}
                                        onMouseLeave={() => setActiveTab(null)}
                                    />
                                ))}
                            </Bar>
                        </>
                    )}
                    {showLine && (
                        <>
                            <YAxis yAxisId="right" orientation="right"
                                label={{
                                    value: "Transactions",
                                    angle: 90,
                                    position: 'insideRight',
                                    style: {
                                        textAnchor: 'middle',
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fill: '#666'
                                    }
                                }}
                                domain={[0, maxDocCount + 5]}
                                fontFamily='roboto'
                                fontSize={12}
                            />
                            <Line
                            isAnimationActive={false}
                                yAxisId="right"
                                type="linear"
                                dataKey="doccount"
                                stroke="#f90000"
                                strokeWidth={3}
                                dot={{ onMouseEnter: (e: any) => { setActiveTab(e) }, onDoubleClick: (e: any) => { doubleClick(e.payload) }, onMouseLeave: () => { setActiveTab(null) } }}
                                activeDot={false}
                            />
                        </>
                    )}
                </ComposedChart>
            </ResponsiveContainer>
        </>
    );
}

export default ComposedBarChart;