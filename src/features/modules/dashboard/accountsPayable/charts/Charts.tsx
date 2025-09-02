
import TreeChart from "../../../../ui/Charts/TreeChart";

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
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../../../../../api/axios";

import { Config, ReviewStatus } from "../../../../../shared/models/filters";
import {
    RiskLevel,
    RiskLevelItem,
} from "../../../../../shared/models/records";
import FilterBar from "../../../../../shared/ui/filter-bar/FilterBar";

import numberSuffixPipe from "../../../../../shared/helpers/numberSuffixPipe";
import { useAppSelector, useAppDispatch } from "../../../../../hooks"

import { RootState } from "../../../../../store/Store";

import {
    updateAPSelectedRules, updateAPSelectedAccounts, updateAPSelectedCompanies,
    updateAPSelectedSelectedTransactionType, updateAPSelectedToggle, updateAPSelectedRisk, updateAPStartDate, updateAPEndDate, updateAPVendors, updateAPSelectedVendors,
    updateAPInvoiceStartDate, updateAPInvoiceEndDate, updateAPRules, updateAPCompanies
} from "../../../ap-slice/APSlice";
import { clearFilters } from "../../../ap-slice/APSlice";
import { getPath } from "../../../../../shared/helpers/getPath";


const GET_FILTERS_URL = "v1/ap/get_filters";
const GET_ACCOUNT_GROUPS_URL = "v1/config/getaccountgroupsall";
const GET_CHART_DATA_URL = "v1/ap/chartsdata";
export interface Props {
    highlightActiveTab(tabIndex: number): void;
}

