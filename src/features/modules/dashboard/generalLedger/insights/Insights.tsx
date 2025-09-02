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
    AccDocument,
    RiskLevel,
    RiskLevelItem,
} from "../../../../../shared/models/records";
import FilterBar from "../../../../../shared/ui/filter-bar/FilterBar";
import TransactionList from "./TransactionList";
import KPICard from "../../../../../shared/ui/cards/KPICards";
import numberSuffixPipe from "../../../../../shared/helpers/numberSuffixPipe";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useAppSelector, useAppDispatch } from "../../../../../hooks";
import { RootState } from "../../../../../store/Store";
import {
    updateSelectedRules,
    updateSelectedAccounts,
    updateSelectedCompanies,
    updateSelectedSelectedTransactionType,
    updateSelectedToggle,
    updateSelectedRisk,
    updateStartDate,
    updateEndDate,
    updateRules,
    clearFilters,
} from "../../../gl-slice/GLSlice";
import { getPath } from "../../../../../shared/helpers/getPath";
import ComposedBarChart from "../../../../ui/Charts/ComposedBarChart";
const GET_FILTERS_URL = "v1/je/get_filters";
const GET_DOCUMENTS_URL = "v1/je";
const GET_ACCOUNT_GROUPS_URL = "v1/config/getaccountgroupsall";
const GET_RISK_STATUS_URL = "v1/je/riskstatus";
const GET_TRANSACTION_STATUS_URL = "v1/je/transstatus";
const GET_TOP_CONTROL_URL = "v1/je/topcontrolsbreach";

const SORT_CONSTANTS = [
    { text: "BLENDED_RISK_SCORE", value: 1 },
    { text: "ACCOUNTDOCID", value: 2 },
    { text: "POSTED_DATE", value: 3 },
    { text: "DEBIT_AMOUNT", value: 4 },
    { text: "CREDIT_AMOUNT", value: 5 },
    { text: "COMPANY_CODE_NAME", value: 6 },
];

const statusDropDownConfig: ReviewStatus = {
    label: "Review Status",
    data: [{ text: "", value: 1 }],
    selected: 1,
};

const SortByDropDownConfig = {
    label: "Sort By",
    data: [
        { text: "Risk Score", value: 1 },
        { text: "Account Doc ID", value: 2 },
        { text: "Posted Date", value: 3 },
        { text: "Debit Amount", value: 4 },
        { text: "Credit Amount", value: 5 },
        { text: "Company Code Name", value: 6 },
    ],
    selected: 1,
};

export interface Props {
    handleNavigateToTransDetails(
        transId: number,
        document: AccDocument,
        riskLevel: RiskLevel
    ): void;
    highlightActiveTab(tabIndex: number): void;
}
interface filters {
    posted_date: any,
    process_status: any,
    company_code?: any,
    rules?: any,
    toggle?: any,
    hml?: any,
    documenttype?: any,
    vendor?: any,
    audit_id?: any,
}
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
    selectedToggle: any,
    accounts: any,
) => {
    let config = [
        {
            label: "Company",
            data: companies,
            filterName: "companies",
            filterType: "multi-dropdown",
            selected: selectedCompanies,
            active: true,
        },
        {
            label: "Controls",
            data: rules,
            filterName: "rules",
            filterType: "multi-dropdown",
            selected: selectedRules,
            active: true,
        },
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
            label: "Analysis Data Set",
            data: [
                { text: "Above Materiality", value: 1 },
                { text: "Above Threshold", value: 2 },
                { text: "Below Threshold", value: 3 },
            ],
            filterName: "toggle",
            filterType: "single-dropdown",
            selected: selectedToggle,
            active: true,
        },
        {
            label: "Accounts",

            data: [
                {
                    dataSource: accounts,
                    value: "id",
                    text: "title",
                    child: "subitems",
                },
            ],
            filterName: "accounts",
            filterType: "dropdown-tree",
            selected: selectedAccounts,
            active: true,
        },
        {
            label: "Risk Level",
            data: [
                { text: "High", value: "1" },
                { text: "Medium", value: "2" },
                { text: "Low", value: "3" },
            ],
            filterName: "risk",
            filterType: "multi-dropdown",
            selected: selectedRisk,
            active: true,
        },
        {
            label: "Transaction Type",
            data: [
                {
                    text: "Asset posting",
                    value: 27,
                },
                {
                    text: "Accounting document",
                    value: 28,
                },
                {
                    text: "Customer document",
                    value: 29,
                },
                {
                    text: "Customer credit memo",
                    value: 30,
                },
                {
                    text: "Customer invoice",
                    value: 31,
                },
                {
                    text: "Customer payment",
                    value: 32,
                },
                {
                    text: "Vendor document",
                    value: 33,
                },
                {
                    text: "Vendor credit memo",
                    value: 34,
                },
                {
                    text: "Vendor invoice",
                    value: 35,
                },
                {
                    text: "Vendor payment",
                    value: 36,
                },
                {
                    text: "Invoice - gross",
                    value: 37,
                },
                {
                    text: "G/L account document",
                    value: 38,
                },
            ],
            filterName: "transaction-type",
            filterType: "multi-dropdown",
            selected: selectedTransactionType,
            active: true,
        },
    ];
    //console.log(config,"config")
    return config;
};


