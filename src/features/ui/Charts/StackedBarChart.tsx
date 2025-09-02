import React, { useState, useEffect } from "react";
import { FormControlLabel, Checkbox } from '@material-ui/core';
import BarChartIcon from '@mui/icons-material/BarChart';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    TooltipProps,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { useAppDispatch } from "../../../hooks";
import numberSuffixPipe from "../../../shared/helpers/numberSuffixPipe";
import { 
    updateStartDate, 
    updateSelectedRisk,
    updateEndDate 
} from "../../modules/gl-slice/GLSlice";

interface StackedBarChartDataProps {
    data: any;
    doubleClick: (event: any) => void;
}

const StackedBarChart: React.FC<StackedBarChartDataProps> = ({ data, doubleClick }) => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [byYear, setByYear] = useState(true);
    const [byMonth, setByMonth] = useState(false);
    const [byQuarter, setByQuarter] = useState(false);
    const [showHigh, setShowHigh] = useState(true);
    const [showMedium, setShowMedium] = useState(true);
    const [showLow, setShowLow] = useState(true);
    const [showLowest, setShowLowest] = useState(true);
    const [activeBar, setActiveBar] = useState<any[]>([]);
    const formatYAxis = (tickItem: number) => `${(tickItem / 1000000).toFixed(0)}M`;
    const dispatch = useAppDispatch();


    const handleLegendClick = (key: string) => {
        if (key === "High") {
            setShowHigh(!showHigh);
        } else if (key === "Medium") {
            setShowMedium(!showMedium);
        } else if (key === "Low") {
            setShowLow(!showLow);
        }
        else if (key === "Lowest") {
            setShowLowest(!showLowest);
        }
    };

    useEffect(() => {
        if (data) {
            if (byYear && data.byyear) {
                const updatedYearData = data.byyear
                    .filter((item: any) => item.LEVEL !== null)
                    .reduce((acc: any[], curr: any) => {
                        const existingYear = acc.find((year) => year.name === curr.yearvalue);
                        const levelKey = curr.LEVEL;

                        const levelData = {
                            doccount: curr.doccount,
                            totaldebit: curr.totaldebit,
                            totalcredit: curr.totalcredit,
                            name: curr.yearvalue,
                        };

                        if (existingYear) {
                            existingYear[levelKey] = levelData;
                        } else {
                            acc.push({
                                name: curr.yearvalue,
                                [levelKey]: levelData,
                            });
                        }

                        return acc;
                    }, []);
                setChartData(updatedYearData);
            } else if (byQuarter && data.byquarter) {
                const updatedQuarterData = data.byquarter
                    .filter((item: any) => item.LEVEL !== null)
                    .reduce((acc: any[], curr: any) => {
                        const xaxis = `${curr.yearvalue} Q${curr.quarterno}`;
                        const existingQuarter = acc.find((quarter) => quarter.name === xaxis);
                        const levelKey = curr.LEVEL;

                        const levelData = {
                            doccount: curr.doccount,
                            totaldebit: curr.totaldebit,
                            totalcredit: curr.totalcredit,
                            name: xaxis,
                        };

                        if (existingQuarter) {
                            existingQuarter[levelKey] = levelData;
                        } else {
                            acc.push({
                                name: xaxis,
                                [levelKey]: levelData,
                            });
                        }

                        return acc;
                    }, []);
                setChartData(updatedQuarterData);
            } else if (byMonth && data.bymonth) {
                const updatedMonthData = data.bymonth
                    .filter((item: any) => item.LEVEL !== null)
                    .reduce((acc: any[], curr: any) => {
                        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        const monthName = monthNames[curr.monthno - 1];
                        const xaxis = `${curr.yearvalue} ${monthName}`;
                        const existingMonth = acc.find((month) => month.name === xaxis);
                        const levelKey = curr.LEVEL;

                        const levelData = {
                            doccount: curr.doccount,
                            totaldebit: curr.totaldebit,
                            totalcredit: curr.totalcredit,
                            name: xaxis,
                        };

                        if (existingMonth) {
                            existingMonth[levelKey] = levelData;
                        } else {
                            acc.push({
                                name: xaxis,
                                [levelKey]: levelData,
                            });
                        }

                        return acc;
                    }, []);

                setChartData(updatedMonthData);
            }
        }
    }, [data, byMonth, byQuarter, byYear]);

    const CustomTooltip: React.FC<TooltipProps<any, any>> = ({ payload, label }) => {
        if (activeBar && activeBar.length) {
            const extractTooltipData = (data: any) => {
                const segmentLevel = data[0].name;
                const segmentData = data[0].payload[segmentLevel];
                return segmentData || null;
            };
            const extractedData = extractTooltipData(activeBar)
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
                    <strong>{activeBar[0].name}</strong><hr />
                    <div style={{ display: "flex" }}>
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", marginRight: "4px", background: activeBar[0].name === "HIGH" ? "#FF4B3D" : activeBar[0].name === "Low" ? "#FFE548" : activeBar[0].name === "LOWEST" ? "#00A4DF":  "#FFB10F" }}></div>
                        <strong>Number of documents:</strong>{" "}{extractedData.doccount}<br />
                    </div>
                    <strong>Year:</strong>{" "}{label}<br />
                    <strong>Total Credit:</strong>{" "}{numberSuffixPipe(extractedData.totalcredit)}<br />
                    <strong>Total Debit:</strong>{" "}{numberSuffixPipe(extractedData.totaldebit)}<br />
                </div>

            );
        }
        return null;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            case 'byYear':
                setByYear(event.target.checked);
                setByQuarter(false);
                setByMonth(false);
                break;
            case 'byMonth':
                setByMonth(event.target.checked);
                setByYear(false);
                setByQuarter(false);
                break;
            case 'byQuarter':
                setByQuarter(event.target.checked);
                setByMonth(false);
                setByYear(false);
                break;
        }
    };

    function getFinancialPeriod(period: 'year' | 'month' | 'quarter', input: string, yearStartMonth: number): { start: string, end: string } {
        let startYear: number;
        let endYear: number;
        let startMonth: number;
        let endMonth: number;
        let endDay: number;
        if (period === 'year') {
            startYear = +input.substring(0, 4);
            endYear = +input.substring(5, 9);
            startMonth = yearStartMonth;
            endMonth = yearStartMonth;
            endDay = new Date(endYear, endMonth + 1, 1).getDate();

        }
        else if (period === 'quarter') {
            const quarterNum = +input.substring(9, 10);
            startYear = +input.substring(0, 4);
            startMonth = yearStartMonth + (quarterNum - 1) * 3;
            endYear = startYear;
            endMonth = startMonth + 3;
            if (endMonth >= 12) {
                endMonth -= 12;
                endYear++;
            }
            endDay = new Date(endYear, endMonth + 1, 1).getDate();


        }
        else if (period === 'month') {
            startYear = +input.substring(0, 4);
            startMonth = +input.substring(9, 10) - 1;
            endYear = startYear;
            endMonth = startMonth + 1;
            endDay = new Date(endYear, endMonth, 1).getDate();
        }
        else {
            throw new Error(`Invalid period: ${period}`);
        }
        const start = new Date(startYear, startMonth, 2);
        const end = new Date(endYear, endMonth, endDay);

        return { start: start.toISOString().substring(0, 10), end: end.toISOString().substring(0, 10) };

    }

    const onDoubleClick = (event: any) => {
        if (byQuarter) {
            const { start, end } = getFinancialPeriod('quarter', event[0].payload.name, 3);
            dispatch(updateStartDate(start));
            dispatch(updateEndDate(end));

        }
        else if (byMonth) {
            const { start, end } = getFinancialPeriod('month', event[0].payload.name, 3);
            dispatch(updateStartDate(start));
            dispatch(updateEndDate(end));
        }
        else {
            const { start, end } = getFinancialPeriod('year', event[0].payload.name, 3);
            dispatch(updateStartDate(start));
            dispatch(updateEndDate(end));
        }
        doubleClick(event)
    }

    return (
        <div className="flex flex-col w-full">
            <div>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={byYear}
                            onChange={handleChange}
                            name="byYear"
                        />
                    }
                    label="By Year"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={byQuarter}
                            onChange={handleChange}
                            name="byQuarter"
                        />
                    }
                    label="By Quarter"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={byMonth}
                            onChange={handleChange}
                            name="byMonth"
                        />
                    }
                    label="By Month"
                />
            </div>
            <p className="flex justify-center">Anomaly Trend Analysis</p>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                    <XAxis
                        dataKey="name"
                        tickFormatter={(tickItem) => {
                            if (byMonth) {
                                const [year, month] = tickItem.split(' ');
                                const Subyear = year.split('-')
                                return `${Subyear[0]} ${month}`;
                            }
                            return tickItem;
                        }}
                    />

                    <YAxis tickFormatter={formatYAxis} />
                    <Tooltip content={<CustomTooltip />} />
                    <CartesianGrid strokeDasharray="4 4" />
                    {showHigh && (
                        <Bar
                            dataKey="HIGH.totalcredit"
                            stackId="a"
                            name="HIGH"
                            fill="#FF4B3D"
                            barSize={40}
                            onMouseEnter={(e) => setActiveBar(e.tooltipPayload)}
                            onMouseLeave={() => setActiveBar([])}
                            onDoubleClick={(e) => {
                                dispatch(updateSelectedRisk("1"));
                                onDoubleClick(e.tooltipPayload)
                            }}
                        />
                    )}
                    {showMedium && (
                        <Bar
                            dataKey="MEDIUM.totalcredit"
                            stackId="a"
                            name="MEDIUM"
                            fill="#FFB10F"
                            barSize={40}
                            onMouseEnter={(e) => setActiveBar(e.tooltipPayload)}
                            onMouseLeave={() => setActiveBar([])}
                            onDoubleClick={(e) => {
                                dispatch(updateSelectedRisk("2"));
                                onDoubleClick(e.tooltipPayload)
                            }}
                        />
                    )}
                    {showLow && (
                        <Bar
                            dataKey="LOW.totalcredit"
                            stackId="a"
                            name="LOW"
                            fill="#FFE548"
                            barSize={40}
                            onMouseEnter={(e) => setActiveBar(e.tooltipPayload)}
                            onMouseLeave={() => setActiveBar([])}
                            onDoubleClick={(e) => {
                                dispatch(updateSelectedRisk("3"));
                                onDoubleClick(e.tooltipPayload)
                            }}
                        />
                    )}
                    {
                        showLowest && (
                            <Bar
                                dataKey="LOWEST.totalcredit"
                                stackId="a"
                                name="LOWEST"
                                fill="#00A4DF"
                                barSize={40}
                                onMouseEnter={(e) => setActiveBar(e.tooltipPayload)}
                                onMouseLeave={() => setActiveBar([])}
                                onDoubleClick={(e) => {
                                    dispatch(updateSelectedRisk("4"));
                                    onDoubleClick(e.tooltipPayload)
                                }}
                            />
                        )
                    }
                </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center items-center">
                <div className='flex font-roboto  cursor-pointer items-center' onClick={() => handleLegendClick("High")} >
                    <BarChartIcon style={{ color: showHigh ? "#FF4B3D" : "grey", marginLeft: "8px" }} />
                    <p
                        style={{ opacity: showHigh ? "0.8" : "0.5", color: showHigh ? "black" : "grey", marginRight: "8px" }}
                    >
                        High
                    </p>
                </div>
                <div className='flex font-roboto cursor-pointer items-center' onClick={() => handleLegendClick("Medium")} >
                    <BarChartIcon style={{ color: showMedium ? "#FFB10F" : "grey", marginLeft: "8px" }} />
                    <p
                        style={{ opacity: showMedium ? "0.8" : "0.5", color: showMedium ? "black" : "grey" }}
                    >
                        Medium
                    </p>
                </div>
                <div className='flex font-roboto cursor-pointer items-center' onClick={() => handleLegendClick("Low")} >
                    <BarChartIcon style={{ color: showLow ? "#FFE548" : "grey", marginLeft: "8px" }} />
                    <p
                        style={{ opacity: showLow ? "0.8" : "0.5", color: showLow ? "black" : "grey" }}
                    >
                        Low
                    </p>
                </div>
                <div className='flex font-roboto cursor-pointer items-center' onClick={() => handleLegendClick("Lowest")} >
                    <BarChartIcon style={{ color: showLowest ? "#00A4DF" : "grey", marginLeft: "8px" }} />
                    <p
                        style={{ opacity: showLowest ? "0.8" : "0.5", color: showLowest ? "black" : "grey" }}
                    >
                        Lowest
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StackedBarChart;