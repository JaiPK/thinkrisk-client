import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import axios from "../../../../../../api/axios";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import FormControl from "@mui/material/FormControl";
import { useNavigate } from "react-router-dom";

import AlertComponent from "../../../../../ui/alert-component/AlertComponent";
import { getPath } from "../../../../../../shared/helpers/getPath";

const GET_CLOSE_DUPLICATE_DATA = "v1/ap/duplicateinvoices";
const POST_CLOSE_DUPLICATE_DATA = "v1/ap/closeduplicate";

interface Data {
    COMPANY_NAME: string;
    DUPLICATES_ID: string;
    INVOICE_AMOUNT: string;
    INVOICE_DATE: string;
    INVOICE_NUMBER: string;
    NO_OF_DUPLICATES: string;
    PAYMENT_DATE: string;
    POSTED_BY: string;
    POSTED_DATE: string;
    PrimaryKeySimple: string;
    REVIEWSTATUSID: string;
    REVIEW_STATUS_CODE: string;
    REVIEW_STATUS_DESCRIPTION: string;
    RISK_SCORE: string;
    VENDORID: string;
    VENDOR_NAME: string;
    Payment_date: string;
}

interface Props {
    rows: Data[];
    page: number;
    perPage: number;
    total: number;
    handlePagination(page: number, perpage: number): void;
    popUpClosedToParent: () => void;
    handleSort: (orderBy : string, sortorder: boolean) => void;
}

type Order = "asc" | "desc";

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: "DUPLICATES_ID",
        numeric: true,
        disablePadding: true,
        label: "Duplicate ID",
    },
    {
        id: "COMPANY_NAME",
        numeric: true,
        disablePadding: false,
        label: "Company",
    },
    {
        id: "INVOICE_DATE",
        numeric: true,
        disablePadding: false,
        label: "Invoice Date",
    },
    {
        id: "INVOICE_NUMBER",
        numeric: true,
        disablePadding: false,
        label: "Invoice Number",
    },
    {
        id: "VENDOR_NAME",
        numeric: true,
        disablePadding: false,
        label: "Vendor Name",
    },
    {
        id: "INVOICE_AMOUNT",
        numeric: true,
        disablePadding: false,
        label: "Invoice Amount",
    },
    {
        id: "NO_OF_DUPLICATES",
        numeric: true,
        disablePadding: false,
        label: "Number of Duplicates",
    },
    {
        id: "POSTED_DATE",
        numeric: true,
        disablePadding: false,
        label: "Posted Date",
    },
    {
        id: "POSTED_BY",
        numeric: true,
        disablePadding: false,
        label: "Posted By",
    },
    {
        id: "Payment_date",
        numeric: true,
        disablePadding: false,
        label: "Payment Date",
    },
    {
        id: "RISK_SCORE",
        numeric: true,
        disablePadding: false,
        label: "Duplicate Risk Score",
    },
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof Data
    ) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}