const InsightsHome = ({ handleNavigateToTransDetails, highlightActiveTab }: Props) => {
    const navigate = useNavigate();
    let companies = useAppSelector((state) => state.GLDataSlice.companies);
    let accounts = useAppSelector((state) => state.GLDataSlice.accounts);


    let rules = useAppSelector((state) => state.GLDataSlice.rules);
    let selectedRules = useAppSelector(
        (state) => state.GLDataSlice.rule_selected
    );
    let selectedRisk = useAppSelector(
        (state) => state.GLDataSlice.risk_selected
    );
    let selectedCompanies = useAppSelector(
        (state) => state.GLDataSlice.company_selected
    );
    let postedStartDate = useAppSelector(
        (state) => state.GLDataSlice.posted_date_start_selected
    );
    let postedEndDate = useAppSelector(
        (state) => state.GLDataSlice.posted_date_end_selected
    );
    let selectedAccounts = useAppSelector(
        (state) => state.GLDataSlice.account_selected
    );
    let selectedTransactionType = useAppSelector(
        (state) => state.GLDataSlice.transaction_type_selected
    );

    let selectedToggle = useAppSelector(
        (state) => state.GLDataSlice.toggle_selected
    );


    let riskLevels = useAppSelector((state) => state.GLDataSlice.risk_level);

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
            selectedToggle,
            accounts
        )
    );
    const [reviewStatusConfig, setReviewStatusConfig] =
        useState(statusDropDownConfig);
    const [sortByConfig, setSortByConfig] = useState(SortByDropDownConfig);
    const [sortOrder, setSortOrder] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [documents, setDocuments] = useState<AccDocument[]>([]);
    const [isDocumentsLoading, setIsDocumentLoading] = useState(false);
    const [riskLevel, setRiskLevel] = useState<RiskLevel>(
        riskLevels);

    const [page, setPage] = useState(0);
    const [perpage, setPerpage] = useState(5);
    const Axios = axios;
    const [debitCount, setDebitCount] = useState("0");
    const [creditCount, setCreditCount] = useState("0");
    const [debitAmount, setDebitAmount] = useState("0");
    const [creditAmount, setCreditAmount] = useState("0");
    const [highDocCount, setHighDocCount] = useState("0");
    const [mediumDocCount, setMediumDocCount] = useState("0");
    const [lowDocCount, setLowDocCount] = useState("0");
    const [highAmount, setHighAmount] = useState("0");
    const [mediumAmount, setMediumAmount] = useState("0");
    const [lowAmount, setLowAmount] = useState("0");
    const [highPercentage, setHighPercentage] = useState("0");
    const [mediumPercentage, setMediumPercentage] = useState("0");
    const [lowPercentage, setLowPercentage] = useState("0");
    const [topControlBreach, setTopControlBreach] = useState([]);
    const dispatch = useAppDispatch();


    const handleClearFilters = () => {
        dispatch(clearFilters());
        setFilterConfig(
            setInitData(
                companies,
                rules,
                [],
                [],
                [],
                null,
                null,
                [],
                [],
                [],
                accounts,
            ),
        );
    };

    const handleState = (items: any, filterName: string) => {
        let itemArray = [...filterConfig];
        let index = itemArray.findIndex((item) => {
            return item.filterName === filterName;
        });
        itemArray[index].selected = items;
        if (filterName === "posted-date") {
            dispatch(updateStartDate(items.posted_date_start));
            dispatch(updateEndDate(items.posted_date_end));
        }
        if (filterName === "rules") {
            dispatch(updateSelectedRules(items));
        }
        if (filterName === "companies") {
            dispatch(updateSelectedCompanies(items));
        }
        if (filterName === "risk") {
            dispatch(updateSelectedRisk(items));
        }
        if (filterName === "toggle") {
            dispatch(updateSelectedToggle(items));
        }
        if (filterName === "accounts") {
            dispatch(updateSelectedAccounts(items));
        }
        if (filterName === "transaction-type") {
            dispatch(updateSelectedSelectedTransactionType(items));
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
        getRiskStatus(items);
        getTransStatus(items);
        getTopControls(items);
    };

    const getDocuments = async (
        itemArray: Config[],
        reviewStatusArray: ReviewStatus,
        sortBy: number,
        sortOrder: boolean,
        page: number,
        perpage: number
    ) => {
        setIsDocumentLoading(true);
        let filters: filters = {
            posted_date: {
                posted_date_start: filterConfig[2].selected?.posted_date_start,
                posted_date_end: filterConfig[2].selected?.posted_date_end,
            },
            process_status: [1, 2],
            audit_id: getPath.getPathValue('audit_id')
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "companies")].selected?.length > 0) {
            filters.company_code = filterConfig?.find((filter: any) => {
                if (filter.filterName === "companies") {
                    return filter;
                }
            })!.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "rules")].selected?.length > 0) {
            filters.rules = filterConfig?.find((filter: any) => {
                if (filter.filterName === "rules") {
                    return filter;
                }
            })!.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "toggle")].selected != "") {
            filters.toggle = filterConfig?.find((filter: any) => {
                if (filter.filterName === "toggle") {
                    return filter;
                }
            })!.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "risk")].selected?.length > 0) {
            filters.hml = filterConfig?.find((filter: any) => {
                if (filter.filterName === "risk") {
                    return filter;
                }
            })!?.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "transaction-type")].selected?.length > 0) {
            filters.documenttype = filterConfig?.find((filter: any) => {
                if (filter.filterName === "transaction-type") {
                    return filter;
                }
            })!?.selected;
        };

        try {
            // setIsLoading(true)
            let formData = new FormData();
            formData.append("filters", JSON.stringify(filters));
            formData.append("page", (page + 1).toString());
            formData.append("perpage", perpage.toString());
            formData.append(
                "sortkey",
                SORT_CONSTANTS.find((element) => element.value === sortBy)!.text
            );
            formData.append("sortorder", sortOrder ? "desc" : "asc");
            formData.append("is_toprisk", "0");
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
            // setTimeout(() => {
            //     setIsLoading(false)
            // }, 4000)
            if (getDocumentsResponse.data.data.records.length) {
                // console.log(
                //     "get documents je",
                //     getDocumentsResponse.data.data.records
                // );
                // var date = new Date(Number(getDocumentsResponse.data.data.records[0].POSTED_DATE.$date.$numberLong)).toUTCString();
                // console.log("je document posted date",date);

                let Obj: AccDocument[] = [];
                getDocumentsResponse.data.data.records.forEach(
                    (record: AccDocument) => {
                        record.riskScore =
                            record.BLENDED_RISK_SCORE >= 0
                                ? record.BLENDED_RISK_SCORE
                                : record.BLENDED_SCORE_INDEXED;

                        if (record.riskScore >= 0) {
                            record.riskScore &&= Math.trunc(
                                record.riskScore * 100
                            );
                        }
                        Obj.push(record);
                    }
                );
                setDocuments(Obj);
                setIsDocumentLoading(false);
            } else {
                setDocuments([]);
                setIsDocumentLoading(false);
            }
        } catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    };

    const getRiskStatus = async (itemArray: Config[]) => {
        let filters: filters = {
            posted_date: {
                posted_date_start: filterConfig[2].selected?.posted_date_start,
                posted_date_end: filterConfig[2].selected?.posted_date_end,
            },
            process_status: [1, 2],
            audit_id: getPath.getPathValue('audit_id')
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "companies")].selected?.length > 0) {
            filters.company_code = filterConfig?.find((filter: any) => {
                if (filter.filterName === "companies") {
                    return filter;
                }
            })!.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "rules")].selected?.length > 0) {
            filters.rules = filterConfig?.find((filter: any) => {
                if (filter.filterName === "rules") {
                    return filter;
                }
            })!.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "toggle")].selected != "") {
            filters.toggle = filterConfig?.find((filter: any) => {
                if (filter.filterName === "toggle") {
                    return filter;
                }
            })!.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "risk")].selected?.length > 0) {
            filters.hml = filterConfig?.find((filter: any) => {
                if (filter.filterName === "risk") {
                    return filter;
                }
            })!?.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "transaction-type")].selected?.length > 0) {
            filters.documenttype = filterConfig?.find((filter: any) => {
                if (filter.filterName === "transaction-type") {
                    return filter;
                }
            })!?.selected;
        };
        // if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "apvendors")].selected.length > 0) {
        //     filters.vendor = filterConfig?.find((filter: any) => {
        //         if (filter.filterName === "apvendors") {
        //             return filter;
        //         }
        //     })!?.selected;
        // };


        try {
            setIsLoading(true)
            let formData = new FormData();
            formData.append("filters", JSON.stringify(filters));
            const getRiskStatusResponse = await Axios.post(
                GET_RISK_STATUS_URL,
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
            }, 4000)
            const totalAmount =
                Number(getRiskStatusResponse.data.data.high[0].totalcredit) +
                Number(getRiskStatusResponse.data.data.medium[0].totalcredit) +
                Number(getRiskStatusResponse.data.data.low[0].totalcredit);
            if (getRiskStatusResponse.data.data.high.length) {
                setHighAmount(
                    String(
                        numberSuffixPipe(
                            getRiskStatusResponse.data.data.high[0].totalcredit, 1
                        )
                    )
                );
                setHighDocCount(
                    String(
                        numberSuffixPipe(
                            getRiskStatusResponse.data.data.high[0].doccount
                        )
                    )
                );
                setHighPercentage(
                    String(
                        (
                            (getRiskStatusResponse.data.data.high[0]
                                .totalcredit /
                                totalAmount) *
                            100
                        ).toFixed(0)
                    )
                );
            }
            if (getRiskStatusResponse.data.data.medium.length) {
                setMediumAmount(
                    String(
                        numberSuffixPipe(
                            getRiskStatusResponse.data.data.medium[0]
                                .totalcredit, 1
                        )
                    )
                );
                setMediumDocCount(
                    String(
                        numberSuffixPipe(
                            getRiskStatusResponse.data.data.medium[0].doccount
                        )
                    )
                );
                setMediumPercentage(
                    String(
                        (
                            (getRiskStatusResponse.data.data.medium[0]
                                .totalcredit /
                                totalAmount) *
                            100
                        ).toFixed(0)
                    )
                );
            }
            if (getRiskStatusResponse.data.data.low.length) {
                setLowAmount(
                    String(
                        numberSuffixPipe(
                            getRiskStatusResponse.data.data.low[0].totalcredit, 1
                        )
                    )
                );
                setLowDocCount(
                    String(
                        numberSuffixPipe(
                            getRiskStatusResponse.data.data.low[0].doccount
                        )
                    )
                );
                setLowPercentage(
                    String(
                        (
                            (getRiskStatusResponse.data.data.low[0]
                                .totalcredit /
                                totalAmount) *
                            100
                        ).toFixed(0)
                    )
                );
            }
        } catch { }
    };

    const getTransStatus = async (itemArray: Config[]) => {
        let filters: filters = {
            posted_date: {
                posted_date_start: filterConfig[2].selected?.posted_date_start,
                posted_date_end: filterConfig[2].selected?.posted_date_end,
            },
            process_status: [1, 2],
            audit_id: getPath.getPathValue('audit_id')
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "companies")].selected?.length > 0) {
            filters.company_code = filterConfig?.find((filter: any) => {
                if (filter.filterName === "companies") {
                    return filter;
                }
            })!.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "rules")].selected?.length > 0) {
            filters.rules = filterConfig?.find((filter: any) => {
                if (filter.filterName === "rules") {
                    return filter;
                }
            })!.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "toggle")].selected != "") {
            filters.toggle = filterConfig?.find((filter: any) => {
                if (filter.filterName === "toggle") {
                    return filter;
                }
            })!.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "risk")].selected?.length > 0) {
            filters.hml = filterConfig?.find((filter: any) => {
                if (filter.filterName === "risk") {
                    return filter;
                }
            })!?.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "transaction-type")].selected?.length > 0) {
            filters.documenttype = filterConfig?.find((filter: any) => {
                if (filter.filterName === "transaction-type") {
                    return filter;
                }
            })!?.selected;
        };

        try {
            setIsLoading(true)
            let formData = new FormData();
            formData.append("filters", JSON.stringify(filters));
            const getTransStatusResponse = await Axios.post(
                GET_TRANSACTION_STATUS_URL,
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
            }, 4000)
            if (getTransStatusResponse.data.data.length) {
                getTransStatusResponse.data.data.forEach((record: any) => {
                    setCreditAmount(
                        String(numberSuffixPipe(record.creditamount))
                    );
                    setDebitAmount(
                        String(numberSuffixPipe(record.debitamount))
                    );
                    setCreditCount(
                        String(numberSuffixPipe(record.creditdoccount))
                    );
                    setDebitCount(
                        String(numberSuffixPipe(record.debitdoccount))
                    );
                });
            }
        } catch { }
    };

    const getTopControls = async (itemArray: Config[]) => {
        let filters: filters = {
            posted_date: {
                posted_date_start: filterConfig[2].selected?.posted_date_start,
                posted_date_end: filterConfig[2].selected?.posted_date_end,
            },
            process_status: [1, 2],
            audit_id: getPath.getPathValue('audit_id')
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "companies")].selected?.length > 0) {
            filters.company_code = filterConfig?.find((filter: any) => {
                if (filter.filterName === "companies") {
                    return filter;
                }
            })!.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "rules")].selected?.length > 0) {
            filters.rules = filterConfig?.find((filter: any) => {
                if (filter.filterName === "rules") {
                    return filter;
                }
            })!.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "toggle")].selected != "") {
            filters.toggle = filterConfig?.find((filter: any) => {
                if (filter.filterName === "toggle") {
                    return filter;
                }
            })!.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "risk")].selected?.length > 0) {
            filters.hml = filterConfig?.find((filter: any) => {
                if (filter.filterName === "risk") {
                    return filter;
                }
            })!?.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "transaction-type")].selected?.length > 0) {
            filters.documenttype = filterConfig?.find((filter: any) => {
                if (filter.filterName === "transaction-type") {
                    return filter;
                }
            })!?.selected;
        };


        try {
            setIsLoading(true)
            let formData = new FormData();
            formData.append("filters", JSON.stringify(filters));
            const getTopControlsResponse = await Axios.post(
                GET_TOP_CONTROL_URL,
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
            }, 4000)
            if (getTopControlsResponse.data.data.length) {
                setTopControlBreach(getTopControlsResponse.data.data);
            }
        } catch { }
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

    //for add/remove filter menu
    const [anchorFilter, setAnchorFilter] = useState<null | HTMLElement>(null);
    const openAddRemoveFilter = Boolean(anchorFilter);
    const handleAddRemoveFilterClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setAnchorFilter(event.currentTarget);
    };
    const handleAddRemoveFilterClose = () => {
        setAnchorFilter(null);
    };

    const handleAddRemoveSelection = (filter: any, action: boolean) => {
        handleAddOrRemoveFilters(filter.filterName, action);
        handleAddRemoveFilterClose();
    };

    const handleDrillthrough = () => {
        navigate("/home/gl/transactions");
    };
    const onDoubleClick = (event: any) => {
        let rulesString = JSON.stringify(rules);
        let rulesParsed = JSON.parse(rulesString);
        let item = rulesParsed.find(
          (element: any) => element.text === event.ruletitle,
        );
        dispatch(updateSelectedRules([item.value]));
        navigate("/home/gl/clients/audits/audit/transactions");
      };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const generateFilterConfig = (accountsData: any) => {
            // let response = data;
            // let keys = Object.keys(response);
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
                    selectedToggle,
                    accounts
                ),
            ];
            // keys.forEach((key: any) => {
            //     config.forEach((filter, index) => {
            //         if (filter.filterName === key) {
            //             let Obj: any[] = [];
            //             switch (key) {
            //                 case "companies":
            //                     response[key].forEach((companyItem: any) => {
            //                         companyItem.text = companyItem.COMPANY_CODE;
            //                         companyItem.value = companyItem.COMPANYID;
            //                         delete companyItem.COMPANY_CODE;
            //                         delete companyItem.COMPANYID;
            //                         Obj.push(companyItem);
            //                     });
            //                     configCopy[index].data = [...Obj];
            //                     break;
            //                 case "rules":
            //                     response[key].forEach((rulesItem: any) => {
            //                         rulesItem.value = rulesItem.CONTROL_KEY;
            //                         rulesItem.text = rulesItem?.CONTROL_NAME;
            //                         delete rulesItem.CONTROL_KEY;
            //                         delete rulesItem.CONTROL_NAME;
            //                         Obj.push(rulesItem);
            //                     });
            //                     configCopy[index].data = [...Obj];
            //                     break;
            //                 default:
            //                     break;
            //             }
            //         }
            //     });
            // });

            // set accounts filter data
            // let accountsObj = {
            //     label: "Accounts",
            //     data: [
            //         {
            //             dataSource: [{}],
            //             value: "title",
            //             text: "title",
            //             child: "subitems",
            //         },
            //     ],
            //     filterName: "accounts",
            //     filterType: "dropdown-tree",
            //     selected: undefined,
            // };

            // let generatedAccountsObj: any[] = [];
            // accountsData.forEach((element: any) => {
            //     generatedAccountsObj.push(element);
            //     // accountsObj.data[0].dataSource.push(element);
            // });

            // if (generatedAccountsObj.length) {
            //     accountsObj.data[0].dataSource = [...generatedAccountsObj];
            // }

            // configCopy[4].data = { ...accountsObj.data };

            setFilterConfig([...configCopy]);
            getDocuments(
                configCopy,
                reviewStatusConfig,
                sortByConfig.selected,
                sortOrder,
                page,
                perpage
            );
            getRiskStatus(configCopy);
            getTransStatus(configCopy);
            getTopControls(configCopy);
        };

        const getFilters = async (accountsData: any) => {
            setIsLoading(true)
            try {
                // let getFilterArray: string[] = [];
                // config.forEach((item) => {
                //     if (item.filterName) {
                //         getFilterArray.push(item.filterName);
                //     }
                // });
                // let formData = new FormData();
                // formData.append("filtertype", getFilterArray.join(","));
                // setIsLoading(true);
                // const response = await Axios.post(GET_FILTERS_URL, formData, {
                //     headers: {
                //         Authorization: localStorage.getItem(
                //             "TR_Token"
                //         ) as string,
                //     },
                // });
                // isMounted &&
                generateFilterConfig(accounts);
                setTimeout(() => {
                    setIsLoading(false);
                }, 4000)
                // if(response.data.data){
                //     console.log("getfilters data:",response.data.data);
                // }
            } catch (err) {
                console.error(err);
            }
        };

        const getAccountGroupsAll = async () => {
            try {
                // const response = await Axios.get(GET_ACCOUNT_GROUPS_URL, {
                //     headers: {
                //         Authorization: localStorage.getItem(
                //             "TR_Token"
                //         ) as string,
                //     },
                // });
                // const accountsData = response.data.data;
                // if (response.data.data.length) {
                //     let generatedAccountsObj: any[] = [];
                //     accountsData.forEach((element: any) => {
                //         generatedAccountsObj.push(element);
                //         // accountsObj.data[0].dataSource.push(element);
                //     });
                //     console.log("accounts data", response.data.data);

                // }
                isMounted && getFilters(accounts);
            } catch (err) {
                console.error(err);
            }
        };

        // const getRiskConfig = async () => {
        //     try {
        //         let formData = new FormData();
        //         formData.append("filtertype", "riskweights");
        //         const response = await Axios.post(GET_FILTERS_URL, formData, {
        //             headers: {
        //                 Authorization: localStorage.getItem(
        //                     "TR_Token"
        //                 ) as string,
        //             },
        //         });
        //         isMounted && getAccountGroupsAll();
        //         if (response.data.data) {
        //             let Obj: RiskLevel = {
        //                 range_high: 0,
        //                 range_low: 0,
        //                 range_medium: 0,
        //             };
        //             response?.data?.data?.riskweights?.forEach(
        //                 (element: RiskLevelItem) => {
        //                     switch (element.KEYNAME) {
        //                         case "range_high":
        //                             Obj.range_high =
        //                                 Number(element.KEYVALUE) * 100;
        //                             break;
        //                         case "range_medium":
        //                             Obj.range_medium =
        //                                 Number(element.KEYVALUE) * 100;
        //                             break;
        //                         case "range_low":
        //                             Obj.range_low =
        //                                 Number(element.KEYVALUE) * 100;
        //                             break;
        //                         default:
        //                             break;
        //                     }
        //                 }
        //             );
        //             setRiskLevel(Obj);
        //         }
        //     } catch (err) {
        //         console.error(err);
        //     }
        // };

        const setDate = () => {
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth();
            const currentDay = new Date().getDate();
            var financialYear = new Date().getFullYear();
            if (currentMonth < 3) {
                financialYear = financialYear - 1;
            }

            let configCopy = [...setInitData(companies, rules, selectedRules, selectedCompanies, selectedRisk, postedStartDate,
                postedEndDate, selectedAccounts, selectedTransactionType, selectedToggle, accounts)];
            configCopy[2].data[0] = {
                posted_date_start: postedStartDate,
                posted_date_end: postedEndDate,
            };
            configCopy[2].selected = {
                posted_date_start: postedStartDate,
                posted_date_end: postedEndDate,
            };
        };

        setDate();
        //getRiskConfig();
        //getWorkFlowStatus();
        getAccountGroupsAll();

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
            {/* <Button onClick={handleDrillthrough}>Test</Button> */}
            <div className="flex w-full flex-row-reverse">
                <span className="my-auto cursor-pointer">
                    <Tooltip title="Clear Filters">
                        <Button
                            className="text-black"
                            onClick={handleClearFilters}
                        // onClick={() => {
                        //     handleAddOrRemoveFilters(
                        //             "apcompanies",
                        //             false
                        //         );
                        //     }}
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
                <div className="flex flex-col mr-2 w-3/5 shadow-lg insights-b">
                    <div className="pl-2 pb-3 font-roboto font-bold">
                        Risk Overview
                    </div>
                    {isLoading
                        ?
                        <div style={{ display: 'flex', justifyContent: 'right', marginRight: '4%' }}>
                            <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                        </div>
                        :
                        ''
                    }
                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
                        <KPICard
                            title="High Risk"
                            percentage={highPercentage}
                            value={highAmount}
                            count={highDocCount}
                            bgColor="#d60000"
                            txtColor="white"
                            glDrillThroughButton={true}
                            module={"gl"}
                            filterConfig={filterConfig}
                            risk={"1"}
                            highlightActiveTab={highlightActiveTab}
                        />

                        <KPICard
                            title="Medium Risk"
                            percentage={mediumPercentage}
                            value={mediumAmount}
                            count={mediumDocCount}
                            bgColor="#f2641a"
                            txtColor="white"
                            glDrillThroughButton={true}
                            module={"gl"}
                            filterConfig={filterConfig}
                            risk={"2"}
                            highlightActiveTab={highlightActiveTab}
                        />
                        <KPICard
                            title="Low Risk"
                            percentage={lowPercentage}
                            value={lowAmount}
                            count={lowDocCount}
                            bgColor="#f5af2d"
                            txtColor="white"
                            glDrillThroughButton={true}
                            module={"gl"}
                            filterConfig={filterConfig}
                            risk={"3"}
                            highlightActiveTab={highlightActiveTab}
                        />
                    </div>
                </div>
                <div className="flex flex-col ml-2 w-2/5 shadow-lg insights-b">
                    <div className="pl-2 pb-3 font-roboto font-bold">
                        Balances
                    </div>
                    {isLoading
                        ?
                        <div style={{ display: 'flex', justifyContent: 'right', marginRight: '4%' }}>
                            <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                        </div>
                        :
                        ''
                    }
                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
                        <KPICard
                            title="Debit Transactions"
                            value={debitAmount}
                            count={debitCount}
                            bgColor="#818181"
                            txtColor="white"
                            highlightActiveTab={highlightActiveTab}
                        />
                        <KPICard
                            title="Credit Transactions"
                            credit={true}
                            value={creditAmount}
                            count={creditCount}
                            bgColor="#818181"
                            txtColor="white"
                            highlightActiveTab={highlightActiveTab}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-row mt-4">
                <div className="flex flex-col h-fit mr-2 w-3/5 shadow-lg insights-b">
                    <div className="pl-2 pb-1 font-roboto font-bold">
                        Top Control Exceptions
                    </div>
                    {isLoading
                        ?
                        <div style={{ display: 'flex', justifyContent: 'right', marginRight: '4%' }}>
                            <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                        </div>
                        :
                        ''
                    }
                    <div className="pl-2 pb-3 font-robot">
                        (click control name to see the transactions)
                    </div>
                    <div className="pb-3 font-roboto font-bold h-fit">
                        <ComposedBarChart

                            topControlData={topControlBreach}
                            doubleClick={onDoubleClick}
                        />
                    </div>
                </div>
                <div className="flex flex-col ml-2 w-2/5 shadow-lg insights-b">
                    <div className="pb-3 font-roboto font-bold">
                        Top Risk Accounting Documents
                    </div>
                    {isLoading
                        ?
                        <div style={{ display: 'flex', justifyContent: 'right', marginRight: '4%' }}>
                            <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                        </div>
                        :
                        ''
                    }
                    <div className="flex flex-row gap-5 w-full">
                        {isDocumentsLoading ? (
                            <Stack
                                spacing={2}
                                className="flex flex-col grow w-full md:w-9/12"
                            >
                                <Skeleton
                                    variant="rounded"
                                    height={180}
                                    className="w-full"
                                />
                                <Skeleton
                                    variant="rounded"
                                    height={180}
                                    className="w-full"
                                />
                                <Skeleton
                                    variant="rounded"
                                    height={180}
                                    className="w-full"
                                />
                            </Stack>
                        ) : documents.length > 0 ? (
                            <TransactionList
                                documents={documents}
                                riskLevel={riskLevel}
                                handleTransDetails={
                                    handleNavigateToTransDetails
                                }
                            />
                        ) : (
                            <div className="font-roboto md:flex md:w-10/12">
                                No records found!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsightsHome;
