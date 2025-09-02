import React, { useEffect, useState } from "react";
import BarChartIcon from '@mui/icons-material/BarChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, TooltipProps } from 'recharts';

interface Props {
    title: string;
    data: any;
}
const CMStackBarChart = (props: Props) => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [activeBar,setActiveBar] = useState<any | null>(); 
    const [selectedBar, setSelectedBar] = useState<any[]>(['High', 'Medium', 'Low'])
    const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
        active,
        payload,
    }) => {
        if(activeBar){
            console.log(activeBar.tooltipPayload[0].payload[activeBar.tooltipPayload[0].dataKey])
            return <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '10px',
                color: 'white',
                fontFamily: 'Roboto, sans-serif',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
                maxWidth: 'max-content',
                textAlign: 'center'
            }}>
                <p>
                    <strong>Risk Level</strong> {activeBar.tooltipPayload[0].dataKey} <br />
                    <strong>Transactions:</strong> {activeBar.tooltipPayload[0].payload[activeBar.tooltipPayload[0].dataKey]}
                    </p>
            </div>
        }
        return null;
    };
    const dataCleaning = () => {
        const inProgressResult: any = { name: 'In Progress', high: 0, medium: 0, low: 0 };
        const closedResult: any = { name: 'Closed', high: 0, medium: 0, low: 0 };
        if (props.data.high) {
            props.data.high.forEach((item: any) => {
                if (item.REVIEWSTATUSID === 2) {
                    inProgressResult.high += item.doccount;
                } else if (item.REVIEWSTATUSID === 3) {
                    closedResult.high += item.doccount;
                }
            });
        }
        if (props.data.medium) {
            props.data.medium.forEach((item: any) => {
                if (item.REVIEWSTATUSID === 2) {
                    inProgressResult.medium += item.doccount;
                } else if (item.REVIEWSTATUSID === 3) {
                    closedResult.medium += item.doccount;
                }
            });
        }
        if (props.data.low) {
            props.data.low.forEach((item: any) => {
                if (item.REVIEWSTATUSID === 2) {
                    inProgressResult.low += item.doccount;
                } else if (item.REVIEWSTATUSID === 3) {
                    closedResult.low += item.doccount;
                }
            });
        }
        const filteredData = [inProgressResult, closedResult].filter(item =>
            item.high > 0 || item.medium > 0 || item.low > 0
        );

        setChartData(filteredData);
    };
    useEffect(() => {
        dataCleaning();
    }, [props.data]);
    const handleRemoveChart = (entry: string) => {
        console.log(entry)
        if (selectedBar.includes(entry)) {
            setSelectedBar(selectedBar.filter((item) => item !== entry));
        } else {
            setSelectedBar([...selectedBar, entry]);
        }
    }
    return (
        <>
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name"  />
                    <YAxis label={{ value: "Number of Transactions", angle: 270, dx:-20 ,fill:"black"}} />
                <Tooltip content={<CustomTooltip/>}/>
                {
                    selectedBar.includes('High') ? (<Bar dataKey="high" stackId="a" fill="rgb(255, 75, 61)" barSize={50} stroke="none" onMouseEnter={(e) => { setActiveBar(e) }} onMouseLeave={() => { setActiveBar(null) }} />):(null) 
                }
                {
                    selectedBar.includes('Medium') ? (<Bar dataKey="medium" stackId="a" fill="rgb(255, 177, 15)" barSize={50} onMouseEnter={(e) => { setActiveBar(e) }} onMouseLeave={() => { setActiveBar(null) }} />) : (null)
                }{
                    selectedBar.includes('Low') ? (<Bar dataKey="low" stackId="a" fill="rgb(255, 229, 72)" barSize={50} stroke="none" onMouseEnter={(e) => { setActiveBar(e) }} onMouseLeave={() => { setActiveBar(null) }} />) : (null)
                }
            </BarChart>
        </ResponsiveContainer>
            <div className='flex justify-center  gap-6'>
                {
                    ['High', 'Medium', 'Low'].map((entry, index) => {
                        return (
                            <div
                                key={index}
                                className='flex flex-row gap-1 items-center cursor-pointer'
                                onClick={() => handleRemoveChart(entry)}
                            >
                                <BarChartIcon style={{
                                    color: selectedBar.includes(entry) ? entry === 'High' ? "#FF4B3D" : entry === 'Medium' ? "#FFB11F" : "#FFE548" : "gray",
                                    fontSize: "14px"
                                }} />
                                <p style={{
                                    fontSize: "12px",
                                    fontFamily: "roboto",
                                    fontWeight: 500,
                                    color: selectedBar.includes(entry) ? "black" : "gray"
                                }}>
                                    {entry} 
                                </p>
                            </div>
                        )
                    })
                }
            </div>
        </>
    );
};

export default CMStackBarChart;