// setInitData function giving the array of jsons to generate filters bar
const setInitData = (companies: any, rules: any, selectedRules: any, selectedCompanies: any, selectedRisk: any, postedStartDate: any,
    postedEndDate: any, selectedAccounts: any, selectedTransactionType: any, selectedVendors: any, selectedToggle: any, vendors: any,) => {
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
            selected: { posted_date_start: postedStartDate, posted_date_end: postedEndDate },
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
                { text: "High", value: '1' },
                { text: "Medium", value: '2' },
                { text: "Low", value: '3' },
            ],
            filterName: "risk",
            filterType: "multi-dropdown",
            selected: selectedRisk,
            active: true,
        },
        {
            label: "Transaction Type",
            data: [
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

interface filters {
    posted_date: any,
    process_status?: any,
    company_code?: any,
    rules?: any,
    toggle?: any,
    hml?: any,
    documenttype?: any,
    vendor?: any,
    audit_id?: number,
}

const Charts = ({ highlightActiveTab }: Props) => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Getting data's from the global state.
    let companies = useAppSelector(
        (state) => state.APDataSlice.companies
    );
    let rules = useAppSelector(
        (state) => state.APDataSlice.rules
    );
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
    let accounts = useAppSelector(
        (state) => state.APDataSlice.accounts
    );
    // Clear the filters and reload the page
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
                vendors
            )
        )
    };

    const [filterConfig, setFilterConfig] = useState<Config[]>(setInitData(companies, rules, selectedRules, selectedCompanies, selectedRisk, postedStartDate,
        postedEndDate, selectedAccounts, selectedTransactionType, selectedVendors, selectedToggle, vendors));
    const [isLoading, setIsLoading] = useState(false);
    const [riskLevel, setRiskLevel] = useState<RiskLevel>({
        range_high: 0,
        range_medium: 0,
        range_low: 0,
    });

    const Axios = axios;

    const [topVendors, setTopVendors] = useState([]);

    // Based on the filterName dispatch the actions for update the filter values
    const handleState = (items: any, filterName: string) => {
        let itemArray = [...filterConfig];//Getting copy of the filterconfig it's giving the array of jsons
        let index = itemArray.findIndex(item => {
            return item.filterName === filterName;
        });
        itemArray[index].selected = items;
        if (filterName === "posted-date") {
            dispatch(updateAPStartDate(items.posted_date_start));
            dispatch(updateAPEndDate(items.posted_date_end));
        }
        if (filterName === "aprules") {
            dispatch(updateAPSelectedRules(items));
        };
        if (filterName === "apcompanies") {
            dispatch(updateAPSelectedCompanies(items));
        };
        if (filterName === "risk") {
            dispatch(updateAPSelectedRisk(items));
        };
        if (filterName === "toggle") {
            dispatch(updateAPSelectedToggle(items));
        };
        if (filterName === "accounts") {
            dispatch(updateAPSelectedAccounts(items));
        };
        if (filterName === "transaction-type") {
            dispatch(updateAPSelectedSelectedTransactionType(items));
        };
        if (filterName === "apvendors") {
            dispatch(updateAPSelectedVendors(items));
        };
        setFilterConfig(itemArray);//Update the filterConfig state with updated data
        getTopVendors(items)
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

    // Getting active true or false filters,action and passing those values to handleAddOrRemoveFilters function.
    const handleAddRemoveSelection = (filter: any, action: boolean) => {
        handleAddOrRemoveFilters(filter.filterName, action);
        handleAddRemoveFilterClose();
    };
    // Based on actions add or remove the filters
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


    const getTopVendors = async (
        itemArray: Config[],

    ) => {
        const audit_id = getPath.getPathValue("audit_id");
        let filters: filters = {
            posted_date: {
                posted_date_start: filterConfig[2].selected?.posted_date_start,
                posted_date_end: filterConfig[2].selected?.posted_date_end,
            },
            audit_id: audit_id,
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
        // let filters = {
        //     posted_date: {
        //         posted_date_start: filterConfig[2].selected?.posted_date_start,
        //         posted_date_end: filterConfig[2].selected?.posted_date_end,
        //     },
        //     company_code: filterConfig?.find((filter: any) => {
        //         if (filter.filterName === "apcompanies") {
        //             return filter;
        //         }
        //     })!.selected,
        //     rules: filterConfig?.find((filter: any) => {
        //         if (filter.filterName === "aprules") {
        //             return filter;
        //         }
        //     })!.selected,
        //     toggle: filterConfig?.find((filter: any) => {
        //         if (filter.filterName === "toggle") {
        //             return filter;
        //         }
        //     })!.selected,
        //     hml: filterConfig?.find((filter: any) => {
        //         if (filter.filterName === "risk") {
        //             return filter;
        //         }
        //     })!?.selected,
        //     documenttype: filterConfig?.find((filter: any) => {
        //         if (filter.filterName === "transaction-type") {
        //             return filter;
        //         }
        //     })!?.selected,
        //     vendor: filterConfig?.find((filter: any) => {
        //         if (filter.filterName === "apvendor") {
        //             return filter;
        //         }
        //     })!?.selected,
        // };
        try {
            setIsLoading(true)
            let formData = new FormData();
            formData.append("filters", JSON.stringify(filters));
            formData.append("charttype", "toptwentyfivevendor");
            const getTopVendorsResponse = await Axios.post(
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
            }, 3000)
            if (getTopVendorsResponse.data.data.length) {
                setTopVendors(getTopVendorsResponse.data.data);
            }
        } catch (error: any) {
            if (error?.response?.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    };
    const onDoubleClick = (event: any) => {
        const data = event.VENDORID;
    
        dispatch(updateAPSelectedVendors([data]));
    
        highlightActiveTab(2);
        navigate("home/ap/clients/audits/audit/transactions");
      };


    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const generateFilterConfig = (data: any) => {
            let response = data;
            let keys = Object.keys(response);
            let configCopy: Config[] = [...setInitData(companies, rules, selectedRules, selectedCompanies, selectedRisk, postedStartDate,
                postedEndDate, selectedAccounts, selectedTransactionType, selectedVendors, selectedToggle, vendors)];
            keys.forEach((key: any) => {
                setInitData(companies, rules, selectedRules, selectedCompanies, selectedRisk, postedStartDate,
                    postedEndDate, selectedAccounts, selectedTransactionType, selectedVendors, selectedToggle, vendors).forEach((filter, index) => {
                        if (filter.filterName === key) {
                            let Obj: any[] = [];
                            switch (key) {
                                case "apcompanies":
                                    response[key].forEach((companyItem: any) => {
                                        Obj.push(companyItem);
                                    });
                                    configCopy[index].data = [...Obj];
                                    break;
                                case "aprules":
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
            getTopVendors(configCopy);
        };

        const getFilters = async () => {
            try {
                setIsLoading(true);
                let getFilterArray: string[] = [];
                setInitData(companies, rules, selectedRules, selectedCompanies, selectedRisk, postedStartDate,
                    postedEndDate, selectedAccounts, selectedTransactionType, selectedVendors, selectedToggle, vendors).forEach((item) => {
                        if (item.filterName) {
                            getFilterArray.push(item.filterName);
                        }
                    });
                let formData = new FormData();
                formData.append("filtertype", getFilterArray.join(","));
                const pathHistory = JSON.parse(localStorage.getItem("pathHistory") ?? "{}");
                if (pathHistory) {
                    formData.append("audit_id", pathHistory["audit"]["audit_id"]);
                    formData.append("client_id", pathHistory["audits"]["client_id"]);
                }
                const response = await Axios.post(GET_FILTERS_URL, formData, {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                });
                setTimeout(() => {
                    setIsLoading(false)
                }, 4000)
                isMounted && generateFilterConfig(response.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        const getAccountGroupsAll = async () => {
            setIsLoading(true)
            try {
                const response = await Axios.get(GET_ACCOUNT_GROUPS_URL, {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                });
                setTimeout(() => {
                    setIsLoading(false)
                }, 4000)
                isMounted && getFilters();
            } catch (err) {
                console.error(err);
            }
        };

        const getRiskConfig = async () => {
            try {
                setIsLoading(true)
                let formData = new FormData();
                formData.append("filtertype", "riskweights");
                const pathHistory = JSON.parse(localStorage.getItem("pathHistory") ?? "{}");
                if (pathHistory) {
                    formData.append("audit_id", pathHistory["audit"]["audit_id"]);
                    formData.append("client_id", pathHistory["audits"]["client_id"]);
                }
                const response = await Axios.post(GET_FILTERS_URL, formData, {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                });
                setTimeout(() => {
                    setIsLoading(false)
                }, 4000)
                isMounted && getAccountGroupsAll();
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
        };

        const setDate = () => {
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth();
            const currentDay = new Date().getDate();
            var financialYear = new Date().getFullYear();
            if (currentMonth < 3) {
                financialYear = financialYear - 1;
            }

            let configCopy = [...setInitData(companies, rules, selectedRules, selectedCompanies, selectedRisk, postedStartDate,
                postedEndDate, selectedAccounts, selectedTransactionType, selectedVendors, selectedToggle, vendors)];
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
        getRiskConfig()

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
            <div className="flex flex-col  shadow-lg insights-b">
                <div className="text-lg p-2 font-raleway font-extrabold">Top Risky Vendors</div>
                {isLoading
                    ?
                    <div style={{ display: 'flex', justifyContent: 'right', marginRight: '4%' }}>
                        <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                    </div>
                    :
                    ''
                }
                <TreeChart data={topVendors} doubleClick={onDoubleClick} />
            </div>

        </div>


    );
};

export default Charts;
