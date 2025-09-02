import {
    Badge,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import { Fragment, useEffect, useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import { RiskLevel } from "../../../../../../shared/models/records";
import { ActionButton } from "../../../../../../shared/models/workFlowItems";
import { apWorkFlow } from "../../../../../../shared/helpers/workFlow";
import ForumIcon from "@mui/icons-material/Forum";
import CommentsPopOver from "../../../../../../shared/ui/pop-overs/CommentsPopOver";
import PositionedMenu from "../../../generalLedger/transactions/components/TransactionExport";
import axios from "../../../../../../api/axios";
import CurrencyFormat from 'react-currency-format';
import { getPath } from "../../../../../../shared/helpers/getPath";
import { downloadCSV, downloadExcel } from "../../../../../../shared/helpers/downloadFile";
import { useAppDispatch } from "../../../../../../hooks";
const Axios = axios;

export interface Props {
    rowData: Data[];
    riskLevel: RiskLevel;
    reviewStatusId: number;
    subrStatusId: number;
    roleId: number;
    userId: number;
    assignedBy: number;
    assignedTo: number;
    transLoading: boolean;
    handlePopUp(popupTitle: string): void;
    handleSelectedTrans(selectedTrans: string[]): void;
    initialSelectedTrans: number[];
    accountDocCode: any;
    handleControlExceptionView(acc_doc_id:any): void;
    handleEventControlExceptions(toggle:boolean): void;
    totalTransactions: number;
    tablePage: number;
    tablePerPage: number;
}
export interface Data {
    account_code: number;
    description: string;
    transactionId: number;
    riskScore: number;
    entryDate: string;
    debit: number;
    credit: number;
    name: string;
}
export interface DataRow {
    account_code: number;
    description: string;
    transactionId: number;
    riskScore: number;
    entryDate: string;
    debit: number;
    credit: number;
    name: string;
    open: boolean;
    transDesc: string;
    location: string;
    entryByName: string;
    comments: number;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
) => number {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
    array: readonly T[],
    comparator: (a: T, b: T) => number
) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "Account",
    },
    {
        id: "transactionId",
        numeric: true,
        disablePadding: false,
        label: "Transaction ID",
    },
    {
        id: "entryDate",
        numeric: true,
        disablePadding: false,
        label: "Entry Date",
    },
    {
        id: "debit",
        numeric: true,
        disablePadding: false,
        label: "Debit",
    },
    {
        id: "credit",
        numeric: true,
        disablePadding: false,
        label: "Credit",
    },
    {
        id: "riskScore",
        numeric: true,
        disablePadding: false,
        label: "Risk Score",
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
    reviewStatusId: number;
    roleId: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
        reviewStatusId,
        roleId,
    } = props;

    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            "aria-label": "select all transactions  ",
                        }}
                        disabled={reviewStatusId !== 1 ? true : false}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
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
                <TableCell>Comments</TableCell>
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    actionButtons: ActionButton[];
    initSelected: number[];
    reviewStatusId: number;
}

const initRows = (rowData: any[]) => {
    let Obj: DataRow[] = [];
    rowData.forEach((row) => {
        row.open = false;
        Obj.push(row);
    });
    return Obj;
};

