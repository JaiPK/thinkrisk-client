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
import { useEffect, useState } from "react";
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
import numberSuffixPipe from "../../../../../shared/helpers/numberSuffixPipe";
import KPICard from "../../../../../shared/ui/cards/KPICards";
import RiskLineChart from "../../../../ui/Charts/RiskLineChart";
import DoughnutChart from "../../../../ui/Charts/DoughnutChart";

import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
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
} from "../../../ap-slice/APSlice";
import { clearFilters } from "../../../ap-slice/APSlice";
import { getPath } from "../../../../../shared/helpers/getPath";

const GET_FILTERS_URL = "v1/ap/get_filters";
const GET_DOCUMENTS_URL = "v1/ap/getdocuments";
const GET_ACCOUNT_GROUPS_URL = "v1/config/getaccountgroupsall";
const GET_RISK_STATUS_URL = "v1/ap/riskstatus";
const GET_CHART_DATA_URL = "v1/ap/chartsdata";

const SORT_CONSTANTS = [
    { text: "BLENDED_RISK_SCORE", value: 1 },
    { text: "POSTED_DATE", value: 2 },
    { text: "DEBIT_AMOUNT", value: 3 },
    { text: "CREDIT_AMOUNT", value: 4 },
    { text: "COMPANY_CODE_NAME", value: 5 },
];



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
    vendors: any,
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
        {
            label: "Controls",
            data: rules,
            filterName: "aprules",
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
                    dataSource: [],
                    value: "title",
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
        {
            label: "Vendors",
            data: vendors,
            filterName: "apvendors",
            filterType: "multi-dropdown",
            selected: selectedVendors,
            active: true,
        },
    ];
    return config;
};

const statusDropDownConfig: ReviewStatus = {
    label: "Review Status",
    data: [{ text: "", value: 1 }],
    selected: 1,
};

const SortByDropDownConfig = {
    label: "Sort By",
    data: [
        { text: "Risk Score", value: 1 },
        { text: "Posted Date", value: 2 },
        { text: "Debit Amount", value: 3 },
        { text: "Credit Amount", value: 4 },
        { text: "Company Code Name", value: 5 },
    ],
    selected: 1,
};

interface filters {
    posted_date: any,
    process_status: any,
    company_code?: any,
    rules?: any,
    toggle?: any,
    hml?: any,
    documenttype?: any,
    vendor?: any,
    audit_id?: any
}

export interface Props {
    handleNavigateToTransDetails(
        transId: number,
        document: AccDocument,
        riskLevel: RiskLevel
    ): void;
    highlightActiveTab(tabIndex: number): void;
}

