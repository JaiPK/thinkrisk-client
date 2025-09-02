import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import numberSuffixPipe from '../../../shared/helpers/numberSuffixPipe';

export interface Props {
    topAnomalyCategoryData: any[];
    doubleClick: (event: any) => void;
}

export interface DataObj {
    transactions: number;
    amount: number;
    anomanly: string;
    tooltipText: string;
    label: string;
    isVisibility: boolean;
    color: string;
}

const CustomTooltip = (payload: any) => {
    if (payload) {
        return (
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
                textAlign: 'center'
            }}>
                <p><strong>Anomaly:</strong> {payload.payload[0]?.payload.label} <br />
                    <strong>Transactions:</strong> {payload.payload[0]?.payload.transactions}
                    <br /> <strong>Amount:</strong> {payload.payload[0]?.payload.amount}</p>
            </div>
        );
    }
    return null;
};

function DoughnutChart({ topAnomalyCategoryData, doubleClick }: Props) {
    const colorPalette = ['#00BDAE', '#404041', '#357CD2', '#E56590', '#fbdbc1', '#B7D6A3'];
    const [dataSet, setDataSet] = React.useState<DataObj[]>([]);
    const [backUpDataSet, setBackUpDataSet] = React.useState<DataObj[]>([]);
    const [color, setColour] = React.useState<string[]>(colorPalette);
    const currencySymbol = localStorage.getItem("CurrencySymbol");

    const setData = () => {
        const interData: DataObj[] = [];

        if (topAnomalyCategoryData.length > 0) {
            const total = topAnomalyCategoryData
                .map(item => Number(item.totalcredit))
                .reduce((prev, next) => prev + next);

            for (let i = 0; i < topAnomalyCategoryData.length; i++) {
                const percentage = (Number(topAnomalyCategoryData[i].totalcredit) / total) * 100;

                let dataObj: DataObj = {
                    amount: Number(topAnomalyCategoryData[i].totalcredit),
                    transactions: topAnomalyCategoryData[i].doccount,
                    anomanly: topAnomalyCategoryData[i].ruletitle,
                    label: `${topAnomalyCategoryData[i].ruletitle} (${percentage.toFixed(2)}%)`,
                    tooltipText: `
                        Anomaly: ${topAnomalyCategoryData[i].ruletitle} (${percentage.toFixed(2)}%)<br/>
                        Transactions: ${topAnomalyCategoryData[i].doccount} <br/>
                        Amount: ${currencySymbol} ${numberSuffixPipe(topAnomalyCategoryData[i].totalcredit)}`,
                    isVisibility: true,
                    color: color[i % color.length]
                };

                interData.push(dataObj);
            }

            setDataSet(interData);
            setBackUpDataSet(interData);
        }
    };

    const handleRemoveChart = (entry: DataObj) => {
        const entryIndex = dataSet.findIndex((item) => item.anomanly === entry.anomanly);
        const updatedDataSet = dataSet.map((item) => {
            if (item.anomanly === entry.anomanly) {
                const newVisibility = !item.isVisibility;
                return { ...item, isVisibility: newVisibility };
            }
            return item;
        });

        const updatedBackUpDataSet = backUpDataSet.map((item) => {
            if (item.anomanly === entry.anomanly) {
                return { ...item, isVisibility: !item.isVisibility };
            }
            return item;
        });

        setBackUpDataSet(updatedBackUpDataSet);
        setDataSet(updatedDataSet);
    };

    React.useEffect(() => {
        setData();
    }, [topAnomalyCategoryData]);

    return (
        <div className='flex flex-col items-center gap-4'>
            <p style={{
                textAlign: 'center',
                fontSize: '16px',
                fontFamily: 'roboto',
                fontWeight: 500
            }}>Top Anomaly Category</p>
            <ResponsiveContainer width={"100%"} style={{ flex: "2" }} minHeight={400}>
                <PieChart>
                    <Pie
                        dataKey="amount"
                        isAnimationActive={false}
                        data={dataSet.filter(item => item.isVisibility)} 
                        cx="50%"
                        cy="50%"
                        innerRadius={"32%"}
                        fill="#8884d8"
                        onDoubleClick={(e) => doubleClick(e)}
                        label={(props) => {
                            props.fill = "black";
                            return props.label;
                        }}
                        fontSize={14}
                    >
                        {dataSet.filter(item => item.isVisibility).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
            <div className='flex flex-row gap-6'>
                {backUpDataSet.map((entry, index) => (
                    <div
                        key={index}
                        className='flex flex-row gap-1 items-center cursor-pointer'
                        onClick={() => handleRemoveChart(entry)}
                    >
                        <DonutSmallIcon
                            style={{
                                color: entry.isVisibility ? entry.color : "gray",
                                fontSize: "14px"
                            }}
                        />
                        <p style={{
                            fontSize: "12px",
                            fontFamily: "roboto",
                            fontWeight: 500,
                            color: entry.isVisibility ? "black" : "gray"
                        }}>
                            {entry.anomanly}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DoughnutChart;
