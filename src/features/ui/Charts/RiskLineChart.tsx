import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
// import numberSuffixPipe from "../../../../../shared/helpers/numberSuffixPipe";
// import { useAppDispatch } from "../../../../../hooks";
import { useNavigate } from "react-router-dom";
import TimelineIcon from '@mui/icons-material/Timeline';
import { updateAPEndDate, updateAPSelectedRisk, updateAPStartDate  } from '../../modules/ap-slice/APSlice';
import { useAppDispatch } from '../../../hooks';
import numberSuffixPipe from '../../../shared/helpers/numberSuffixPipe';
// import { updateAPEndDate, } from "../../../ap-slice/APSlice";

export interface Props {
    topAnomalyTrendData: any[];
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const sorter = (a: any, b: any) => {
    const monthA = months.indexOf(a.month.split(" ")[0]);
    const monthB = months.indexOf(b.month.split(" ")[0]);
    const yearA = a.month.split(" ")[1];
    const yearB = b.month.split(" ")[1];

    if (yearA !== yearB) {
        return yearA - yearB;
    } else {
        return monthA - monthB;
    }
};

function RiskLineChart({ topAnomalyTrendData }: Props) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const currencySymbol = localStorage.getItem("CurrencySymbol");
    const [chartData, setChartData] = React.useState<any[]>([]);
    const [activeDot, setActiveDot] = React.useState<any>(null);
    const [activeLine,setActiveLIine] = React.useState<any []>(['High','Medium','Low']);
    const onDoubleClickTrends = (event: any) => {
        const DataFiltered = topAnomalyTrendData.filter(
            (item) => item.LEVEL === event.dataKey.toUpperCase()
                && (item.month).slice(0, 3) === event.payload.month.split(" ")[0]
                && item.year === event.payload.month.split(" ")[1]
        );
        if (event.dataKey.toUpperCase() === "HIGH") {
            let getSpecificIndexData = DataFiltered[0]
            console.log(getSpecificIndexData)
            let month = getSpecificIndexData.month
            let year = getSpecificIndexData.year
            let monthNumber = getMonth(month)
            let startMonth = addLeadingZeroToMonth(monthNumber)
            let lastDayOfMonth = getLastDayOfMonth(monthNumber, year);
            let lastDayWithMonthAndYear = lastDayOfMonth.toISOString().substring(0, 10)

            dispatch(updateAPStartDate(`${year}-${startMonth}-01`))
            dispatch(updateAPEndDate(`${lastDayWithMonthAndYear}`))
            dispatch(
                updateAPSelectedRisk([
                    "1"])
            );
        }
        else if (event.dataKey.toUpperCase() === "MEDIUM") {
            let getSpecificIndexData = DataFiltered[0]
            let month = getSpecificIndexData.month
            let year = getSpecificIndexData.year
            let monthNumber = getMonth(month)
            let startMonth = addLeadingZeroToMonth(monthNumber)
            let lastDayOfMonth = getLastDayOfMonth(monthNumber, year);
            let lastDayWithMonthAndYear = lastDayOfMonth.toISOString().substring(0, 10)

            dispatch(updateAPStartDate(`${year}-${startMonth}-01`))
            dispatch(updateAPEndDate(`${lastDayWithMonthAndYear}`))
            dispatch(
                updateAPSelectedRisk([
                    "2"
                ])
            );
        }
        else if (event.dataKey.toUpperCase() === "LOW") {
            let getSpecificIndexData = DataFiltered[0]
            let month = getSpecificIndexData.month
            let year = getSpecificIndexData.year
            let monthNumber = getMonth(month)
            let startMonth = addLeadingZeroToMonth(monthNumber)
            let lastDayOfMonth = getLastDayOfMonth(monthNumber, year);
            let lastDayWithMonthAndYear = lastDayOfMonth.toISOString().substring(0, 10)

            dispatch(updateAPStartDate(`${year}-${startMonth}-01`))
            dispatch(updateAPEndDate(`${lastDayWithMonthAndYear}`))
            dispatch(
                updateAPSelectedRisk([
                    "3"
                ])
            );
        }
        let url = window.location.pathname.split("/");
        url.pop();
        url.push("transactions");
        navigate(url.join("/"));
    };
    function getMonth(monthStr: string) {
        return new Date(monthStr + '-1-01').getMonth() + 1
    }
    function addLeadingZeroToMonth(month: number) {
        return month.toString().padStart(2, '0'); // pad the month number with a leading zero if it is a single digit
    }
    function getLastDayOfMonth(month: number, year: number) {
        const firstDayOfNextMonth = new Date(year, month, 1); // create a new Date object for the first day of the next month
        const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1); // subtract one day from the first day of the next month to get the last day of the current month
        return lastDayOfMonth;
    }
    const setData = () => {
        const dataMap: { [key: string]: any } = {};

        topAnomalyTrendData.forEach(item => {
            const monthYear = `${(item.month).slice(0, 3)} ${item.year}`;

            if (!dataMap[monthYear]) {
                dataMap[monthYear] = {
                    month: monthYear,
                    high: 0,
                    medium: 0,
                    low: 0,
                };
            }

            if (item.LEVEL === "HIGH") {
                dataMap[monthYear].high += item.DEBIT_AMOUNT;
            } else if (item.LEVEL === "MEDIUM") {
                dataMap[monthYear].medium += item.DEBIT_AMOUNT;
            } else if (item.LEVEL === "LOW") {
                dataMap[monthYear].low += item.DEBIT_AMOUNT;
            }
        });

        const formattedData = Object.values(dataMap);
        formattedData.sort(sorter);
        setChartData(formattedData);
    };

    React.useEffect(() => {
        setData();
    }, [topAnomalyTrendData]);
    const handleRemoveChart = (entry: string) => {
        if(activeLine.includes(entry)){
            setActiveLIine(activeLine.filter((item)=>item !== entry));
        }else{
            setActiveLIine([...activeLine,entry]);
        }
    }
    const CustomTooltip: React.FC<TooltipProps<number, string>> = () => {
        if (!activeDot) return null;

        const TooltipData = topAnomalyTrendData.filter(
            (item) => item.LEVEL === activeDot.dataKey.toUpperCase()
                && (item.month).slice(0, 3) === activeDot.payload.month.split(" ")[0]
                && item.year === activeDot.payload.month.split(" ")[1]
        );

        return TooltipData.length ? (
            <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '10px',
                color: 'white',
                fontFamily: 'Roboto, sans-serif',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
                maxWidth: 'max-content',
                textAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
            }}>
                <p><strong>Transactions:</strong>{" "} {TooltipData[0]?.doccount}</p>
                <p><strong>Month:</strong>{" "}{TooltipData[0]?.month}</p>
                <p><strong>Year:</strong>{" "}{TooltipData[0]?.year}</p>
                <p><strong>Risk Level:</strong>{" "}{(TooltipData[0]?.LEVEL)}</p>
                <p><strong>Amount:</strong>{numberSuffixPipe(TooltipData[0]?.DEBIT_AMOUNT)}</p>
            </div>
        ) : null;
    };

    return (
        <div className='flex flex-col items-center gap-4'>
            {topAnomalyTrendData.length === 0 ? (
                <>
                    <p style={{ textAlign: 'center' }}>Anomaly Trend Analysis</p>
                    <p style={{ marginLeft: '2%' }}>No Records</p>
                </>
            ) : (
                <>
                <ResponsiveContainer width="100%" height={500}>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
                        <CartesianGrid strokeDasharray="1 1" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} position={{ x: activeDot?.x, y: activeDot?.y }} />
                        {
                                activeLine.includes('High') ? (<Line
                                    type="linear"
                                    dataKey="high"
                                    stroke="#FF4B3D"
                                    name="High Risk"
                                    dot={{
                                        onMouseEnter: (e: any) => { setActiveDot(e); },
                                        onMouseLeave: () => { setActiveDot(null); },
                                        onDoubleClick:(e:any)=>{onDoubleClickTrends(e)}
                                    }}
                                    activeDot={false}
                                    connectNulls
                                />):(null)
                        }
                          
                            {
                                activeLine.includes('Medium') ? (<Line
                                    type="linear"
                                    dataKey="medium"
                                    stroke="#FFB11F"
                                    name="Medium Risk"
                                    dot={{
                                        onMouseEnter: (e: any) => { setActiveDot(e); },
                                        onMouseLeave: () => { setActiveDot(null); },
                                        onDoubleClick: (e: any) => { onDoubleClickTrends(e) }
                                    }}
                                    activeDot={false}
                                    connectNulls
                                />):(null)
                            }
                           
                            {
                                activeLine.includes('Low') ? (<Line
                                    type="linear"
                                    dataKey="low"
                                    stroke="#FFE548"
                                    name="Low Risk"
                                    dot={{
                                        onMouseEnter: (e: any) => { setActiveDot(e); },
                                        onMouseLeave: () => { setActiveDot(null); },
                                        onDoubleClick: (e: any) => { onDoubleClickTrends(e) }
                                    }}
                                    activeDot={false}
                                    connectNulls
                                />):(null)
                            }
                          

                    </LineChart>
                </ResponsiveContainer>
            <div className='flex flex-row gap-6'>
                {
                    ['High', 'Medium', 'Low'].map((entry, index) => {
                        return (
                            <div
                                key={index}
                                className='flex flex-row gap-1 items-center cursor-pointer'
                                onClick={() => handleRemoveChart(entry)}
                            >
                                <TimelineIcon
                                    style={{
                                        color: activeLine.includes(entry) ? entry === 'High' ? "#FF4B3D" : entry === 'Medium' ? "#FFB11F" : "#FFE548":"gray",
                                        fontSize: "14px"
                                    }}
                                />
                                <p style={{
                                    fontSize: "12px",
                                    fontFamily: "roboto",
                                    fontWeight: 500,
                                    color: activeLine.includes(entry) ? "black" : "gray"
                                }}>
                                    {entry} count
                                </p>
                            </div>
                        )
                    })
                }
            </div>
                </>
            )}
        </div>
    );
}

export default RiskLineChart;
