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
import dayjs from "dayjs";
import numberSuffixPipe from '../../../shared/helpers/numberSuffixPipe';

interface EDComposedBarChartProps {
    data: any[];
    tenure: number;
}

const EDComposedBarChart: React.FC<EDComposedBarChartProps> = ({ data, tenure }) => {
    const currencySymbol = localStorage.getItem("CurrencySymbol");
    const formatYAxis = (tickItem: number) => `${currencySymbol}${numberSuffixPipe(tickItem)}`;
    const [showBar, setShowBar] = React.useState(true);
    const [showLine, setShowLine] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState<any>(null);

    const formatX = (value: any, tenure: number) => {
        if (value.includes(" ")) {
            const date = new Date(value);
            const padZero = (num: any) => (num < 10 ? `0${num}` : num);
            const formattedDate = `${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}-${date.getFullYear()}`;
            value = formattedDate;
        }
        switch (tenure) {
            case 0:
                return dayjs(value).format('YYYY');
            case 1:
                return `${`Q${Math.ceil((dayjs(value).month() + 1) / 3)}`} ${dayjs(value).format("YYYY")}`;
            case 2:
                return dayjs(value).format('MMM YYYY');
        }
    };

    const prepareChartData = (series: any, tenure: number) => {
        const combinedData = series.reduce((acc: any, currentSeries: any) => {
            if (currentSeries?.posted_date) {
                const formattedDate = formatX(currentSeries.posted_date, tenure);
                const existingEntry = acc.find((d: any) => d.x === formattedDate);
                if (existingEntry) {
                    existingEntry.amount += parseFloat(currentSeries.total_amount);
                    existingEntry.doccount += currentSeries.doccount;
                } else {
                    acc.push({
                        x: formattedDate,
                        amount: parseFloat(currentSeries.total_amount),
                        doccount: currentSeries.doccount,
                    });
                }
            }
            return acc;
        }, []);

        const noDateEntries = combinedData.filter((item: any) => item.x === "No Date");
        const dateEntries = combinedData.filter((item: any) => item.x !== "No Date");

        const sortedDateEntries = tenure === 1
            ? dateEntries.sort((a: any, b: any) => dayjs(a.x, 'Q[Q] YYYY').valueOf() - dayjs(b.x, 'Q[Q] YYYY').valueOf())
            : dateEntries.sort((a: any, b: any) => dayjs(a.x).valueOf() - dayjs(b.x).valueOf());

        return [...sortedDateEntries, ...noDateEntries];
    };


    const ChartData = prepareChartData(data, tenure);

    const maxDocCount = ChartData.length > 0 ? Math.ceil(Math.max(...ChartData?.map(item => parseInt(item.doccount)))) : 0;


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
                    <strong>No. of Document</strong>:{" "} {data.doccount}<br />
                    <strong>Total Credit</strong>:{" "} {numberSuffixPipe(data.amount)}<br />
                    <strong>Tenure</strong>:{" "} {data.x}<br />
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
                    data={ChartData}
                    margin={{
                        top: 0,
                        right: 10,
                        bottom: 90,
                        left: 10,
                    }}
                >
                    <CartesianGrid />
                    <XAxis
                        dataKey="x"
                        type="category"
                        allowDuplicatedCategory={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {showBar && (
                        <>
                            <YAxis yAxisId="left" tickFormatter={formatYAxis} fontSize={12} fontFamily='roboto' />
                            <Bar
                                yAxisId="left"
                                dataKey="amount"
                                fill="#0397d6"
                                barSize={20}
                            >
                                {ChartData?.map((e: any, index: any) => (
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
                                domain={[0, maxDocCount + 20]}
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
                                dot={{ onMouseEnter: (e: any) => { setActiveTab(e) }, onMouseLeave: () => { setActiveTab(null) } }}
                                activeDot={false}
                            />
                        </>
                    )}
                </ComposedChart>
            </ResponsiveContainer>
        </>
    )
}

export default EDComposedBarChart