const InsightsHome = ({ handleNavigateToTransDetails, highlightActiveTab }: Props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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
    //console.log(postedStartDate, "appostedStartDate")
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

    let selectedToggle = useAppSelector(
        (state) => state.APDataSlice.toggle_selected
    );
    let vendors = useAppSelector(
        (state) => state.APDataSlice.vendors
    );

    let riskLevels = useAppSelector((state) => state.APDataSlice.risk_level);

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
            vendors,
        )
    );
    const [reviewStatusConfig, setReviewStatusConfig] =
        useState(statusDropDownConfig);

    const [sortByConfig, setSortByConfig] = useState(SortByDropDownConfig);
    const [sortOrder, setSortOrder] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [documents, setDocuments] = useState<AccDocument[]>([]);
    const [isDocumentsLoading, setIsDocumentLoading] = useState(false);
    const [riskLevel, setRiskLevel] = useState<RiskLevel>(riskLevels);

    const [page, setPage] = useState(0);
    const [perpage, setPerpage] = useState(5);
    const Axios = axios;

    const [highDocCount, setHighDocCount] = useState("0");
    const [mediumDocCount, setMediumDocCount] = useState("0");
    const [lowDocCount, setLowDocCount] = useState("0");
    const [highAmount, setHighAmount] = useState("0");
    const [mediumAmount, setMediumAmount] = useState("0");
    const [lowAmount, setLowAmount] = useState("0");
    const [highPercentage, setHighPercentage] = useState("0");
    const [mediumPercentage, setMediumPercentage] = useState("0");
    const [lowPercentage, setLowPercentage] = useState("0");
    const [topAnomalyCategory, setAnomalyCategory] = useState<any[]>([]);
    const [anomalyTrends, setAnomalyTrends] = useState([]);
    
    const getPathValue = (key: any) => {
        const pathHistory = JSON.parse(localStorage.getItem("pathHistory") ?? "{}");
        return pathHistory?.["audit"]?.[key]
    }

    useEffect(() => {
        const pathHistory = JSON.parse(localStorage.getItem("pathHistory") ?? "{}");
        if (!(pathHistory.hasOwnProperty('audit') && pathHistory.audit.hasOwnProperty("audit_id"))){
            navigate("/home/clients");
        }
    }, [])


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
        getRiskStatus(items);
        getAnomalyCategories(items);
        getAnomalyTrends(items);
    };
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
                [],
                vendors,
            )
        );
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
            audit_id : getPath.getPathValue('audit_id')
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "apcompanies")].selected?.length > 0) {
            filters.company_code = filterConfig?.find((filter: any) => {
                if (filter.filterName === "apcompanies") {
                    return filter;
                }
            })!.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "aprules")].selected?.length > 0) {
            filters.rules = filterConfig?.find((filter: any) => {
                if (filter.filterName === "aprules") {
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
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "apvendors")].selected?.length > 0) {
            filters.vendor = filterConfig?.find((filter: any) => {
                if (filter.filterName === "apvendors") {
                    return filter;
                }
            })!?.selected;
        };
        try {
            setIsLoading(true)
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
            setTimeout(() => {
                setIsLoading(false)
            }, 4000)
            if (getDocumentsResponse.data.data.records.length) {
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


        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "apcompanies")].selected?.length > 0) {
            filters.company_code = filterConfig?.find((filter: any) => {
                if (filter.filterName === "apcompanies") {
                    return filter;
                }
            })!.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "aprules")].selected?.length > 0) {
            filters.rules = filterConfig?.find((filter: any) => {
                if (filter.filterName === "aprules") {
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
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "apvendors")].selected?.length > 0) {
            filters.vendor = filterConfig?.find((filter: any) => {
                if (filter.filterName === "apvendors") {
                    return filter;
                }
            })!?.selected;
        };
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

    const getAnomalyCategories = async (itemArray: Config[]) => {
        setAnomalyCategory([])
        let filters: filters = {
            posted_date: {
                posted_date_start: filterConfig[2].selected?.posted_date_start,
                posted_date_end: filterConfig[2].selected?.posted_date_end,
            },
            process_status: [1, 2],
            audit_id: getPath.getPathValue('audit_id')
        };

        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "apcompanies")].selected?.length > 0) {
            filters.company_code = filterConfig?.find((filter: any) => {
                if (filter.filterName === "apcompanies") {
                    return filter;
                }
            })!.selected;
        }
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "aprules")].selected?.length > 0) {
            filters.rules = filterConfig?.find((filter: any) => {
                if (filter.filterName === "aprules") {
                    return filter;
                }
            })!.selected;
        }
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "toggle")].selected != "") {
            filters.toggle = filterConfig?.find((filter: any) => {
                if (filter.filterName === "toggle") {
                    return filter;
                }
            })!.selected;
        }
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "risk")].selected?.length > 0) {
            filters.hml = filterConfig?.find((filter: any) => {
                if (filter.filterName === "risk") {
                    return filter;
                }
            })!?.selected;
        }
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "transaction-type")].selected?.length > 0) {
            filters.documenttype = filterConfig?.find((filter: any) => {
                if (filter.filterName === "transaction-type") {
                    return filter;
                }
            })!?.selected;
        }
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "apvendors")].selected?.length > 0) {
            filters.vendor = filterConfig?.find((filter: any) => {
                if (filter.filterName === "apvendors") {
                    return filter;
                }
            })!?.selected;
        }
        try {
            setIsLoading(true)
            let formData = new FormData();
            formData.append("filters", JSON.stringify(filters));
            formData.append("charttype", "anomalycategories");
            const getAnomalyCategoriesResponse = await Axios.post(
                GET_CHART_DATA_URL,
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
            if (getAnomalyCategoriesResponse.data.data.length) {
                setAnomalyCategory(getAnomalyCategoriesResponse.data.data);
            }
        } catch { }
    };

    const getAnomalyTrends = async (itemArray: Config[]) => {
        setAnomalyTrends([])

        //let num = itemArray[itemArray.findIndex((item: any) => item.filterName === "apvendors")].selected
        let filters: filters = {
            posted_date: {
                posted_date_start: filterConfig[2].selected?.posted_date_start,
                posted_date_end: filterConfig[2].selected?.posted_date_end,
            },
            process_status: [1, 2],
            audit_id: getPath.getPathValue('audit_id')
        };

        
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "apcompanies")].selected?.length > 0) {
            filters.company_code = filterConfig?.find((filter: any) => {
                if (filter.filterName === "apcompanies") {
                    return filter;
                }
            })!.selected;
        };
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "aprules")].selected?.length > 0) {
            filters.rules = filterConfig?.find((filter: any) => {
                if (filter.filterName === "aprules") {
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
        if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "apvendors")].selected?.length > 0) {
            filters.vendor = filterConfig?.find((filter: any) => {
                if (filter.filterName === "apvendors") {
                    return filter;
                }
            })!?.selected;
        };

        try {
            setIsLoading(true)
            let formData = new FormData();
            formData.append("filters", JSON.stringify(filters));
            formData.append("charttype", "riskanalysis");
            const getAnomalyTrendsResponse = await Axios.post(
                GET_CHART_DATA_URL,
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


            if (getAnomalyTrendsResponse.data.data.length) {
                setAnomalyTrends(getAnomalyTrendsResponse.data.data);
            }
            if (getAnomalyTrendsResponse.data.data.length < 0) {
                setAnomalyTrends([]);
            }
        } catch { }
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


    const onDoubleClick = (event: any) => {
        const data = (topAnomalyCategory[event.name].rule);

        dispatch(
            updateAPSelectedRules([
                data
            ])
        );
        navigate("home/ap/clients/audits/audit/transactions");
    };



    const generateFilterConfig = () => {
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
                selectedVendors,
                selectedToggle,
                vendors,
            ),
        ];
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
        getAnomalyCategories(configCopy);
        getAnomalyTrends(configCopy);
    };

    const getFilters = async () => {
        try {
            generateFilterConfig();
            setIsLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const setDate = () => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const currentDay = new Date().getDate();
        var financialYear = new Date().getFullYear();
        if (currentMonth < 3) {
            financialYear = financialYear - 1;
        }

        let configCopy = [
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
                vendors,
            ),
        ];
        configCopy[2].data[0] = {
            posted_date_start: postedStartDate,
            posted_date_end: postedEndDate,
        };
        configCopy[2].selected = {
            posted_date_start: postedStartDate,
            posted_date_end: postedStartDate,
        };
    };

    useEffect(() => {
        const controller = new AbortController();

            setDate();
            getFilters();

        return () => {
            controller.abort();
        };
    }, []);

    useEffect(() => {
        generateFilterConfig()
    }, [companies])

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
                <div className="flex flex-col mr-2 w-3/5 shadow-lg  h-fit">
                    <div className="insights-b">
                        <div className="pl-3 pb-3 font-roboto font-bold">
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
                                module={"ap"}
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
                                module={"ap"}
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
                                module={"ap"}
                                filterConfig={filterConfig}
                                risk={"3"}
                                highlightActiveTab={highlightActiveTab}
                            />
                        </div>
                    </div>
                    <div className="insights-b mt-5">
                        {isLoading
                            ?
                            <div style={{ display: 'flex', justifyContent: 'right', marginRight: '4%' }}>
                                <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                            </div>
                            :
                            ''
                        }
                        <DoughnutChart
                            topAnomalyCategoryData={topAnomalyCategory}
                            doubleClick={onDoubleClick}
                        />
                    </div>
                    <div className="insights-b mt-5">
                        {isLoading
                            ?
                            <div style={{ display: 'flex', justifyContent: 'right', marginRight: '4%' }}>
                                <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                            </div>
                            :
                            ''
                        }
                        <RiskLineChart topAnomalyTrendData={anomalyTrends} />
                    </div>
                </div>
                <div className="flex flex-col ml-2 w-2/5 shadow-lg insights-b">
                    <div className="pb-3 font-roboto font-bold">
                        Top Risk AP Entries
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
            <div className="flex flex-row mt-4"></div>
        </div>
    );
};

export default InsightsHome;
