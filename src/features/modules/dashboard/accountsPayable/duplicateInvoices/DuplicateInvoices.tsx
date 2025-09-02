import {
    Box,
    Button,
    CircularProgress,
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Skeleton,
    Stack,
    Tooltip,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../../../api/axios";
import { Config, ReviewStatus } from "../../../../../shared/models/filters";
import {
    DuplicateInvoices,
    RiskLevel,
    RiskLevelItem,
} from "../../../../../shared/models/records";
import FilterBar from "../../../../../shared/ui/filter-bar/FilterBar";
import numberSuffixPipe from "../../../../../shared/helpers/numberSuffixPipe";
import KPICard from "../../../../../shared/ui/cards/KPICards";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AddIcon from "@mui/icons-material/Add";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import MediaControlCard from "./components/KPICards";
import EnhancedTable from "./components/DuplicatesTable";
import { useAppSelector, useAppDispatch } from "../../../../../hooks";
import { RootState } from "../../../../../store/Store";
import {
    updateAPSelectedRules,
    updateAPSelectedAccounts,
    updateAPSelectedCompanies,
    updateAPSelectedSelectedTransactionType,
    updateAPSelectedToggle,
    updateAPSelectedRisk,
    updateAPStartDate,
    updateAPEndDate,
    updateAPVendors,
    updateAPSelectedVendors,
    updateAPInvoiceStartDate,
    updateAPInvoiceEndDate,
    updateAPRules,
    updateAPCompanies,
    clearFilters,
} from "../../../ap-slice/APSlice";
import ReviewStatusDropDown from "../../../../../shared/ui/dropdowns/ReviewStatusDropDown";
import StatusDropDown from "../../../../../shared/ui/dropdowns/StatusDropDown";
import PositionedMenu from "../../generalLedger/transactions/components/TransactionExport";
import { getPath } from "../../../../../shared/helpers/getPath";
import { downloadCSV, downloadExcel } from "../../../../../shared/helpers/downloadFile";

const GET_FILTERS_URL = "v1/ap/get_filters";
const GET_DOCUMENTS_URL = "v1/ap/duplicatelist";
const GET_RISK_STATUS_URL = "v1/ap/riskstatus";
const GET_CHART_DATA_URL = "v1/ap/chartsdata";
const GET_REVIEW_STATUS_CODE_URL = "v1/je/workflowstatus";
const PRINT_TOKEN = 'v1/print/token';

const SORT_CONSTANTS = [
    { text: "Invoice Date", key: "INVOICE_DATE", value: 1 },
    { text: "Invoice Number", key: "INVOICE_NUMBER", value: 2 },
    { text: "Invoice Amount", key: "INVOICE_AMOUNT", value: 3 },
    { text: "Duplicate ID", key: "DUPLICATES_ID", value: 4 },
    { text: "Posted Date", key: "POSTED_DATE", value: 5 },
    { text: "Vendor Name", key: "VENDOR_NAME", value: 6 },
    { text: "Company", key: "COMPANY_CODE", value: 7 },
];

const ADDITIONAL_SORT_CONSTANTS = SORT_CONSTANTS.concat([
    { text: "Number Of Duplicates", key: "NO_OF_DUPLICATES", value: 8 },
    { text: "Posted By", key: "POSTED_BY", value: 9 },
    { text: "Payment Date", key: "Payment_date", value: 10 },
    { text: "Risk Score", key: "RISK_SCORE", value: 11 }]);

const setInitData = (
    companies: any,
    rules: any,
    selectedRules: any,
    selectedCompanies: any,
    selectedRisk: any,
    postedStartDate: any,
    postedEndDate: any,
    selectedAccounts: any,
    selectedTransactionType: any,
    selectedVendors: any,
    selectedToggle: any,
    invoiceStartDate: any,
    invoiceEndDate: any,
    vendors: any
) => {
    let config = [
        {
            label: "Company",
            data: companies,
            filterName: "apcompanies",
            filterType: "multi-dropdown",
            selected: selectedCompanies,
            active: true,
        },
        // {
        //     label: "Controls",
        //     data: rules,
        //     filterName: "aprules",
        //     filterType: "multi-dropdown",
        //     selected: selectedRules,
        //     active: true,
        // },
        {
            label: "Posted Date",
            data: [
                {
                    posted_date_start: postedStartDate,
                    posted_date_end: postedEndDate,
                },
            ],
            filterName: "posted-date",
            filterType: "date-picker",
            selected: {
                posted_date_start: postedStartDate,
                posted_date_end: postedEndDate,
            },
            active: true,
        },
        {
            label: "Invoice Date",
            data: [
                {
                    posted_date_start: invoiceStartDate,
                    posted_date_end: invoiceEndDate,
                },
            ],
            filterName: "invoice-date",
            filterType: "date-picker",
            selected: {
                posted_date_start: invoiceStartDate,
                posted_date_end: invoiceEndDate,
            },
            active: true,
        },
        // {
        //     label: "Analysis Data Set",
        //     data: [
        //         { text: "Above Materiality", value: 1 },
        //         { text: "Above Threshold", value: 2 },
        //         { text: "Below Threshold", value: 3 },
        //     ],
        //     filterName: "toggle",
        //     filterType: "single-dropdown",
        //     selected: selectedToggle,
        //     active: true,
        // },
        // {
        //     label: "Accounts",

        //     data: [
        //         {
        //             dataSource: [],
        //             value: "title",
        //             text: "title",
        //             child: "subitems",
        //         },
        //     ],
        //     filterName: "accounts",
        //     filterType: "dropdown-tree",
        //     selected: selectedAccounts,
        //     active: true,
        // },
        // {
        //     label: "Risk Level",
        //     data: [
        //         { text: "High", value: "1" },
        //         { text: "Medium", value: "2" },
        //         { text: "Low", value: "3" },
        //     ],
        //     filterName: "risk",
        //     filterType: "multi-dropdown",
        //     selected: selectedRisk,
        //     active: true,
        // },
        // {
        //     label: "Transaction Type",
        //     data: [
        //         {
        //             text: "Asset posting",
        //             value: 27,
        //         },
        //         {
        //             text: "Accounting document",
        //             value: 28,
        //         },
        //         {
        //             text: "Customer document",
        //             value: 29,
        //         },
        //         {
        //             text: "Customer credit memo",
        //             value: 30,
        //         },
        //         {
        //             text: "Customer invoice",
        //             value: 31,
        //         },
        //         {
        //             text: "Customer payment",
        //             value: 32,
        //         },
        //         {
        //             text: "Vendor document",
        //             value: 33,
        //         },
        //         {
        //             text: "Vendor credit memo",
        //             value: 34,
        //         },
        //         {
        //             text: "Vendor invoice",
        //             value: 35,
        //         },
        //         {
        //             text: "Vendor payment",
        //             value: 36,
        //         },
        //         {
        //             text: "Invoice - gross",
        //             value: 37,
        //         },
        //         {
        //             text: "G/L account document",
        //             value: 38,
        //         },
        //     ],
        //     filterName: "transaction-type",
        //     filterType: "multi-dropdown",
        //     selected: selectedTransactionType,
        //     active: true,
        // },
        {
            label: "Vendors",
            data: vendors,
            filterName: "apvendors",
            filterType: "multi-dropdown",
            selected: selectedVendors,
            active: true,
        },
        {
            label: "Invoice Category",
            data: [
                { text: "Credit Note", value: 1 },
                { text: "Invoice", value: 2 },
            ],
            filterName: "category",
            filterType: "multi-dropdown",
            selected: undefined,
            active: true,
        },
    ];
    return config;
};

const statusDropDownConfig: ReviewStatus = {
    label: "Review Status",
    data: [{ text: "Pending Review", value: 5 }],
    selected: 5,
};

const SortByDropDownConfig = {
    label: "Sort By",
    data: [
        { text: "Invoice Date", value: 1 },
        { text: "Invoice Number", value: 2 },
        { text: "Invoice Amount", value: 3 },
        { text: "Duplicate ID", value: 4 },
        { text: "Posted Date", value: 5 },
        { text: "Vendor Name", value: 6 },
        { text: "Company", value: 7 },
    ],
    selected: 1,
};

const DuplicateInvoice = () => {

    const dispatch = useAppDispatch();
    const currencySymbol = localStorage.getItem("CurrencySymbol");

    let companies = useAppSelector((state) => state.APDataSlice.companies);

    let rules = useAppSelector((state) => state.APDataSlice.rules);
    let selectedRules = useAppSelector(
        (state) => state.APDataSlice.rule_selected
    );
    let selectedRisk = useAppSelector(
        (state) => state.APDataSlice.risk_selected
    );
    let selectedCompanies = useAppSelector(
        (state) => state.APDataSlice.company_selected
    );
    let postedStartDate = useAppSelector(
        (state) => state.APDataSlice.posted_date_start_selected
    );
    let postedEndDate = useAppSelector(
        (state) => state.APDataSlice.posted_date_end_selected
    );
    let selectedAccounts = useAppSelector(
        (state) => state.APDataSlice.account_selected
    );
    let selectedTransactionType = useAppSelector(
        (state) => state.APDataSlice.transaction_type_selected
    );
    let selectedVendors = useAppSelector(
        (state) => state.APDataSlice.vendors_selected
    );
    let vendors = useAppSelector(
        (state) => state.APDataSlice.vendors
    );
    let invoiceStartDate = useAppSelector(
        (state) => state.APDataSlice.invoice_date_start_selected
    );
    let invoiceEndDate = useAppSelector(
        (state) => state.APDataSlice.invoice_date_end_selected
    );
    let selectedToggle = useAppSelector(
        (state) => state.APDataSlice.toggle_selected
    );

    const [filterConfig, setFilterConfig] = useState<Config[]>(
        setInitData(
            companies,
            rules,
            selectedRules,
            selectedCompanies,
            selectedRisk,
            postedStartDate,
            postedEndDate,
            selectedAccounts,
            selectedTransactionType,
            selectedVendors,
            selectedToggle,
            invoiceStartDate,
            invoiceEndDate,
            vendors,
        )
    );
    const [reviewStatusConfig, setReviewStatusConfig] =
        useState(statusDropDownConfig);

    const [sortText, setSortText] = useState("Invoice Date");
    const [sortByConfig, setSortByConfig] = useState(SortByDropDownConfig);
    const [sortOrder, setSortOrder] = useState(true);
    const [isReviewStatusLoading, setIsReviewStatusLoading] = useState(false);
    const [documents, setDocuments] = useState<DuplicateInvoices[]>([]);
    const [isDocumentsLoading, setIsDocumentLoading] = useState(false);
    const [riskLevel, setRiskLevel] = useState<RiskLevel>({
        range_high: 0,
        range_medium: 0,
        range_low: 0,
    });

    const [page, setPage] = useState(0);
    const [perpage, setPerpage] = useState(5);
    const Axios = axios;

    const [vendorCount, setVendorCount] = useState("0");
    const [totalAmount, setTotalAmount] = useState("0");
    const [invoiceCount, setInvoiceCount] = useState("0");
    const [amountInNumber, setAmountInNumber] = useState(0);
    const [duplicateCount, setDuplicateCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    //fo search
    const sTextRef = useRef<any>(null);

    const handleState = (items: any, filterName: string) => {
        let itemArray = [...filterConfig];
        let index = itemArray.findIndex((item) => {
            return item.filterName === filterName;
        });
        itemArray[index].selected = items;
        if (filterName === "posted-date") {
            dispatch(updateAPStartDate(items.posted_date_start));
            dispatch(updateAPEndDate(items.posted_date_end));
        }
        if (filterName === "invoice-date") {
            dispatch(updateAPInvoiceStartDate(items.posted_date_start));
            dispatch(updateAPInvoiceEndDate(items.posted_date_end));
        }
        if (filterName === "aprules") {
            dispatch(updateAPSelectedRules(items));
        }
        if (filterName === "apcompanies") {
            dispatch(updateAPSelectedCompanies(items));
        }
        if (filterName === "risk") {
            dispatch(updateAPSelectedRisk(items));
        }
        if (filterName === "toggle") {
            dispatch(updateAPSelectedToggle(items));
        }
        if (filterName === "accounts") {
            dispatch(updateAPSelectedAccounts(items));
        }
        if (filterName === "transaction-type") {
            dispatch(updateAPSelectedSelectedTransactionType(items));
        }
        if (filterName === "apvendors") {
            dispatch(updateAPSelectedVendors(items));
        }
        setFilterConfig(itemArray);
        getDocuments(
            items,
            reviewStatusConfig,
            sortByConfig.selected,
            sortOrder,
            page,
            perpage
        );
    };

    const handleReviewStatusState = (items: any) => {

        let reviewStatusArray = { ...reviewStatusConfig };
        reviewStatusArray.selected = items;
        setReviewStatusConfig(reviewStatusArray);
        getDocuments(
            filterConfig,
            {
                label: reviewStatusConfig.label,
                data: [...reviewStatusConfig.data],
                selected: items,
            },
            sortByConfig.selected,
            sortOrder,
            page,
            perpage
        );
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
        window.location.reload();
    };
    //for add/remove filter menu
    const [anchorFilter, setAnchorFilter] = useState<null | HTMLElement>(null);
    const openAddRemoveFilter = Boolean(anchorFilter);
    const handleAddRemoveFilterClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setAnchorFilter(event.currentTarget);
    };

    const handleAddRemoveSelection = (filter: any, action: boolean) => {
        handleAddOrRemoveFilters(filter.filterName, action);
        handleAddRemoveFilterClose();
    };
    const handleAddRemoveFilterClose = () => {
        setAnchorFilter(null);
    };

    const handleAddOrRemoveFilters = (filterName: string, action: boolean) => {
        if (action === false) {
            let itemArray = [...filterConfig];
            let index = itemArray.findIndex((item) => {
                return item.filterName === filterName;
            });
            if (index > -1) {
                itemArray[index].active = false;
                itemArray[index].selected = undefined;
                setFilterConfig(itemArray);
            }
        }
        if (action === true) {
            let itemArray = [...filterConfig];
            let index = itemArray.findIndex((item) => {
                return item.filterName === filterName;
            });
            if (index > -1) {
                itemArray[index].active = true;
                itemArray[index].selected = undefined;
                setFilterConfig(itemArray);
            }
        }
    };

    const popUpClosedToParent = () => {
        setDocuments([]);
        setPage(0);
        setPerpage(5);
        getDocuments(
            filterConfig,
            reviewStatusConfig,
            sortByConfig.selected,
            sortOrder,
            0,
            5
        );
    };

    const getPathValue = (key: any) => {
        const pathHistory = JSON.parse(localStorage.getItem("pathHistory") ?? "{}");
        return pathHistory?.["audit"]?.[key]
    }

    const getDocuments = async (
        itemArray: Config[],
        reviewStatusArray: ReviewStatus,
        sortBy: number,
        sortOrder: boolean,
        page: number,
        perpage: number
    ) => {
        setIsDocumentLoading(true);
        let filters = {
            posted_date: {
                posted_date_start: filterConfig[1].selected?.posted_date_start,
                posted_date_end: filterConfig[1].selected?.posted_date_end,
            },
            invoice_date: {
                posted_date_start: filterConfig[2].selected?.posted_date_start,
                posted_date_end: filterConfig[2].selected?.posted_date_end,
            },
            // process_status: [1, 2],
            category: filterConfig?.find((filter: any) => {
                if (filter.filterName === "category") {
                    return filter;
                }
            })!.selected,
            company_code: filterConfig?.find((filter: any) => {
                if (filter.filterName === "apcompanies") {
                    return filter;
                }
            })!.selected,
            vendor: filterConfig?.find((filter: any) => {
                if (filter.filterName === "apvendors") {
                    return filter;
                }
            })!.selected,
            review_status: [reviewStatusArray.selected],
            stext: sTextRef.current?.value,
            audit_id: getPath.getPathValue('audit_id')
        };
        try {
            setIsLoading(true)
            let formData = new FormData();
            formData.append("filters", JSON.stringify(filters));
            formData.append("page", (page + 1).toString());
            formData.append("perpage", perpage.toString());
            formData.append(
                "sortkey",
                ADDITIONAL_SORT_CONSTANTS.find((element) => element.value === sortBy)!.key
            );
            formData.append("sortorder", sortOrder ? "desc" : "asc");

            const getDocumentsResponse = await Axios.post(
                GET_DOCUMENTS_URL,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                }
            );
            setTimeout(() => {
                setIsLoading(false)
            }, 2000)
            if (getDocumentsResponse.data.data.duplicates.length) {
                let Obj: DuplicateInvoices[] = [];
                getDocumentsResponse.data.data.duplicates.forEach(
                    (record: DuplicateInvoices) => {
                        Obj.push(record);
                    }
                );
                setDocuments(Obj);
                const amount = numberSuffixPipe(
                    getDocumentsResponse.data.data.total_amount
                );
                setAmountInNumber(
                    getDocumentsResponse.data.data.duplicate_amount
                        ? getDocumentsResponse.data.data.duplicate_amount
                        : 0
                );
                setDuplicateCount(
                    getDocumentsResponse.data.data.duplicate_invoices
                        ? getDocumentsResponse.data.data.duplicate_invoices
                        : 0
                );
                setVendorCount(getDocumentsResponse.data.data.total_vendors);
                setTotalAmount(String(amount));
                setInvoiceCount(getDocumentsResponse.data.data.total_Invoices);

                setIsDocumentLoading(false);
            } else {
                setVendorCount(getDocumentsResponse.data.data.total_vendors);
                setInvoiceCount(getDocumentsResponse.data.data.total_Invoices);
                setTotalAmount('0');
                const amount = numberSuffixPipe(
                    getDocumentsResponse.data.data.total_amount
                );
                setTotalAmount(String(amount));
                setDocuments([]);
                setIsDocumentLoading(false);
            }
        } catch { }
    };

    const handlePagination = (page: number, perpage: number) => {
        setPage(page);
        setPerpage(perpage);
        getDocuments(
            filterConfig,
            reviewStatusConfig,
            sortByConfig.selected,
            sortOrder,
            page,
            perpage
        );
    };

    const handleStextEnterAction = (event: any) => {
        if (event.key === "Enter") {
            handleStextupdate();
        }
    };

    const handleSortOrder = (sortorder: boolean) => {
        setSortOrder(sortorder);
        getDocuments(
            filterConfig,
            reviewStatusConfig,
            sortByConfig.selected,
            sortorder,
            page,
            perpage
        );
    };

    const handleSortOrderWithState = (orderBy: string, sortorder: boolean) => {
        setSortOrder(sortorder);
        let orderValue = ADDITIONAL_SORT_CONSTANTS.find(
            (element) => element.key === orderBy
        )?.value;
        let orderKey = orderValue ? orderValue : 0
        let sortByObj = { ...sortByConfig };
        sortByObj.selected = orderKey;
        setSortByConfig(sortByObj);
        getDocuments(
            filterConfig,
            reviewStatusConfig,
            orderKey,
            sortorder,
            page,
            perpage
        );
    };

    const handleSortByState = (items: any) => {
        let sortByObj = { ...sortByConfig };
        sortByObj.selected = items;
        setSortByConfig(sortByObj);
        let sortTextTemp = "";
        sortTextTemp = SORT_CONSTANTS.find(
            (element) => element.value === items
        )!.text;
        setSortText(sortTextTemp);
        getDocuments(
            filterConfig,
            reviewStatusConfig,
            items,
            sortOrder,
            page,
            perpage
        );
    };

    const handleStextupdate = () => {
        setPage(0);
        setPerpage(5);
        getDocuments(
            filterConfig,
            reviewStatusConfig,
            sortByConfig.selected,
            sortOrder,
            0,
            5
        );
    };

    const csv = async () => {

        let filters = {
            posted_date: {
                posted_date_start: filterConfig?.find((filter: any) => {
                    if (filter.filterName === "posted-date") {
                        return filter;
                    }
                })!.selected?.posted_date_start,
                posted_date_end: filterConfig?.find((filter: any) => {
                    if (filter.filterName === "posted-date") {
                        return filter;
                    }
                })!.selected?.posted_date_end,
            },
            invoice_date: {
                posted_date_start: filterConfig?.find((filter: any) => {
                    if (filter.filterName === "invoice-date") {
                        return filter;
                    }
                })!.selected?.posted_date_start,
                posted_date_end: filterConfig?.find((filter: any) => {
                    if (filter.filterName === "invoice-date") {
                        return filter;
                    }
                })!.selected?.posted_date_end,
            },
            process_status: [1, 2],
            category: filterConfig?.find((filter: any) => {
                if (filter.filterName === "category") {
                    return filter;
                }
            })!.selected,
            company_code: filterConfig?.find((filter: any) => {
                if (filter.filterName === "apcompanies") {
                    return filter;
                }
            })!.selected,
            vendor: filterConfig?.find((filter: any) => {
                if (filter.filterName === "apvendors") {
                    return filter;
                }
            })!.selected,
            review_status: [reviewStatusConfig.selected],
            stext: sTextRef.current?.value,
            audit_id: getPath.getPathValue("audit_id")
        };
        try {
            const response = await Axios.get(PRINT_TOKEN, {
                headers: {
                    Authorization: localStorage.getItem(
                        "TR_Token"
                    ) as string,
                },
            });
            downloadCSV(response.data.data.Token, filters, "csvDuplicates", "duplicate", "AP")
           
        }
        catch (err) {
            console.error(err);
        }
    };

    const getCsvData = (() => {
        csv();
    });

    const excel = async () => {
        let filters = {
            posted_date: {
                posted_date_start: filterConfig?.find((filter: any) => {
                    if (filter.filterName === "posted-date") {
                        return filter;
                    }
                })!.selected?.posted_date_start,
                posted_date_end: filterConfig?.find((filter: any) => {
                    if (filter.filterName === "posted-date") {
                        return filter;
                    }
                })!.selected?.posted_date_end,
            },
            invoice_date: {
                posted_date_start: filterConfig?.find((filter: any) => {
                    if (filter.filterName === "invoice-date") {
                        return filter;
                    }
                })!.selected?.posted_date_start,
                posted_date_end: filterConfig?.find((filter: any) => {
                    if (filter.filterName === "invoice-date") {
                        return filter;
                    }
                })!.selected?.posted_date_end,
            },
            process_status: [1, 2],
            category: filterConfig?.find((filter: any) => {
                if (filter.filterName === "category") {
                    return filter;
                }
            })!.selected,
            company_code: filterConfig?.find((filter: any) => {
                if (filter.filterName === "apcompanies") {
                    return filter;
                }
            })!.selected,
            vendor: filterConfig?.find((filter: any) => {
                if (filter.filterName === "apvendors") {
                    return filter;
                }
            })!.selected,
            review_status: [reviewStatusConfig.selected],
            stext: sTextRef.current?.value,
            audit_id: getPath.getPathValue("audit_id")
        };
        // const encodedFilters = JSON.stringify(filters);
        try {
            const response = await Axios.get(PRINT_TOKEN, {
                headers: {
                    Authorization: localStorage.getItem(
                        "TR_Token"
                    ) as string,
                },
            });
            downloadExcel(response.data.data.Token, filters, "exportDuplicates", "duplicate", "AP")
        }
        catch (err) {
            console.error(err);
        }
    };

    const getExcelData = (() => {
        excel();
    });

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const generateFilterConfig = (data: any) => {
            let response = data;
            let keys = Object.keys(response);
            let configCopy: Config[] = [
                ...setInitData(
                    companies,
                    rules,
                    selectedRules,
                    selectedCompanies,
                    selectedRisk,
                    postedStartDate,
                    postedEndDate,
                    selectedAccounts,
                    selectedTransactionType,
                    selectedVendors,
                    selectedToggle,
                    invoiceStartDate,
                    invoiceEndDate,
                    vendors,
                ),
            ];
            keys?.forEach((key: any) => {
                setInitData(companies, rules, selectedRules, selectedCompanies, selectedRisk, postedStartDate,
                    postedEndDate, selectedAccounts, selectedTransactionType, selectedVendors, selectedToggle, invoiceStartDate, invoiceEndDate, vendors).forEach((filter, index) => {
                        if (filter.filterName === key) {
                            let Obj: any[] = [];
                            switch (key) {
                                case "apcompanies":
                                    response[key].forEach((companyItem: any) => {
                                        Obj.push(companyItem);
                                    });
                                    configCopy[index].data = [...Obj];
                                    break;
                                case "apvendors":
                                    response[key].forEach((rulesItem: any) => {
                                        Obj.push(rulesItem);
                                    });
                                    configCopy[index].data = [...Obj];
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
            });

            setFilterConfig([...configCopy]);
            getDocuments(
                configCopy,
                reviewStatusConfig,
                sortByConfig.selected,
                sortOrder,
                page,
                perpage
            );
            // getRiskStatus(configCopy);
            // getAnomalyCategories(configCopy);
        };

        const getFilters = async () => {
            try {
                setIsLoading(true)
                let getFilterArray: string[] = [];
                setInitData(companies, rules, selectedRules, selectedCompanies, selectedRisk, postedStartDate,
                    postedEndDate, selectedAccounts, selectedTransactionType, selectedVendors, selectedToggle, invoiceStartDate, invoiceEndDate, vendors).forEach((item) => {
                        if (item.filterName) {
                            getFilterArray.push(item.filterName);
                        }
                    });
                let formData = new FormData();
                formData.append("filtertype", getFilterArray.join(","));
                formData.append("audit_id",  getPath.getPathValue("audit_id"));
                formData.append("client_id",  getPath.getPathValue("client_id"));

                const response = await Axios.post(GET_FILTERS_URL, formData, {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                });
                isMounted && generateFilterConfig(response.data.data);
                // generateFilterConfig();
                setTimeout(() => {
                    setIsLoading(false)
                }, 2000)
            } catch (err) {
                console.error(err);
            }
        };

        const getRiskConfig = async () => {
            try {
                setIsLoading(true)
                let formData = new FormData();
                formData.append("filtertype", "riskweights");
                formData.append("audit_id",  getPath.getPathValue("audit_id"));
                formData.append("client_id",  getPath.getPathValue("client_id"));
                
                const response = await Axios.post(GET_FILTERS_URL, formData, {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                });
                setTimeout(() => {
                    setIsLoading(false)
                }, 2000)
                if (response.data.data) {
                    let Obj: RiskLevel = {
                        range_high: 0,
                        range_low: 0,
                        range_medium: 0,
                    };
                    response?.data?.data?.riskweights?.forEach(
                        (element: RiskLevelItem) => {
                            switch (element.KEYNAME) {
                                case "range_high":
                                    Obj.range_high =
                                        Number(element.KEYVALUE) * 100;
                                    break;
                                case "range_medium":
                                    Obj.range_medium =
                                        Number(element.KEYVALUE) * 100;
                                    break;
                                case "range_low":
                                    Obj.range_low =
                                        Number(element.KEYVALUE) * 100;
                                    break;
                                default:
                                    break;
                            }
                        }
                    );
                    setRiskLevel(Obj);
                }
            } catch (err) {
                console.error(err);
            }
            isMounted && getFilters();
        };

        const getWorkFlowStatus = async () => {
            setIsLoading(true)
            try {
                let formData = new FormData();
                formData.append("module", "dp");
                setIsReviewStatusLoading(true);
                const reviewStatusArray = await Axios.post(
                    GET_REVIEW_STATUS_CODE_URL,
                    formData,
                    {
                        headers: {
                            Authorization: localStorage.getItem(
                                "TR_Token"
                            ) as string,
                        },
                    }
                );
                setTimeout(() => {
                    setIsLoading(false)
                }, 2000)
                if (reviewStatusArray.data.data) {
                    let reviewStatObj: any[] = [];
                    reviewStatusArray.data.data.forEach((status: any) => {
                        status.text = status.REVIEW_STATUS_DESCRIPTION;
                        status.value = status.REVIEWSTATUSID;

                        delete status.REVIEW_STATUS_DESCRIPTION;
                        delete status.REVIEWSTATUSID;
                        delete status.REVIEW_STATUS_CODE;

                        reviewStatObj.push(status);
                    });
                    let reviewStatusConfigCopy = { ...reviewStatusConfig };
                    reviewStatusConfigCopy.data = [...reviewStatObj];
                    setReviewStatusConfig(reviewStatusConfigCopy);
                }
                isMounted && getRiskConfig();
                setIsReviewStatusLoading(false);
            } catch { }
        };

        const setDate = () => {
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth();
            const currentDay = new Date().getDate();
            var financialYear = new Date().getFullYear();
            // if (currentMonth < 3) {
            //     financialYear = financialYear - 1;
            // }

            // let configCopy = [
            //     ...setInitData(
            //         companies,
            //         rules,
            //         selectedRules,
            //         selectedCompanies,
            //         selectedRisk,
            //         postedStartDate,
            //         postedEndDate,
            //         selectedAccounts,
            //         selectedTransactionType,
            //         selectedVendors,
            //         selectedToggle,
            //         invoiceStartDate,
            //         invoiceEndDate,
            //         vendors,
            //     ),
            // ];
            // configCopy[2].data[0] = {
            //     posted_date_start: postedStartDate,
            //     posted_date_end: postedEndDate,
            // };
            // configCopy[2].selected = {
            //     posted_date_start: postedStartDate,
            //     posted_date_end: postedEndDate,
            // };
            // configCopy[3].data[0] = {
            //     posted_date_start: invoiceStartDate,
            //     posted_date_end: invoiceEndDate,
            // };
            // configCopy[3].selected = {
            //     posted_date_start: invoiceStartDate,
            //     posted_date_end: invoiceEndDate,
            // };

            if (currentMonth < 3) {
                financialYear = financialYear - 1;
            }

            let configCopy = [...setInitData(companies, rules, selectedRules, selectedCompanies, selectedRisk, postedStartDate,
                postedEndDate, selectedAccounts, selectedTransactionType, selectedVendors, selectedToggle, invoiceStartDate,
                invoiceEndDate, vendors)];
            configCopy[2].data[0] = {
                posted_date_start: `${financialYear}-04-01`,
                posted_date_end: `${currentYear}-${currentMonth + 1
                    }-${currentDay}`,
            };
            configCopy[2].selected = {
                posted_date_start: `${financialYear}-04-01`,
                posted_date_end: `${currentYear}-${currentMonth + 1
                    }-${currentDay}`,
            };
        };
        setDate();
        getWorkFlowStatus();
        // getFilters();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);


    return (
        <div className="flex flex-col p-7 overflow-auto ">
            <div className="flex w-full">
                <FilterBar
                    config={filterConfig}
                    isLoading={isLoading}
                    handleStateToParent={handleState}
                />
            </div>
            <div className="flex w-full flex-row-reverse">
                <span className="my-auto cursor-pointer">
                    <Tooltip title="Clear Filters">
                        <Button
                            className="text-black"
                            onClick={handleClearFilters}
                        >
                            <BackspaceOutlinedIcon />
                        </Button>
                    </Tooltip>
                </span>
                <span>
                    <Tooltip title="Add/Remove Filters">
                        <Button
                            className="text-black"
                            id="add-remove-button"
                            aria-controls={
                                openAddRemoveFilter
                                    ? "add-remove-menu"
                                    : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={
                                openAddRemoveFilter ? "true" : undefined
                            }
                            onClick={handleAddRemoveFilterClick}
                        >
                            <AddBoxOutlinedIcon />
                        </Button>
                    </Tooltip>
                </span>
                <Menu
                    id="add-remove-menu"
                    anchorEl={anchorFilter}
                    open={openAddRemoveFilter}
                    onClose={handleAddRemoveFilterClose}
                    MenuListProps={{
                        "aria-labelledby": "add-remove-button",
                    }}
                >
                    {filterConfig.map((filter) => {
                        if (filter.active) {
                            return (
                                <MenuItem
                                    onClick={() => {
                                        handleAddRemoveSelection(filter, false);
                                    }}
                                    key={filter.label}
                                >
                                    <ListItemText>{filter.label}</ListItemText>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row-reverse",
                                            }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </ListItemIcon>
                                    </Box>
                                </MenuItem>
                            );
                        } else {
                            return (
                                <MenuItem
                                    onClick={() => {
                                        handleAddRemoveSelection(filter, true);
                                    }}
                                    key={filter.label}
                                >
                                    <ListItemText>{filter.label}</ListItemText>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row-reverse",
                                            }}
                                        >
                                            <AddIcon fontSize="small" />
                                        </ListItemIcon>
                                    </Box>
                                </MenuItem>
                            );
                        }
                    })}
                </Menu>
            </div>
            <div className="flex flex-row mt-4">
                <div className="flex flex-col mr-2 w-full h-fit">
                    <div className="">
                        <div className="flex flex-wrap justify-between mx-8">
                            <MediaControlCard
                                value={String(vendorCount)}
                                title={"Vendors"}
                                type="vendor"
                                color="#fdeba2"
                            />
                            <MediaControlCard
                                value={String(invoiceCount)}
                                title={"Duplicate Invoices"}
                                type="invoice"
                                color="#b3f1d0"
                            />
                            <MediaControlCard
                                value={`${currencySymbol} ${String(totalAmount)} `}
                                title={"Duplicate Invoices Value"}
                                type="invoice"
                                color="#f5b8b9"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row mt-4 gap-3">
                <div>
                    <ReviewStatusDropDown
                        itemArray={reviewStatusConfig.data}
                        label={reviewStatusConfig.label}
                        stateChange={handleReviewStatusState}
                        selectedItem={reviewStatusConfig.selected}
                        defaultValue={5}
                    />
                </div>
                <Divider className="hidden md:flex" orientation="vertical" />
                {sortOrder ? (
                    <span
                        className="my-auto md:ml-3 items-center cursor-pointer"
                        onClick={() => {
                            handleSortOrder(!sortOrder);
                        }}
                    >
                        <span className="my-auto">
                            <Tooltip title="Sort By">
                                <ArrowDownwardIcon />
                            </Tooltip>
                        </span>
                    </span>
                ) : (
                    <span
                        className="my-auto md:ml-3 items-center cursor-pointer"
                        onClick={() => {
                            handleSortOrder(!sortOrder);
                        }}
                    >
                        <span className="my-auto">
                            <Tooltip title="Sort By">
                                <ArrowUpwardIcon />
                            </Tooltip>
                        </span>
                    </span>
                )}
                <div className="w-full md:w-1/5">
                    <StatusDropDown
                        itemArray={SortByDropDownConfig.data}
                        label={SortByDropDownConfig.label}
                        stateChange={handleSortByState}
                        selectedItem={SortByDropDownConfig.selected}
                    />
                </div>

                <div className="w-full md:w-3/12 my-auto">
                    <div className="relative flex flex-row">
                        <input
                            className="p-2 w-full h-full border-2 border-solid border-slate-300 rounded-md focus:border-[#1976d2] focus:outline-none"
                            ref={sTextRef}
                            type="text"
                            autoComplete="off"
                            // onChange={handleStextupdate}
                            placeholder={`Search ${sortText}`}
                            onKeyDown={handleStextEnterAction}
                        />
                        <span
                            className="absolute right-2  top-1 m-auto cursor-pointer text-slate-500"
                            onClick={handleStextupdate}
                        >
                            <SearchIcon />
                        </span>
                    </div>
                </div>

                <PositionedMenu getCsvData={getCsvData} getExcelData={getExcelData} />
                {isLoading
                    ?
                    <div className="flex-row-reverse pr-19">
                        <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                    </div>
                    :
                    ''
                }
            </div>

            <div className="flex flex-col md:flex-row w-full item-center gap-3">
                <div className="w-full md:w-4/12 my-auto ml-4 font-roboto text-sm">
                    {documents.length ? numberSuffixPipe(amountInNumber) : 0} /{" "}
                    {documents.length ? numberSuffixPipe(duplicateCount) : 0} Accounting Documents
                </div>
            </div>
            <div className="flex flex-row mt-4">
                {/* < DuplicateInvoiceTable data={documents} page={page} perPage={perpage} total={Number(invoiceCount)} />
                 */}

                {documents.length ?

                    <EnhancedTable
                        handlePagination={handlePagination}
                        rows={documents}
                        page={page}
                        perPage={perpage}
                        total={Number(invoiceCount)}
                        popUpClosedToParent={popUpClosedToParent}
                        handleSort={handleSortOrderWithState}
                    />
                    :
                    <p>No Records Found</p>
                }

            </div>
        </div>
    );
};

export default DuplicateInvoice;
