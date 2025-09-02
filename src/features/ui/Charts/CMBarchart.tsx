import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, TooltipProps } from 'recharts';
import BarChartIcon from '@mui/icons-material/BarChart';
interface Props {
    title: string;
    data: any;
}

const CMBarchart = (props: Props) => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [showBar,setShowBar] = useState<boolean>(true);
    const dataCleaning = () => {
        if (props.data) {
            const copyData = [...props.data];

            if (copyData.length > 0) {
                copyData.forEach((item: any) => {
                    if (item.duration === 1) {
                        item.durationText = '1-10';
                    } else if (item.duration === 2) {
                        item.durationText = '11-20';
                    } else if (item.duration === 3) {
                        item.durationText = '21-30';
                    } else {
                        item.durationText = '31+';
                    }
                });

                copyData.sort((a, b) => a.duration - b.duration);
                setChartData(copyData);
            } else {
                setChartData([]);
            }
        }
    };

    useEffect(() => {
        dataCleaning();
    }, [props.data]);
    const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
        active,
        payload,
    }) => {
        if(payload && payload[0]?.payload){
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
                <strong>Elapsed Time</strong> {payload[0]?.payload?.durationText} <br />
                <strong>No.of.Transactions</strong> {payload[0]?.payload?.doccount}

            </p>
        </div>
        }
        return null
    };
    return (
        <>
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="durationText" />
                <YAxis label={{ value: "Number of Transactions", angle: 270, dx: -20, fill: "black" }} />
                <Tooltip content={<CustomTooltip/>}/>
                {
                    showBar?(<Bar dataKey="doccount" fill="rgb(255, 229, 72)" barSize={50} />):(null)
                }
            </BarChart>
        </ResponsiveContainer>
            <div className='flex justify-center'>
                <div className='flex flex-row gap-1 items-center cursor-pointer' onClick={()=>{setShowBar(!showBar)}}>
                    <BarChartIcon style={{
                        color: showBar ? "#FFE548" : "gray",
                        fontSize: "14px"
                    }} />
                    <p
                        style={{
                            fontSize: "12px",
                            fontFamily: "roboto",
                            fontWeight: 500,
                            color: showBar ? "black" : "gray"
                        }} 
                    >
                        Doccount
                    </p>
                </div>
            </div>
        </>
    );
};

export default CMBarchart;
