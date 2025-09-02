import React from 'react'
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
    doubleClick: (event: any) => void;
    data: any;
}

function TreeChart({ data, doubleClick }: Props) {
    const [finalData, setFinalData] = React.useState([]);

    const closeData = () => {
        if (data) {
            const dataSorted = data;
            dataSorted.sort((a: any, b: any) => b.doccount - a.doccount);
            setFinalData(dataSorted);
        };
    }

    React.useEffect(() => {
        closeData();
    }, [data]);

    const colorPalette = [
        '#FFC000',
        '#5B9BD5',
        '#ED7D31',
        '#70AD47',
        '#4472C4',
        '#A5A5A5',
        '#264478',
        '#997300',
        '#43682B',
        '#636363',
        '#255E91',
        '#698ED0',
        '#7CAFDD',
        '#F1975A',
        '#9E480E',
        '#F2B800',
        '#548235',
        '#8CC168',
        '#C4E3F3',
        '#D5A6BD',
        '#EAD1DC',
        '#B6D7A8',
        '#F9CB9C',
        '#E2B0FF',
        '#A2C4C9',
        '#B6D7A8',
        '#FFB3E6',
        '#CFE2F3',
        '#D9EAD3',
        '#F6CECE',
        '#B4A7D6',
        '#D0A9F5',
        '#D3E2D5',
        '#EAD1DC',
        '#E9B3C6',
        '#E5E5E5',
        '#C9DAF8',
        '#F9F9F9'
    ];


    const CustomizedContent = (props: any) => {
        const { root, depth, x, y, width, height, index, colors = [], VENDOR_NAME, payload } = props;
        const colorIndex = index < colors.length ? index : Math.floor(Math.random() * colors.length);
        const fillColor = colors[colorIndex] || '#8884d8';

        return (
            <g>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    style={{
                        fill: fillColor,
                        stroke: '#fff',
                        strokeWidth: 2 / (depth + 1e-10),
                        strokeOpacity: 1 / (depth + 1e-10),
                    }}
                    onDoubleClick={()=> doubleClick(props)}
                />
                {depth === 1 ? (
                    <text x={x + (width) / 2} y={y + (height) / 2} textAnchor="innerMiddle" fill="black" fontSize={12}>
                        {VENDOR_NAME}
                    </text>
                ) : null}
            </g>
        );
    };

    const CustomTooltip = ({ payload, label, active }: any) => {
        if (active && payload && payload.length) {
            const { VENDOR_NAME } = payload[0].payload;
            const { VENDORID } = payload[0].payload;

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
                    <p><strong>Vendor Name:</strong> {VENDOR_NAME} <br /> <strong>Vendor ID:</strong> {VENDORID}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer height="100%" minHeight={400}>
            <Treemap
                width={400}
                height={200}
                data={finalData}
                dataKey="doccount"
                content={<CustomizedContent colors={colorPalette} />}
            >
                <Tooltip content={<CustomTooltip />} />
            </Treemap>
        </ResponsiveContainer>
    )
}

export default TreeChart;
