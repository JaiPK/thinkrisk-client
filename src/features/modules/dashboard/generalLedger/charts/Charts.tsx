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
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../../../../../api/axios";

import { Config, ReviewStatus } from "../../../../../shared/models/filters";
import {
    AccDocument,
    ControlException,
    RiskLevel,
    RiskLevelItem,
} from "../../../../../shared/models/records";
import FilterBar from "../../../../../shared/ui/filter-bar/FilterBar";
import numberSuffixPipe from "../../../../../shared/helpers/numberSuffixPipe";


import { useAppSelector, useAppDispatch } from "../../../../../hooks";

import {
    updateSelectedRules, updateSelectedAccounts, updateSelectedCompanies,
    updateSelectedSelectedTransactionType, updateSelectedToggle, updateSelectedRisk, updateStartDate, updateEndDate, clearFilters
} from "../../../gl-slice/GLSlice";

import ControlExceptions from "../../../../../shared/ui/control-exceptions/ControlExceptions";
import { getPath } from "../../../../../shared/helpers/getPath";
import StackedBarChart from "../../../../ui/Charts/StackedBarChart";


// Defining api's call URL
const GET_REVIEW_STATUS_CODE_URL = "v1/je/workflowstatus";
const GET_FILTERS_URL = "v1/je/get_filters";
const GET_CONTROLS_COUNT_URL = "v1/je/trendc";
const GET_CONTROL_EXCEPTIONS_URL = "v1/je/compliancecntrl";
const GET_ACCOUNT_GROUPS_URL = "v1/config/getaccountgroupsall";


const statusDropDownConfig: ReviewStatus = {
    label: "Review Status",
    data: [{ text: "", value: 1 }],
    selected: 1,
};

export interface Props {
    highlightActiveTab(tabIndex: number): void;
}
interface filters {
    posted_date: any,//Required
    process_status: any,//Required
    company_code?: any,//Optional
    rules?: any,//Optional
    toggle?: any,//Optional
    hml?: any,//Optional
    documenttype?: any,//Optional
    vendor?: any,//Optional
    audit_id?: any,//Optional
}

// setInitData function giving the array of jsons to generate filters bar
const setInitData = (companies: any, rules: any, selectedRules: any, selectedCompanies: any, selectedRisk: any, postedStartDate: any,
    postedEndDate: any, selectedAccounts: any, selectedTransactionType: any, selectedToggle: any, accounts: any) => {
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
                    dataSource: accounts,
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
    ];
    return config;
};