function EnhancedTableHead(props: EnhancedTableProps) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
    } = props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    {/* <Checkbox
                        color="primary"
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            "aria-label": "select all desserts",
                        }}
                    /> */}
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        // align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc"
                                        ? "sorted descending"
                                        : "sorted ascending"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    selected: readonly string[];
    handleClose: () => void;
}
// documents:
// [{"DUPLICATES_DOC_ID":"147658","INVOICES":"S013203551.001","IS_DUPLICATE":1,"STATUS":6},{"DUPLICATES_DOC_ID":"148147","INVOICES":"S013203551.001","IS_DUPLICATE":0,"STATUS":7}]
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, selected } = props;
    const navigate = useNavigate();
    const Axios = axios;
    const [open, setOpen] = React.useState(false);
    const [data, setData] = React.useState<any>([]);
    const [duplicateCloseData, setDuplicateCloseData] = React.useState<any>([]);
    const [isSelected, setIsSelected] = useState<any[]>([]);
    const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false);
    const [message, setMessage] = useState("");

    const handleAlertClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setIsShowSuccessAlert(false);
    };


    const handleClosePopover = () => {
        setOpen(false);
        props.handleClose();
    };

    const handleClosePopoverSubmit = async () => {
        let documents: any = [];
        isSelected.forEach((item) => {
            let obj = {
                DUPLICATES_DOC_ID: null,
                INVOICES: null,
                IS_DUPLICATE: -1,
                STATUS: -1,
            };
            obj.DUPLICATES_DOC_ID = item?.elementData?.PrimaryKeySimple;
            obj.INVOICES = item?.elementData?.INVOICE_NUMBER;
            obj.IS_DUPLICATE = item?.value === "1" ? 1 : 0;
            obj.STATUS = item?.value === "1" ? 6 : 7;
            documents.push(obj);
        });
        let documentsObj = JSON.stringify(documents);

        let formData = new FormData();
        formData.append("documents", documentsObj);
        formData.append("audit_id", getPath.getPathValue("audit_id"));
        const postDocumentsResponse = await Axios.post(
            POST_CLOSE_DUPLICATE_DATA,
            formData,
            {
                headers: {
                    Authorization: localStorage.getItem("TR_Token") as string,
                },
            }
        );
        if (postDocumentsResponse.data.data === 1) {
            setMessage("Successfully Closed Duplicate Invoices")
            setIsShowSuccessAlert(true);
        }
        else if (postDocumentsResponse.data.data === null) {
            setMessage("You are not authorized to Close Invoices")
            setIsShowSuccessAlert(true);
        }
        handleClosePopover();
    };

    const getDuplicateDetails = async () => {
        setOpen(true);
        try {
            let formData = new FormData();

            formData.append("DUPLICATES_ID", selected[0]);
            formData.append("audit_id", getPath.getPathValue("audit_id"));
            const getDocumentsResponse = await Axios.post(
                GET_CLOSE_DUPLICATE_DATA,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                }
            );

            if (getDocumentsResponse.data.data.duplicates.length > 0) {
                setData(getDocumentsResponse.data.data.duplicates);
            }
        } catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    };

    const postDuplicateDetails = async () => {
        try {
            let formData = new FormData();

            formData.append("documents", selected[0]);
            formData.append("audit_id", getPath.getPathValue("audit_id"));
            const postDocumentsResponse = await Axios.post(
                POST_CLOSE_DUPLICATE_DATA,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                }
            );

            if (postDocumentsResponse.data.data.duplicates.length > 0) {
                setData(postDocumentsResponse.data.data.duplicates);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        getDuplicateDetails();
    };

    const rowSelected = (event: any, PrimaryKeySimple: string) => {
        let isSelectedCopy = [...isSelected];
        let index = isSelected.findIndex(
            (obj) => obj?.elementData?.PrimaryKeySimple === PrimaryKeySimple
        );
        if (index > -1) {
            //udpate the value if it already exists
            isSelectedCopy[index] = {
                value: event.target.value,
                elementData: { ...isSelected[index].elementData },
            };
            setIsSelected([...isSelectedCopy]);
        } else {
            //add to the array if it already doesn't exist
            let isSelectedCopy = [...isSelected];
            let Obj = data.find(
                (obj: any) => obj.PrimaryKeySimple === PrimaryKeySimple
            );
            setIsSelected([
                ...isSelectedCopy,
                { value: event.target.value, elementData: { ...Obj } },
            ]);
        }
    };

    useEffect(() => {
        setIsSelected([]);
    }, [data]);

    return (
        <>
            <Dialog open={open} onClose={handleClosePopover}>
                <DialogTitle>Close Invoice</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table
                            sx={{ minWidth: "80%" }}
                            aria-label="simple table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Company</TableCell>
                                    <TableCell align="right">
                                        Invoice Date
                                    </TableCell>
                                    <TableCell align="right">
                                        Invoice Number
                                    </TableCell>
                                    <TableCell align="right">
                                        Posted Date
                                    </TableCell>
                                    <TableCell align="right">
                                        Posted By
                                    </TableCell>
                                    <TableCell align="right">
                                        Vendor ID
                                    </TableCell>
                                    <TableCell align="right">
                                        Vendor Name
                                    </TableCell>
                                    <TableCell align="right">
                                        Invoice Amount
                                    </TableCell>
                                    <TableCell align="right">
                                        Payment Date
                                    </TableCell>
                                    <TableCell align="right">
                                        Duplicate Risk Score
                                    </TableCell>
                                    <TableCell align="right">
                                        Is Duplicate
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row: any,index:any) => {
                                    return (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                "&:last-child td, &:last-child th":
                                                    { border: 0 },
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {row?.COMPANY_NAME}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row?.INVOICE_DATE}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row?.INVOICE_NUMBER}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row?.POSTED_DATE}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row?.POSTED_BY}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row?.VENDORID}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row?.VENDOR_NAME}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row?.INVOICE_AMOUNT}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row?.PAYMENT_DATE}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row?.RISK_SCORE}%
                                            </TableCell>
                                            <TableCell align="right">
                                                <FormControl>
                                                    <RadioGroup
                                                        row
                                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                                        name="row-radio-buttons-group"
                                                        onChange={(event) => {
                                                            rowSelected(
                                                                event,
                                                                row.PrimaryKeySimple
                                                            );
                                                        }}
                                                    >
                                                        <FormControlLabel
                                                            value="1"
                                                            control={<Radio />}
                                                            label="Yes"
                                                        />
                                                        <FormControlLabel
                                                            value="0"
                                                            control={<Radio />}
                                                            label="No"
                                                        />
                                                    </RadioGroup>
                                                </FormControl>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePopover}>Cancel</Button>
                    <Button
                        onClick={handleClosePopoverSubmit}
                        disabled={!(isSelected.length === data.length)}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(
                                theme.palette.primary.main,
                                theme.palette.action.activatedOpacity
                            ),
                    }),
                }}
            >
                {numSelected > 0 ? (
                    <Typography
                        sx={{ flex: "1 1 100%" }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: "1 1 100%" }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Duplicate Invoices
                    </Typography>
                )}
                {numSelected > 0 ? (
                    <Tooltip title="Close Invoice">
                        <IconButton
                            onClick={() => {
                                handleClose();
                            }}
                        >
                            <Button variant="contained">Close Invoice</Button>
                        </IconButton>
                    </Tooltip>
                ) : (
                    ""
                )}
            </Toolbar>
            <AlertComponent
                openAlert={isShowSuccessAlert}
                handleClose={handleAlertClose}
                message={message}
                vertical={"bottom"}
                horizontal={"center"}
                severity={"success"}
            />
        </>
    );
}