const TransactionDetailsTable = ({
    rowData,
    riskLevel,
    reviewStatusId,
    subrStatusId,
    roleId,
    userId,
    assignedBy,
    assignedTo,
    transLoading,
    handlePopUp,
    handleSelectedTrans,
    initialSelectedTrans,
    accountDocCode,
    handleControlExceptionView,
    handleEventControlExceptions,
    totalTransactions,
tablePage,
tablePerPage
}: Props) => {
    
    const currencySymbol = localStorage.getItem("CurrencySymbol");
    const [rows, setRows] = useState(initRows(rowData));
    const transDataLoading = transLoading;

    const [order, setOrder] = useState<Order>("asc");
    const [orderBy, setOrderBy] = useState<keyof Data>("transactionId");
    const [selected, setSelected] = useState<readonly string[]>([]);
    const [page, setPage] = useState(tablePage);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(tablePerPage);
    const [actionButtons, setActionButtons] = useState<ActionButton[]>(
        apWorkFlow(
            reviewStatusId,
            subrStatusId,
            roleId,
            userId,
            assignedBy,
            assignedTo
        )
    );
    const dispatch = useAppDispatch();
    //for the popup
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    //for comments popup
    const [selectedCommentId, setSelectedCommentId] = useState(0);
    const handleCommentsClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCommentsClose = () => {
        setAnchorEl(null);
    };

    const setNewTransactionId = (transId: number) => {
        setSelectedCommentId(transId);
    };

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const commentsOpen = Boolean(anchorEl);

    const handleCollapseExpand = (transactionId: number) => {
        let Obj: DataRow[] = [];
        let tempObj = [...rows];
        tempObj.forEach((row) => {
            let tempRow = { ...row };
            if (tempRow.transactionId === transactionId) {
                tempRow.open = tempRow.open === true ? false : true;
            }
            Obj.push(tempRow);
        });
        if(Obj.length){
            let tempTransactionId = Obj.find((transaction:any) => transaction.transactionId === transactionId)?.transactionId;
            let tempTransactionIsOpen = Obj.find((transaction:any) => transaction.transactionId === transactionId)?.open;
            handleControlExceptionView(tempTransactionId);
            if(tempTransactionIsOpen!==undefined){
                handleEventControlExceptions(tempTransactionIsOpen);
            }
        }
        setRows(Obj);
    };

    useEffect(() => {
        setPage(tablePage);
        setRowsPerPage(tablePerPage);
        setRows(initRows(rowData));
        setActionButtons(
            apWorkFlow(
                reviewStatusId,
                subrStatusId,
                roleId,
                userId,
                assignedBy,
                assignedTo
            )
        );
    }, [rowData]);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data
    ) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.name);
            setSelected(newSelected);
            handleSelectedTrans(newSelected);
            return;
        }
        handleSelectedTrans([]);
        setSelected([]);
    };

    const handleClick = (
        event: React.MouseEvent<unknown>,
        name: string,
        initialSelectedTrans: number[]
    ) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
        handleSelectedTrans(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const disableButton = (
        reviewStatusId: number,
        numSelected: number,
        actionButton: ActionButton
    ) => {
        switch (reviewStatusId) {
            case 1:
                if (actionButton.disabled === true && numSelected === 0) {
                    return true;
                }
                if (actionButton.disabled === true && numSelected > 0) {
                    return false;
                }
                break;
            case 2:
                if (actionButton.disabled === true) {
                    return true;
                } else {
                    return false;
                }
                break;
            default:
                break;
        }
    };

    const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
        const { numSelected, actionButtons, initSelected, reviewStatusId } =
            props;
        const [csvToken, setCsvToken] = useState('');
        const PRINT_TOKEN = 'v1/print/token'
        const csv = async () => {
            try {
                const response = await Axios.get(PRINT_TOKEN, {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                });
                setCsvToken(response.data.data.Token)
                let filters = {
                    "ACCOUNTDOCID": accountDocCode,
                    "audit_id": getPath.getPathValue("audit_id")
                }
                downloadCSV(response.data.data.Token, filters, "csvaptransactions", "transactions", "AP")
            }
            catch (err) {
                console.error(err);
            }
        };

        const getCsvData = (() => {
            csv()
        })
       
        const [excelToken, setExcelToken] = useState('');

        const excel = async () => {
            try {
                const response = await Axios.get(PRINT_TOKEN, {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                });
                setCsvToken(response.data.data.Token)
                let filters = {
                    "ACCOUNTDOCID": accountDocCode,
                    "audit_id": getPath.getPathValue("audit_id")
                }
                downloadExcel(response.data.data.Token, filters, "aptransactions", "transactions", "AP")
            }
            catch (err) {
                console.error(err);
            }
        };

        const getExcelData = (() => {
            excel()
        })
        
        return (
            <><Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && {
                        bgcolor: (theme) => alpha(
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
                        className="font-bold"
                        id="tableTitle"
                        component="div"
                    >
                        Transactions
                    </Typography>
                )}

                <div className="flex flex-row-reverse min-w-max gap-3">
                    {actionButtons.length
                        ? actionButtons.map((actionButton) => (
                            <Button
                                className={`bg-[#0091ea] text-white  disabled:bg-slate-300 disabled:text-slate-500 ${actionButton.show ? "flex" : "hidden"}`}
                                disabled={disableButton(
                                    reviewStatusId,
                                    numSelected,
                                    actionButton
                                )}
                                style={{ textTransform: "none" }}
                                key={actionButton.text}
                                onClick={() => {
                                    handlePopUp(actionButton.text);
                                }}
                            >
                                {actionButton.text}
                            </Button>
                        ))
                        : null}

                    {/* <Button
        className={`bg-[#0091ea] text-white  disabled:bg-slate-300 disabled:text-slate-500 ${
            true ? "flex" : "hidden"
        }`}
        disabled={false}
        style={{ textTransform: "none" }}
    >
        Recommend to Closure
    </Button>
    <Button
        className={`bg-[#0091ea] text-white  disabled:bg-slate-300 disabled:text-slate-500 ${
            true ? "flex" : "hidden"
        }`}
        disabled={false}
        style={{ textTransform: "none" }}
    >
        Recall
    </Button>
    <Button
        className={`bg-[#0091ea] text-white  disabled:bg-slate-300 disabled:text-slate-500 ${
            true ? "flex" : "hidden"
        }`}
        disabled={false}
        style={{ textTransform: "none" }}
    >
        Send to Manager
    </Button>
    <Button
        className={`bg-[#0091ea] text-white  disabled:bg-slate-300 disabled:text-slate-500 ${
            true ? "flex" : "hidden"
        }`}
        disabled={false}
        style={{ textTransform: "none" }}
    >
        Assign Task
    </Button> */}
                </div>
                <div>
                    <span className="grow item-center justify-center">
                        <div
                            className={`flex-row-reverse pr-2 ml-2 ${!transDataLoading ? "invisible" : "flex"}`}
                        >
                            <CircularProgress size={20} />
                        </div>
                    </span>
                </div>
                {/* <div>
        <Tooltip title="Delete">
            <IconButton>
                <FilterListIcon />
            </IconButton>
        </Tooltip>
    </div> */}

                <PositionedMenu getCsvData={getCsvData} getExcelData={getExcelData} />
            </Toolbar>
            </>
        );
    };

    return (
        <div className="flex flex-col grow w-full">
            <div className="w-full shadow-lg border border-solid border-slate-300 rounded-lg">
                <div className="w-full">
                    <EnhancedTableToolbar
                        numSelected={selected.length}
                        actionButtons={actionButtons}
                        initSelected={initialSelectedTrans}
                        reviewStatusId={reviewStatusId}
                    />
                    <TableContainer>
                        <Table
                            // sx={{ width: "100%" }}
                            aria-labelledby="tableTitle"
                        // size={dense ? "small" : "medium"}
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                                reviewStatusId={reviewStatusId}
                                roleId={roleId}
                            />
                            <TableBody>
                                {stableSort(rows, getComparator(order, orderBy))
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(
                                            row.name
                                        );
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <Fragment key={row.transactionId}>
                                                <TableRow
                                                    hover
                                                    // role="checkbox"
                                                    aria-checked={
                                                        isItemSelected
                                                    }
                                                    tabIndex={-1}
                                                    key={row.name}
                                                    selected={isItemSelected}
                                                >
                                                    <TableCell
                                                        padding="checkbox"
                                                        onClick={(event) => {
                                                            if (
                                                                !initialSelectedTrans?.includes(
                                                                    row.transactionId
                                                                )
                                                            ) {
                                                               
                                                                if (
                                                                    reviewStatusId ===
                                                                    1
                                                                ) {
                                                                    handleClick(
                                                                        event,
                                                                        row.name,
                                                                        initialSelectedTrans
                                                                    );
                                                                }
                                                                // if( Number(reviewStatusId) === 2 && Number(roleId) === 2){
                                                                //     console.log("inside second if");
                                                                //     handleClick(
                                                                //         event,
                                                                //         row.name,
                                                                //         initialSelectedTrans
                                                                //     );
                                                                // }
                                                            }
                                                        }}
                                                    >
                                                        <Checkbox
                                                            color="primary"
                                                            checked={
                                                                initialSelectedTrans?.includes(
                                                                    row.transactionId
                                                                )
                                                                    ? true
                                                                    : isItemSelected
                                                            }
                                                            inputProps={{
                                                                "aria-labelledby":
                                                                    labelId,
                                                            }}
                                                            // disabled={
                                                            //     reviewStatusId === 1
                                                            //         ? false
                                                            //         :   roleId ===
                                                            //           2
                                                            //         ? false
                                                            //         : true
                                                            // }
                                                            disabled={
                                                                reviewStatusId !==
                                                                    1
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                        onClick={() => {
                                                            handleCollapseExpand(
                                                                row.transactionId
                                                            );
                                                        }}
                                                    >
                                                        <div className="flex flex-col font-bold text-[#0091ea] cursor-pointer">
                                                            <span>
                                                                {
                                                                    row.account_code
                                                                }{" "}
                                                            </span>
                                                            <span>
                                                                {
                                                                    row.description
                                                                }
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <span className="font-bold">
                                                            {row.transactionId}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <span className="font-bold">
                                                            {row.entryDate}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <span className="font-bold">
                                                            {currencySymbol}<CurrencyFormat displayType={'text'} thousandSeparator={true} value={row.debit} />
                                                        </span>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <span className="font-bold">
                                                        {currencySymbol}(<CurrencyFormat displayType={'text'} thousandSeparator={true} value={row.credit} />)
                                                        </span>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <span
                                                            className={`rounded-lg md:w-12 p-1 text-center text-white font-bold ${row.riskScore >=
                                                                riskLevel.range_high
                                                                ? "bg-[#d60000]"
                                                                : row.riskScore >=
                                                                    riskLevel.range_medium
                                                                    ? "bg-[#f2641a]"
                                                                    : row.riskScore >=
                                                                        riskLevel.range_low
                                                                        ? "bg-[#f5af2d]"
                                                                        : "bg-[#00A4DF]"
                                                                }`}
                                                        >
                                                            {row.riskScore}%
                                                        </span>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                handleCommentsClick(
                                                                    event
                                                                );
                                                                setNewTransactionId(
                                                                    row.transactionId
                                                                );
                                                            }}
                                                        >
                                                            <Badge
                                                                className="flex"
                                                                badgeContent={
                                                                    row.comments
                                                                }
                                                                color="primary"
                                                            >
                                                                <ForumIcon color="action" />
                                                            </Badge>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell
                                                        style={{
                                                            paddingBottom: 0,
                                                            paddingTop: 0,
                                                        }}
                                                        colSpan={8}
                                                    >
                                                        <Collapse
                                                            in={row.open}
                                                            timeout="auto"
                                                            unmountOnExit
                                                            sx={{ p: 2 }}
                                                        >
                                                            <div className="flex flex-row w-full">
                                                                <div className="w-1/4">
                                                                    TRANSACTION
                                                                    TEXT
                                                                </div>
                                                                <div className="w-1/4">
                                                                    ENTRY
                                                                    LOCATION
                                                                </div>
                                                                <div className="w-1/4">
                                                                    ENTRY USER
                                                                </div>
                                                                <div className="w-1/4">
                                                                    REVIEW
                                                                    STATUS
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-row w-full mt-2">
                                                                <div className="w-1/4 font-bold">
                                                                    {
                                                                        row.transDesc
                                                                    }
                                                                </div>
                                                                <div className="w-1/4 font-bold">
                                                                    {
                                                                        row.location
                                                                    }
                                                                </div>
                                                                <div className="w-1/4 font-bold">
                                                                    {
                                                                        row.entryByName
                                                                    }
                                                                </div>
                                                                <div className="w-1/4 font-bold">
                                                                    {reviewStatusId ===
                                                                        1
                                                                        ? "Pending Review"
                                                                        : reviewStatusId ===
                                                                            2
                                                                            ? "Under Review"
                                                                            : "Closed"}
                                                                </div>
                                                            </div>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            </Fragment>
                                        );
                                    })}
                                {/* {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height:
                                                (dense ? 33 : 53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )} */}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalTransactions}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    /> */}
                </div>
                <CommentsPopOver
                    open={commentsOpen}
                    anchorEl={anchorEl}
                    handleClose={handleCommentsClose}
                    module={"ap"}
                    docId={selectedCommentId}
                    type={"tr"}
                />
            </div>
        </div>
    );
};

export default TransactionDetailsTable;