const Charts = ({ highlightActiveTab }: Props) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Getting data's from the global state.
    let companies = useAppSelector(
        (state) => state.GLDataSlice.companies
    );

    //console.log("companies:", companies);

    let rules = useAppSelector(
        (state) => state.GLDataSlice.rules
    );
    let selectedRules = useAppSelector(
        (state) => state.GLDataSlice.rule_selected
    );
    let selectedRisk = useAppSelector(
        (state) => state.GLDataSlice.risk_selected
    );
    let selectedCompanies = useAppSelector(
        (state) => state.GLDataSlice.company_selected
    );
    //console.log("selectedCompanies:", selectedCompanies);
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
    let accounts = useAppSelector(
        (state) => state.GLDataSlice.accounts
    );
    let riskLevels = useAppSelector((state) => state.GLDataSlice.risk_level);


    const [filterConfig, setFilterConfig] = useState<Config[]>(setInitData(companies, rules, selectedRules, selectedCompanies, selectedRisk, postedStartDate, postedEndDate, selectedAccounts, selectedTransactionType, selectedToggle, accounts));
    const [reviewStatusConfig, setReviewStatusConfig] = useState(statusDropDownConfig);
    const [isLoading, setIsLoading] = useState(false);
    const [isReviewStatusLoading, setIsReviewStatusLoading] = useState(false);
    const [documents, setDocuments] = useState<AccDocument[]>([]);
    const [isDocumentsLoading, setIsDocumentLoading] = useState(false);
    const [riskLevel, setRiskLevel] = useState<RiskLevel>(riskLevels);
    const [controlExceptions, setControlExceptions] = useState<
        ControlException[]
    >([]);
    const [isControlsLoading, setIsControlsLoading] = useState(false);
    const Axios = axios;
    const [topControlData, setTopControlData] = useState({});

    const onDoubleClick = (event: any) => {
        // let rulesString = JSON.stringify(rules);
        // let rulesParsed = JSON.parse(rulesString);
        // let item = rulesParsed.find((element: any) => element.text === event.point.x);
        // dispatch(
        //     updateSelectedRules([
        //            item.value
        //     ])
        // );
        highlightActiveTab(2);
        navigate("/home/gl/clients/audits/audit/transactions");
    };
    // Based on the filterName dispatch the actions for update the filter values
    const handleState = (items: any, filterName: string) => {
        let itemArray = [...filterConfig];//Getting copy of the filterconfig it's giving the array of jsons
        let index = itemArray.findIndex(item => {
            return item.filterName === filterName;
        });
        itemArray[index].selected = items;
        if (filterName === "posted-date") {
            dispatch(updateStartDate(items.posted_date_start));
            dispatch(updateEndDate(items.posted_date_end));
        }
        if (filterName === "rules") {
            dispatch(updateSelectedRules(items));
        };
        if (filterName === "companies") {
            dispatch(updateSelectedCompanies(items));
        };
        if (filterName === "risk") {
            dispatch(updateSelectedRisk(items));
        };
        if (filterName === "toggle") {
            dispatch(updateSelectedToggle(items));
        };
        if (filterName === "accounts") {
            dispatch(updateSelectedAccounts(items));
        };
        if (filterName === "transaction-type") {
            dispatch(updateSelectedSelectedTransactionType(items));
        };
        setFilterConfig(itemArray);//Update the filterConfig state with updated data
        getControlCounts(
            items,
        );
    };

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
                accounts,
            ),
        );
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

    //Calling getControlCounts api and passing data's like what we are selected in the filters (User Inputs)
    const getControlCounts = async (
        itemArray: Config[],
    ) => {
        setIsDocumentLoading(true);
        let filters: filters = {
            posted_date: {
                posted_date_start: filterConfig[2].selected?.posted_date_start,
                posted_date_end: filterConfig[2].selected?.posted_date_end,
            },
            process_status: [1, 2],
            audit_id:getPath.getPathValue('audit_id')
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
            const getControlCountsResponse = await Axios.post(
                GET_CONTROLS_COUNT_URL,
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
            if (getControlCountsResponse.data.data) {
                setTopControlData(getControlCountsResponse.data.data);
                getControlExceptions(itemArray);
            } else {
                setDocuments([]);
                getControlExceptions(itemArray);
            }
        } catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    };
    //Calling getControlExceptions api and passing data's like what we are selected in the filters (User Inputs)
    const getControlExceptions = async (
        itemArray: Config[],
    ) => {
        setIsControlsLoading(true);
        let filters: filters = {
            posted_date: {
                posted_date_start: filterConfig[2].selected?.posted_date_start,
                posted_date_end: filterConfig[2].selected?.posted_date_end,
            },
            process_status: [1, 2],
            audit_id:getPath.getPathValue('audit_id')
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
            let formData = new FormData();
            formData.append("filters", JSON.stringify(filters));
            const getControlExceptionsResponse = await Axios.post(
                GET_CONTROL_EXCEPTIONS_URL,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                }
            );
            if (getControlExceptionsResponse.data.data.length) {
                setIsControlsLoading(false);
                // Getting controlException values using sort method
                setControlExceptions(
                    getControlExceptionsResponse.data.data.sort(function (
                  a: any,
                  b: any
                ) {
                    return parseFloat(b.doccount) - parseFloat(a.doccount);
                                  })
                );
              }
        } catch { }
    };

    // Handling controleExpection with control.selected is true or false (user Inputs)
    const handleControlException = (control: ControlException) => {
        let tempConfig = [...filterConfig];
        let stringiFiedConfig = JSON.stringify(tempConfig);
        let parsedConfig = JSON.parse(stringiFiedConfig);
        let itemArray = [...parsedConfig];
        let index = itemArray.findIndex((item) => {
            return item.filterName === "rules";
        });
        if (control.selected === false) {
            let removeIndex = itemArray[index].selected.findIndex(
                (element: string) => element === control.rule
            );
            itemArray[index]?.selected?.splice(removeIndex, 1);

        } else {
            itemArray[index].selected =
                (itemArray[index].selected !== undefined &&
                    itemArray[index].selected.length) > 0
                    ? [...itemArray[index].selected]
                    : [];
            itemArray[index].selected.push(control.rule);
        }
        setFilterConfig(itemArray);
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const generateFilterConfig = () => {
            // let response = data;
            // let keys = Object.keys(response);
            // let configCopy: Config[] = [...setInitData(companies, rules, selectedRules, selectedCompanies,selectedRisk,  postedStartDate,
            //     postedEndDate, selectedAccounts, selectedTransactionType,selectedToggle, accounts)];
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

            // // set accounts filter data
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
            setFilterConfig([...configCopy]);
            getControlCounts(
                configCopy,
            );
        };

        const getFilters = async (accountsData?: any) => {
            // try {
            //     let getFilterArray: string[] = [];
            //     config.forEach((item) => {
            //         if (item.filterName) {
            //             getFilterArray.push(item.filterName);
            //         }
            //     });
            //     let formData = new FormData();
            //     formData.append("filtertype", getFilterArray.join(","));
            //     setIsLoading(true);
            //     const response = await Axios.post(GET_FILTERS_URL, formData, {
            //         headers: {
            //             Authorization: localStorage.getItem(
            //                 "TR_Token"
            //             ) as string,
            //         },
            //     });
            //     isMounted &&
            //         generateFilterConfig(response.data.data, accountsData);
            //     setIsLoading(false);
            //     // if(response.data.data){
            //     //     console.log("getfilters data:",response.data.data);
            //     // }
            // } catch (err) {
            //     console.error(err);
            // }
            generateFilterConfig();
        };

        // const getAccountGroupsAll = async () => {
        //     try {
        //         const response = await Axios.get(GET_ACCOUNT_GROUPS_URL, {
        //             headers: {
        //                 Authorization: localStorage.getItem(
        //                     "TR_Token"
        //                 ) as string,
        //             },
        //         });

        //         if (response.data.data.length) {
        //         }
        //         isMounted && getFilters(response.data.data);
        //     } catch (err) {
        //         console.error(err);
        //     }
        // };

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
        //         // isMounted && getAccountGroupsAll();
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

        // const getWorkFlowStatus = async () => {
        //     try {
        //         let formData = new FormData();
        //         formData.append("module", "gl");
        //         setIsReviewStatusLoading(true);
        //         const reviewStatusArray = await Axios.post(
        //             GET_REVIEW_STATUS_CODE_URL,
        //             formData,
        //             {
        //                 headers: {
        //                     Authorization: localStorage.getItem(
        //                         "TR_Token"
        //                     ) as string,
        //                 },
        //             }
        //         );
        //         if (reviewStatusArray.data.data) {
        //             let reviewStatObj: any[] = [];
        //             reviewStatusArray.data.data.forEach((status: any) => {
        //                 status.text = status.REVIEW_STATUS_DESCRIPTION;
        //                 status.value = status.REVIEWSTATUSID;

        //                 delete status.REVIEW_STATUS_DESCRIPTION;
        //                 delete status.REVIEWSTATUSID;
        //                 delete status.REVIEW_STATUS_CODE;

        //                 reviewStatObj.push(status);
        //             });
        //             let reviewStatusConfigCopy = { ...reviewStatusConfig };
        //             reviewStatusConfigCopy.data = [...reviewStatObj];
        //             setReviewStatusConfig(reviewStatusConfigCopy);
        //         }
        //         isMounted && getRiskConfig();
        //         setIsReviewStatusLoading(false);
        //     } catch {}
        // };

        // Getting initial data of postedDate
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
                posted_date_end: `${currentYear}-${currentMonth + 1
                    }-${currentDay}`,
            };
            configCopy[2].selected = {
                posted_date_start: postedStartDate,
                posted_date_end: postedEndDate,
            };
        };

        setDate();
        //getRiskConfig();
        //getWorkFlowStatus();
        //getAccountGroupsAll();
        getFilters();

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
                                        handleAddRemoveSelection(
                                            filter,
                                            false
                                        );
                                    }}
                                    key={filter.label}
                                >
                                    <ListItemText>
                                        {filter.label}
                                    </ListItemText>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                display: "flex",
                                                flexDirection:
                                                    "row-reverse",
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
                                        handleAddRemoveSelection(
                                            filter,
                                            true
                                        );
                                    }}
                                    key={filter.label}
                                >
                                    <ListItemText>
                                        {filter.label}
                                    </ListItemText>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                display: "flex",
                                                flexDirection:
                                                    "row-reverse",
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

            <div className="flex flex-row gap-5 w-full">

                <div className="font-roboto md:flex md:w-10/12 h-fit shadow-lg insights-b">
                    {/* <BarCharts topControlCountData={topControlData}/> */}
                    <StackedBarChart data={topControlData} doubleClick={onDoubleClick} />
                    {isLoading
                        ?
                        <div style={{ display: 'flex', justifyContent: 'left' }}>
                            <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                        </div>
                        :
                        ''
                    }
                </div>


                <div className="hidden md:flex md:w-3/12 h-min shadow-xl border border-solid border-slate-300 rounded-lg">
                    <div className="flex flex-col w-full p-5 h-min">
                        <div className="flex flex-row font-roboto font-bold justify-between">
                            {" "}
                            <span className="flex">Control Exceptions</span>
                            <span className="grow item-center justify-center">
                                <div
                                    className={`flex-row-reverse pr-2 ${!isControlsLoading ? "hidden" : "flex"
                                        }`}
                                >
                                    <CircularProgress size={20} />
                                </div>
                            </span>
                        </div>
                        <Divider className="mt-2" />
                        <ControlExceptions
                            controls={controlExceptions}
                            selectedControls={
                                filterConfig?.find((filter: any) => {
                                    if (filter.filterName === "rules") {
                                        return filter;
                                    }
                                })!.selected
                                    ? filterConfig?.find((filter: any) => {
                                        if (filter.filterName === "rules") {
                                            return filter;
                                        }
                                    })!.selected
                                    : []
                            }
                            handleControlException={handleControlException}
                        />
                        {/* {controlExceptions.map(
                            (controlException: ControlException) => {
                                return controlException.doccount ? (
                                    <div
                                        key={controlException.title}
                                        className="flex flex-row w-full justify-between mt-3"
                                    >
                                        <div className="font-roboto text-sm text-[#1976d2]">
                                            {controlException.title}
                                        </div>
                                        <div className="font-roboto text-sm">
                                            {controlException.doccount}
                                        </div>
                                    </div>
                                ) : null;
                            }
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Charts;