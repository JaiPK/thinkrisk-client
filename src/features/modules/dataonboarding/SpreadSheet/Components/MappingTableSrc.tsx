import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Stack } from "@mui/system";
import { Button } from "@mui/material";
import moment from 'moment';

export interface Props {
    srcheaders: any;
    srcrows: any;
    setIsShowCheckDataHealth: any;
    setActiveStep: any;
    setIsShowMap: any;
}

function createData(name: string, row1: any, dataType:any, row2: any) {
    return { name, row1, dataType, row2 };
}

export default function SourceMappingTable(props: Props) {
    const [tableRows, setTableRows] = React.useState<any[]>([]);
    const [parsedData, setParsedData] = React.useState<any>([]);
    const [activeStep, setActiveStep] = React.useState(0);

    const parseData = (data: any) => {
        const rows: any[] = [];
        const dateColumns = [{columnName: "Entry Date", dateFormat: "MM-DD-YYYY"}];
        const rowCount=props.srcrows.length;
        for (let i = 0; i < data.length; i++) {
            const name = props.srcheaders[i];
            const row1 = rowCount > 0 ? props.srcrows[0][props.srcheaders[i]] :"";
            const row2 = rowCount > 0 ? props.srcrows[1][props.srcheaders[i]] :"";
            let dataType = typeof row1;
            let extra = "string";
            const dateFormat = dateColumns.find(col => col.columnName === props.srcheaders[i])?.dateFormat;
            
            // if (dataType === "string") {
            //     if (!isNaN(Number(row1))) {
            //         dataType = "number";
            //     } else if (row1 === "true" || row1 === "false") {
            //         dataType = "boolean";
            //     }
            // }
            if (dateFormat) {
              if (moment(row1, dateFormat, true).isValid()) {
                extra = 'date';
              }
            } else if (dataType === 'string') {
              if (!isNaN(Number(row1))) {
                extra = 'number';
              } else if (row1 === 'true' || row1 === 'false') {
                extra = 'boolean';
              } else if (row1.match(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/)) {
                extra = 'time';
              } else if (row1.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})/)) {
                extra = 'datetime';
              }
            }
            const dat = createData(name, row1, extra, row2);
            rows.push(dat);
        }
        setTableRows(rows);
    };
    React.useEffect(() => {
        parseData(props.srcheaders);
    }, [props]);

    const handleState = () => {
        props.setActiveStep(activeStep + 2);
        props.setIsShowMap(false);
        props.setIsShowCheckDataHealth(true);
    };
    return (
        <>
            <TableContainer component={Paper} sx={{ maxHeight: "65vh" }}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{ border: 1, borderColor: "#e0e0e0" }}>
                            <TableCell
                                className="bg-[#98DCFF]"
                                sx={{ fontWeight: 600 }}
                            >
                                Your Data Column Headers
                            </TableCell>
                            <TableCell
                                className="bg-[#98DCFF]"
                                align="left"
                                sx={{ fontWeight: 600, width: "30%" }}
                            >
                                Sample Data 1
                            </TableCell>
                            <TableCell
                                className="bg-[#98DCFF]"
                                align="left"
                                sx={{ fontWeight: 600, width: "30%" }}
                            >
                                Sample Data 2
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {tableRows.map((row) => (
                            <TableRow
                                key={row.name.concat(row.row1)}
                                sx={{
                                    height: 73,
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell className="bg-[#EFEEEE] text-black">
                                    <div>{row.name}</div>
                                    <div className="mt-1"><span className="text-green-700 bg-green-200 p-1 rounded-lg">{row.dataType}</span></div>
                                </TableCell>
                                <TableCell align="left">
                                    {row.row1 as String}
                                </TableCell>
                                <TableCell align="left">{row.row2}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