export default function EnhancedTable(props: Props) {
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<keyof Data>("DUPLICATES_ID");
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);

    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [total, setTotal] = React.useState(0);
    const [rows, setRows] = React.useState<Data[]>([]);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data
    ) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
        props.handleSort(property, isAsc);
    };

    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => String(n.PrimaryKeySimple));
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: any, name: string) => {
        let tempArray = [...selected];
        let index = selected.findIndex((element) => element === name);
        if (index !== undefined && index !== null && index !== -1) {
            tempArray.splice(index, 1);
            setSelected(tempArray);
        } else {
            setSelected([]);
            let newSelected: string[] = [];
            newSelected = newSelected.concat(name);
            setSelected(newSelected);
        }
        // setSelected([]);
        // let newSelected: string[] = [];
        // newSelected = newSelected.concat(name);

        // console.log("newSelected:",newSelected);

        // setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        setRows([]);
        props.handlePagination(newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        setRows([]);
        props.handlePagination(0, parseInt(event.target.value, 10));
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    const checkData = () => {
        if (props.rows.length > 0) {
            setPage(props.page);
            setRowsPerPage(props.perPage);
            setTotal(props.total);
            setRows(props.rows);
        }
    };

    const handleCloseToParent = () => {
        setSelected([]);
        setRows([]);
        props.popUpClosedToParent();
    };

    useEffect(() => {
        setRows([]);
        setSelected([]);
        setTotal(0);
        checkData();
    }, [props.rows]);

    return (
        <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    selected={selected}
                    handleClose={handleCloseToParent}
                />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={"small"}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {rows.map((row, index) => {
                                const isItemSelected = isSelected(
                                    String(row.DUPLICATES_ID)
                                );
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) =>
                                            handleClick(
                                                event,
                                                String(row.DUPLICATES_ID)
                                            )
                                        }
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={index}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    "aria-labelledby": labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell id={labelId} scope="row">
                                            {row.DUPLICATES_ID}
                                        </TableCell>
                                        <TableCell>
                                            {row.COMPANY_NAME}
                                        </TableCell>
                                        <TableCell>
                                            {row.INVOICE_DATE}
                                        </TableCell>
                                        <TableCell>
                                            {row.INVOICE_NUMBER}
                                        </TableCell>
                                        <TableCell>{row.VENDOR_NAME}</TableCell>
                                        <TableCell>
                                            {row.INVOICE_AMOUNT}
                                        </TableCell>
                                        <TableCell>
                                            {row.NO_OF_DUPLICATES}
                                        </TableCell>
                                        <TableCell>{row.POSTED_DATE}</TableCell>
                                        <TableCell>{row.POSTED_BY}</TableCell>
                                        <TableCell>
                                            {row.PAYMENT_DATE}
                                        </TableCell>
                                        <TableCell>{row.RISK_SCORE}%</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

        </Box>
    );
}
