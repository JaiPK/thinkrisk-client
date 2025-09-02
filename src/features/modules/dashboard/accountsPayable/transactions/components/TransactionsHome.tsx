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
import axios from "../../../../../../api/axios";
import {
  Config,
  Filter,
  ReviewStatus,
} from "../../../../../../shared/models/filters";
import {
  AccDocument,
  ControlException,
  RiskLevel,
  RiskLevelItem,
} from "../../../../../../shared/models/records";
import StatusDropDown from "../../../../../../shared/ui/dropdowns/StatusDropDown";
import FilterBar from "../../../../../../shared/ui/filter-bar/FilterBar";
import TransactionList from "./TransactionList";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ReviewStatusDropDown from "../../../../../../shared/ui/dropdowns/ReviewStatusDropDown";
import numberSuffixPipe from "../../../../../../shared/helpers/numberSuffixPipe";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ControlExceptions from "../../../../../../shared/ui/control-exceptions/ControlExceptions";
import DeviationDropDown from "../../../../../../shared/ui/dropdowns/DeviationDropDown";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks";
import { updateIsAPDrillThrough } from "../../state/APFilterConfigSlice";

import { RootState } from "../../../../../../store/Store";
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
} from "../../../../ap-slice/APSlice";
import { getPath } from "../../../../../../shared/helpers/getPath";
import { downloadCSV, downloadExcel } from "../../../../../../shared/helpers/downloadFile";
const GET_REVIEW_STATUS_CODE_URL = "v1/je/workflowstatus";
const GET_FILTERS_URL = "v1/ap/get_filters";
const GET_DOCUMENTS_URL = "v1/ap/getdocuments";
const GET_CONTROL_EXCEPTIONS_URL = "v1/ap/controls";
const GET_ACCOUNT_GROUPS_URL = "v1/config/getaccountgroupsall";

const SORT_CONSTANTS = [
  { text: "BLENDED_RISK_SCORE", value: 1 },
  { text: "POSTED_DATE", value: 2 },
  { text: "DEBIT_AMOUNT", value: 3 },
  { text: "CREDIT_AMOUNT", value: 4 },
  { text: "COMPANY_CODE_NAME", value: 5 },
];

interface filters {
  posted_date: any,
  process_status: any,
  company_code?: any,
  rules?: any,
  toggle?: any,
  hml?: any,
  documenttype?: any,
  vendor?: any,
  SUBRSTATUSID?: any,
  isDeviation?: any,
  stext?: any,
  audit_id?:any
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

const underReviewDeviationData = [
  {
    text: "All",
    value: "",
    SUBRSTATUSID: "",
    isDeviation: -1,
  },
  {
    text: "Manager Review With Deviation",
    value: "31",
    SUBRSTATUSID: 3,
    isDeviation: 1,
  },
  {
    text: "Manager Review Without Deviation",
    value: "30",
    SUBRSTATUSID: 3,
    isDeviation: 0,
  },
  {
    text: "Assigned to Auditor",
    value: "4",
    SUBRSTATUSID: 4,
    isDeviation: -1,
  },
];

const closedDeviationData = [
  {
    text: "All",
    value: "",
    SUBRSTATUSID: "",
    isDeviation: -1,
  },
  {
    text: "Closed With Deviation",
    value: "1",
    SUBRSTATUSID: "1",
    isDeviation: 1,
  },
  {
    text: "Closed Without Deviation",
    value: "0",
    SUBRSTATUSID: "2",
    isDeviation: 0,
  },
];

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

export interface Props {
  handleNavigateToTransDetails(
    transId: number,
    document: AccDocument,
    riskLevel: RiskLevel
  ): void;
}

const TransactionsHome = ({ handleNavigateToTransDetails }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  let companies = useAppSelector((state) => state.APDataSlice.companies);

  let rules = useAppSelector((state) => state.APDataSlice.rules);
  let selectedRules = useAppSelector(
    (state) => state.APDataSlice.rule_selected
  );
  let selectedRisk = useAppSelector((state) => state.APDataSlice.risk_selected);
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
  let selectedToggle = useAppSelector(
    (state) => state.APDataSlice.toggle_selected
  );
  let filterConfigFromStore = useAppSelector((state) => state.APFilterConfig);

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
  const [underReviewDeviationConfig, setPendingDeviationConfig] = useState({
    label: "Deviation Status",
    data: [...underReviewDeviationData],
    selected: "",
  });

  const [closedDeviationConfig, setClosedDeviationConfig] = useState({
    label: "Deviation Status",
    data: [...closedDeviationData],
    selected: "",
  });
  const [totalDocsCount, setTotalDocsCount] = useState(0);
  const [totalDocsSum, setTotalDocsSum] = useState(0);
  const [duplicateDocsCount, setDuplicateDocsCount] = useState(0);
  const [sortByConfig, setSortByConfig] = useState(SortByDropDownConfig);
  const [sortOrder, setSortOrder] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isReviewStatusLoading, setIsReviewStatusLoading] = useState(false);
  const [documents, setDocuments] = useState<AccDocument[]>([]);
  const [isDocumentsLoading, setIsDocumentLoading] = useState(false);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(riskLevels);
  const [controlExceptions, setControlExceptions] = useState<
    ControlException[]
  >([]);
  const [isControlsLoading, setIsControlsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [perpage, setPerpage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const sTextRef = useRef<any>(null);
  const Axios = axios;

  //for the export menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const clearControlException = () => {
    let itemArray = [...filterConfig];
    let index = itemArray.findIndex((item) => {
      return item.filterName === "aprules";
    });
    itemArray[index].selected = [];
    setFilterConfig(itemArray);
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


  const handleState = (items: any, filterName: string) => {
    let itemArray = [...filterConfig];
    let index = itemArray.findIndex((item) => {
      return item.filterName === filterName;
    });
    itemArray[index].selected = items;
    setFilterConfig(itemArray);

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
    getDocuments(
      items,
      reviewStatusConfig,
      sortByConfig.selected,
      sortOrder,
      page,
      perpage
    );
  };

  const handleControlException = (control: ControlException) => {
    let tempConfig = [...filterConfig];
    let stringiFiedConfig = JSON.stringify(tempConfig);
    let parsedConfig = JSON.parse(stringiFiedConfig);
    let itemArray = [...parsedConfig];

    let index = itemArray.findIndex((item) => {
      return item.filterName === "aprules";
    });
    if (control.selected === false) {
      let removeIndex = itemArray[index].selected.findIndex(
        (element: string) => element === control.rule
      );
      itemArray[index]?.selected?.splice(removeIndex, 1);
    } else {
      itemArray[index].selected =
        (itemArray[index]?.selected !== undefined &&
          itemArray[index]?.selected.length) > 0
          ? [...itemArray[index]?.selected]
          : [];
      itemArray[index]?.selected.push(control.rule);
    }
    setFilterConfig(itemArray);
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

  const handleDeviationState = (selectedDeviation: string) => {
    let controlDevObj: any;
    if (reviewStatusConfig.selected === 2) {
      controlDevObj = underReviewDeviationConfig.data.find(
        (element) => element.value === selectedDeviation
      );
      getDocuments(
        filterConfig,
        reviewStatusConfig,
        sortByConfig.selected,
        sortOrder,
        page,
        perpage,
        controlDevObj.SUBRSTATUSID,
        controlDevObj.isDeviation
      );
    }
    if (reviewStatusConfig.selected === 3) {
      controlDevObj = closedDeviationConfig.data.find(
        (element) => element.value === selectedDeviation
      );
      getDocuments(
        filterConfig,
        reviewStatusConfig,
        sortByConfig.selected,
        sortOrder,
        page,
        perpage,
        controlDevObj.SUBRSTATUSID,
        controlDevObj.isDeviation
      );
    }
  };
  const handleSortByState = (items: any) => {
    let sortByObj = { ...sortByConfig };
    sortByObj.selected = items;
    setSortByConfig(sortByObj);
    getDocuments(
      filterConfig,
      reviewStatusConfig,
      items,
      sortOrder,
      page,
      perpage
    );
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

  const handleStextEnterAction = (event: any) => {
    if (event.key === "Enter") {
      handleStextupdate();
    }
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
    )
    // window.location.reload();
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

 


  const getDocuments = async (
    itemArray: Config[],
    reviewStatusArray: ReviewStatus,
    sortBy: number,
    sortOrder: boolean,
    page: number,
    perpage: number,
    subrStatusId?: string[],
    isDeviation?: number
  ) => {
    setIsDocumentLoading(true);
    let filters: filters = {
      posted_date: {
        posted_date_start: filterConfig[2].selected?.posted_date_start,
        posted_date_end: filterConfig[2].selected?.posted_date_end,
      },
      process_status: [reviewStatusArray.selected],
      stext: sTextRef.current?.value,
      audit_id: getPath.getPathValue("audit_id")
    };
    if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "apcompanies")].selected.length > 0) {
      filters.company_code = filterConfig?.find((filter: any) => {
        if (filter.filterName === "apcompanies") {
          return filter;
        }
      })!.selected;
    };
    if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "aprules")]?.selected?.length > 0) {
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
    if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "risk")].selected.length > 0) {
      filters.hml = filterConfig?.find((filter: any) => {
        if (filter.filterName === "risk") {
          return filter;
        }
      })!?.selected;
    };
    if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "transaction-type")].selected.length > 0) {
      filters.documenttype = filterConfig?.find((filter: any) => {
        if (filter.filterName === "transaction-type") {
          return filter;
        }
      })!?.selected;
    };
    if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "apvendors")].selected.length > 0) {
      filters.vendor = filterConfig?.find((filter: any) => {
        if (filter.filterName === "apvendors") {
          return filter;
        }
      })!?.selected;
    };
    // let filters: Filter = {
    //   posted_date: {
    //     posted_date_start: filterConfig?.find((filter: any) => {
    //       if (filter.filterName === "posted-date") {
    //         return filter;
    //       }
    //     })!?.selected?.posted_date_start,
    //     posted_date_end: filterConfig?.find((filter: any) => {
    //       if (filter.filterName === "posted-date") {
    //         return filter;
    //       }
    //     })!?.selected?.posted_date_end,
    //   },
    //   process_status: [reviewStatusArray.selected],
    //   stext: sTextRef.current?.value,
    //   company_code: filterConfig?.find((filter: any) => {
    //     if (filter.filterName === "apcompanies") {
    //       return filter;
    //     }
    //   })!?.selected
    //     ? filterConfig?.find((filter: any) => {
    //         if (filter.filterName === "apcompanies") {
    //           return filter;
    //         }
    //       })!?.selected
    //     : [],
    //   rules: filterConfig?.find((filter: any) => {
    //     if (filter.filterName === "aprules") {
    //       return filter;
    //     }
    //   })!.selected,
    //   toggle: filterConfig?.find((filter: any) => {
    //     if (filter.filterName === "toggle") {
    //       return filter;
    //     }
    //   })!.selected,
    //   hml: filterConfig?.find((filter: any) => {
    //     if (filter.filterName === "risk") {
    //       return filter;
    //     }
    //   })!?.selected,
    //   documenttype: filterConfig?.find((filter: any) => {
    //     if (filter.filterName === "transaction-type") {
    //       return filter;
    //     }
    //   })!?.selected,
    //   vendor: filterConfig?.find((filter: any) => {
    //     if (filter.filterName === "apvendors") {
    //       return filter;
    //     }
    //   })!?.selected,
    // };

    if (reviewStatusArray.selected === 2) {
      filters.SUBRSTATUSID =
        subrStatusId === undefined ? [""] : [subrStatusId.toString()];
      filters.isDeviation = isDeviation === undefined ? -1 : isDeviation;
    }

    if (reviewStatusArray.selected === 3) {
      filters.SUBRSTATUSID =
        subrStatusId === undefined ? [""] : [subrStatusId.toString()];
      filters.isDeviation = isDeviation === undefined ? -1 : isDeviation;
    }

    try {
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
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        }
      );
      if (getDocumentsResponse.data.data.records.length) {
        let Obj: AccDocument[] = [];
        getDocumentsResponse.data.data.records.forEach(
          (record: AccDocument) => {
            record.riskScore =
              record.BLENDED_RISK_SCORE >= 0
                ? record.BLENDED_RISK_SCORE
                : record.BLENDED_SCORE_INDEXED;
            if (record.riskScore >= 0) {
              record.riskScore &&= Math.trunc(record.riskScore * 100);
            }
            Obj.push(record);
          }
        );
        setDocuments(Obj);
        setTotalCount(
          getDocumentsResponse?.data?.data.totalcount
            ? getDocumentsResponse?.data?.data.totalcount
            : 0
        );
        setTotalDocsCount(
          getDocumentsResponse?.data?.data.totalcount
            ? getDocumentsResponse?.data?.data.totalcount
            : 0
        );
        setTotalDocsSum(
          getDocumentsResponse?.data?.data.totalsum?.totaldebit
            ? getDocumentsResponse?.data?.data.totalsum?.totaldebit
            : 0
        );
        setIsDocumentLoading(false);
        getControlExceptions(itemArray, reviewStatusArray);
      } else {
        setDocuments([]);
        setTotalCount(getDocumentsResponse?.data?.data.totalcount);
        setTotalDocsCount(getDocumentsResponse?.data?.data.totalcount);
        setTotalDocsSum(getDocumentsResponse?.data?.data.totalsum?.totaldebit);
        setIsDocumentLoading(false);
        getControlExceptions(itemArray, reviewStatusArray);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getControlExceptions = async (
    itemArray: Config[],
    reviewStatusArray: ReviewStatus
  ) => {
    setIsControlsLoading(true);

    let filters: filters = {
      posted_date: {
        posted_date_start: filterConfig[2].selected?.posted_date_start,
        posted_date_end: filterConfig[2].selected?.posted_date_end,
      },
      process_status: [reviewStatusArray.selected],
      stext: sTextRef.current?.value,
      audit_id: getPath.getPathValue("audit_id")
    };
    if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "apcompanies")].selected.length > 0) {
      filters.company_code = filterConfig?.find((filter: any) => {
        if (filter.filterName === "apcompanies") {
          return filter;
        }
      })!.selected;
    };
    if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "aprules")]?.selected?.length > 0) {
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
    if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "risk")].selected.length > 0) {
      filters.hml = filterConfig?.find((filter: any) => {
        if (filter.filterName === "risk") {
          return filter;
        }
      })!?.selected;
    };
    if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "transaction-type")].selected.length > 0) {
      filters.documenttype = filterConfig?.find((filter: any) => {
        if (filter.filterName === "transaction-type") {
          return filter;
        }
      })!?.selected;
    };
    if (filterConfig[filterConfig.findIndex((item: any) => item.filterName === "apvendors")].selected.length > 0) {
      filters.vendor = filterConfig?.find((filter: any) => {
        if (filter.filterName === "apvendors") {
          return filter;
        }
      })!?.selected;
    };

    // let filters = {
    //   posted_date: {
    //     posted_date_start: filterConfig?.find((filter: any) => {
    //       if (filter.filterName === "posted-date") {
    //         return filter;
    //       }
    //     })!?.selected?.posted_date_start,
    //     posted_date_end: filterConfig?.find((filter: any) => {
    //       if (filter.filterName === "posted-date") {
    //         return filter;
    //       }
    //     })!?.selected?.posted_date_end,
    //   },
    //   process_status: [reviewStatusArray.selected],
    //   stext: sTextRef.current?.value,
    //   company_code: filterConfig?.find((filter: any) => {
    //     if (filter.filterName === "apcompanies") {
    //       return filter;
    //     }
    //   })!?.selected
    //     ? filterConfig?.find((filter: any) => {
    //         if (filter.filterName === "apcompanies") {
    //           return filter;
    //         }
    //       })!?.selected
    //     : [],
    //   rules: filterConfig?.find((filter: any) => {
    //     if (filter.filterName === "aprules") {
    //       return filter;
    //     }
    //   })!.selected,
    //   toggle: filterConfig?.find((filter: any) => {
    //     if (filter.filterName === "toggle") {
    //       return filter;
    //     }
    //   })!.selected,
    //   hml: filterConfig?.find((filter: any) => {
    //     if (filter.filterName === "risk") {
    //       return filter;
    //     }
    //   })!?.selected,
    //   documenttype: filterConfig?.find((filter: any) => {
    //     if (filter.filterName === "transaction-type") {
    //       return filter;
    //     }
    //   })!?.selected,
    //   vendor: filterConfig?.find((filter: any) => {
    //     if (filter.filterName === "apvendors") {
    //       return filter;
    //     }
    //   })!?.selected,
    // };
    try {
      let formData = new FormData();
      formData.append("filters", JSON.stringify(filters));
      const getControlExceptionsResponse = await Axios.post(
        GET_CONTROL_EXCEPTIONS_URL,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        }
      );
      if (getControlExceptionsResponse.data.data.length) {
        setIsControlsLoading(false);
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

  const [csvToken, setCsvToken] = useState("");
  const PRINT_TOKEN = "v1/print/token";
  const csv = async (reviewStatusArray: ReviewStatus) => {
    try {
      const response = await Axios.get(PRINT_TOKEN, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      setCsvToken(response.data.data.Token);
      const REACT_APP_BASE_URL = "https:" + "//" + window.location.hostname + ":8443/public/index.php/";
      let filters = {
        audit_id: getPath.getPathValue("audit_id"),
        posted_date: {
          posted_date_start: filterConfig?.find((filter: any) => {
            if (filter.filterName === "posted-date") {
              return filter;
            }
          })!?.selected?.posted_date_start,
          posted_date_end: filterConfig?.find((filter: any) => {
            if (filter.filterName === "posted-date") {
              return filter;
            }
          })!?.selected?.posted_date_end,
        },
        process_status: [reviewStatusArray.selected],
        stext: sTextRef.current?.value,
        company_code: filterConfig?.find((filter: any) => {
          if (filter.filterName === "apcompanies") {
            return filter;
          }
        })!?.selected
          ? filterConfig?.find((filter: any) => {
            if (filter.filterName === "apcompanies") {
              return filter;
            }
          })!?.selected
          : [],
        rules: filterConfig?.find((filter: any) => {
          if (filter.filterName === "aprules") {
            return filter;
          }
        })!.selected,
        toggle: filterConfig?.find((filter: any) => {
          if (filter.filterName === "toggle") {
            return filter;
          }
        })!.selected,
        hml: filterConfig?.find((filter: any) => {
          if (filter.filterName === "risk") {
            return filter;
          }
        })!?.selected,
        documenttype: filterConfig?.find((filter: any) => {
          if (filter.filterName === "transaction-type") {
            return filter;
          }
        })!?.selected,
        vendor: filterConfig?.find((filter: any) => {
          if (filter.filterName === "apvendors") {
            return filter;
          }
        })!?.selected,
      };
      downloadCSV(response.data.data.Token,filters, "csvapdashboard", "accountdocument", "AP")
    } catch (err) {
      console.error(err);
    }
  };

  const getCsvData = () => {
    csv(reviewStatusConfig);
  };

  const [excelToken, setExcelToken] = useState("");

  const excel = async (reviewStatusArray: ReviewStatus) => {
    try {
      const response = await Axios.get(PRINT_TOKEN, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      setExcelToken(response.data.data.Token);
      let filters = {
        audit_id: getPath.getPathValue("audit_id"),
        posted_date: {
          posted_date_start: filterConfig?.find((filter: any) => {
            if (filter.filterName === "posted-date") {
              return filter;
            }
          })!?.selected?.posted_date_start,
          posted_date_end: filterConfig?.find((filter: any) => {
            if (filter.filterName === "posted-date") {
              return filter;
            }
          })!?.selected?.posted_date_end,
        },
        process_status: [reviewStatusArray.selected],
        stext: sTextRef.current?.value,
        company_code: filterConfig?.find((filter: any) => {
          if (filter.filterName === "apcompanies") {
            return filter;
          }
        })!?.selected
          ? filterConfig?.find((filter: any) => {
            if (filter.filterName === "apcompanies") {
              return filter;
            }
          })!?.selected
          : [],
        rules: filterConfig?.find((filter: any) => {
          if (filter.filterName === "aprules") {
            return filter;
          }
        })!.selected,
        toggle: filterConfig?.find((filter: any) => {
          if (filter.filterName === "toggle") {
            return filter;
          }
        })!.selected,
        hml: filterConfig?.find((filter: any) => {
          if (filter.filterName === "risk") {
            return filter;
          }
        })!?.selected,
        documenttype: filterConfig?.find((filter: any) => {
          if (filter.filterName === "transaction-type") {
            return filter;
          }
        })!?.selected,
        vendor: filterConfig?.find((filter: any) => {
          if (filter.filterName === "apvendors") {
            return filter;
          }
        })!?.selected,
      };
      downloadExcel(response.data.data.Token, filters , "apdashboard", "accountdocument", "AP")
    } catch (err) {
      console.error(err);
    }
  };

  const getExcelData = () => {
    excel(reviewStatusConfig);
  };

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
          vendors,
        ),
      ];
      keys.forEach((key: any) => {
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
        ).forEach((filter, index) => {
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

      let tempObj: any[] = [];
      let tempStringified: string;
      let finalTempObj: any[] = [];
      if (filterConfigFromStore.IsDrillThrough) {
        // filterConfigFromStore.config.forEach((element: any) => {
        //     tempObj.push(element);
        // });
        tempObj = [...filterConfigFromStore.config];
        tempStringified = JSON.stringify(tempObj);
        finalTempObj = [...JSON.parse(tempStringified)];
      }

      setFilterConfig(
        filterConfigFromStore.IsDrillThrough
          ? [...finalTempObj]
          : [...configCopy]
      );
      dispatch(updateIsAPDrillThrough(false));
      getDocuments(
        configCopy,
        reviewStatusConfig,
        sortByConfig.selected,
        sortOrder,
        page,
        perpage
      );
    };

    const getFilters = async () => {
      try {
        let getFilterArray: string[] = [];
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
        ).forEach((item) => {
          if (item.filterName) {
            getFilterArray.push(item.filterName);
          }
        });
        let formData = new FormData();
        formData.append("filtertype", getFilterArray.join(","));
        setIsLoading(true);
        formData.append("audit_id",  getPath.getPathValue("audit_id"));
        formData.append("client_id",   getPath.getPathValue("client_id"));
        const response = await Axios.post(GET_FILTERS_URL, formData, {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        });
        isMounted && generateFilterConfig(response.data.data);
        setIsLoading(false);
        // if(response.data.data){
        //     console.log("getfilters data:",response.data.data);
        // }
      } catch (err) {
        console.error(err);
      }
    };

    const getAccountGroupsAll = async () => {
      try {
        const response = await Axios.get(GET_ACCOUNT_GROUPS_URL, {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        });
        isMounted && getFilters();
      } catch (err) {
        console.error(err);
      }
    };

    const getRiskConfig = async () => {
      try {
        let formData = new FormData();
        formData.append("filtertype", "riskweights");
        formData.append("audit_id",  getPath.getPathValue("audit_id"));
        formData.append("client_id",   getPath.getPathValue("client_id"));
        const response = await Axios.post(GET_FILTERS_URL, formData, {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        });
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
                  Obj.range_high = Number(element.KEYVALUE) * 100;
                  break;
                case "range_medium":
                  Obj.range_medium = Number(element.KEYVALUE) * 100;
                  break;
                case "range_low":
                  Obj.range_low = Number(element.KEYVALUE) * 100;
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

    const getWorkFlowStatus = async () => {
      try {
        let formData = new FormData();
        formData.append("module", "gl");
        setIsReviewStatusLoading(true);
        const reviewStatusArray = await Axios.post(
          GET_REVIEW_STATUS_CODE_URL,
          formData,
          {
            headers: {
              Authorization: localStorage.getItem("TR_Token") as string,
            },
          }
        );
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
        isMounted && getAccountGroupsAll();
        setIsReviewStatusLoading(false);
      } catch { }
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
          vendors
        ),
      ];
      configCopy[2].data[0] = {
        posted_date_start: `${financialYear}-04-01`,
        posted_date_end: `${currentYear}-${currentMonth + 1}-${currentDay}`,
      };
      configCopy[2].selected = {
        posted_date_start: `${financialYear}-04-01`,
        posted_date_end: `${currentYear}-${currentMonth + 1}-${currentDay}`,
      };
    };

    setDate();
    getWorkFlowStatus();

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
        {/* <Button
                    onClick={() => {
                        setFilterConfigFromDrillThrough(2, "toggle");
                    }}
                >
                    Test
                </Button> */}
      </div>
      <div className="flex w-full mt-4">
        <div className="flex flex-col w-full mb-4">
          <div className="flex flex-col md:flex-row w-full item-center gap-3">
            <div className="w-full md:w-2/12 my-auto">
              <ReviewStatusDropDown
                itemArray={reviewStatusConfig.data}
                label={reviewStatusConfig.label}
                stateChange={handleReviewStatusState}
                selectedItem={reviewStatusConfig.selected}
                totalCount={totalDocsCount}
                totalSum={totalDocsSum}
                defaultValue={1}
              />
            </div>
            {reviewStatusConfig.selected === 2 ? (
              <div className="w-full md:w-3/12 my-auto">
                <div className="relative flex flex-row">
                  <DeviationDropDown
                    itemArray={underReviewDeviationConfig.data}
                    label={underReviewDeviationConfig.label}
                    stateChange={handleDeviationState}
                    selectedItem={underReviewDeviationConfig.selected}
                  />
                </div>
              </div>
            ) : null}
            {reviewStatusConfig.selected === 3 ? (
              <div className="w-full md:w-3/12 my-auto">
                <div className="relative flex flex-row">
                  <DeviationDropDown
                    itemArray={closedDeviationConfig.data}
                    label={closedDeviationConfig.label}
                    stateChange={handleDeviationState}
                    selectedItem={closedDeviationConfig.selected}
                  />
                </div>
              </div>
            ) : null}
            <div className="flex flex-row-reverse grow">

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
                      openAddRemoveFilter ? "add-remove-menu" : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={openAddRemoveFilter ? "true" : undefined}
                    onClick={handleAddRemoveFilterClick}
                  >
                    <AddBoxOutlinedIcon />
                  </Button>
                </Tooltip>
              </span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row w-full item-center gap-3 mt-1">
            <div className="w-full md:w-4/12 my-auto ml-4 font-roboto text-sm">
              {numberSuffixPipe(totalDocsSum)} /{" "}
              {numberSuffixPipe(totalDocsCount)} Accounting Documents
            </div>
          </div>
          <div className="flex flex-col md:flex-row w-full item-center gap-3 mt-1">
            {/* <div className="w-full md:w-3/12 my-auto">
                            <ReviewStatusDropDown
                                itemArray={reviewStatusConfig.data}
                                label={reviewStatusConfig.label}
                                stateChange={handleReviewStatusState}
                                selectedItem={reviewStatusConfig.selected}
                                totalCount={totalDocsCount}
                                totalSum={totalDocsSum}
                                defaultValue={1}
                            />
                        </div> */}
            {/* <Divider className="hidden md:flex" orientation="vertical" /> */}
            {/* {reviewStatusConfig.selected === 2 ? (
              <div className="w-full md:w-1/5 my-auto">
                <div className="relative flex flex-row">
                  <DeviationDropDown
                    itemArray={underReviewDeviationConfig.data}
                    label={underReviewDeviationConfig.label}
                    stateChange={handleDeviationState}
                    selectedItem={underReviewDeviationConfig.selected}
                  />
                </div>
              </div>
            ) : null}
            {reviewStatusConfig.selected === 3 ? (
              <div className="w-full md:w-1/5 my-auto">
                <div className="relative flex flex-row">
                  <DeviationDropDown
                    itemArray={closedDeviationConfig.data}
                    label={closedDeviationConfig.label}
                    stateChange={handleDeviationState}
                    selectedItem={closedDeviationConfig.selected}
                  />
                </div>
              </div>
            ) : null} */}
            <div className="w-full md:w-2/5 my-auto">
              <div className="relative flex flex-row">
                <input
                  className="p-2 w-full h-full border-2 border-solid border-slate-300 rounded-md focus:border-[#1976d2] focus:outline-none"
                  ref={sTextRef}
                  type="text"
                  autoComplete="off"
                  // onChange={handleStextupdate}
                  placeholder="Search Accounts Payable Entry/Invoice number"
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
            <div className="w-auto my-auto">
              <span className="font-roboto text-sm">Sort By</span>
            </div>
            <div className="w-full md:w-1/5">
              <StatusDropDown
                itemArray={SortByDropDownConfig.data}
                label={SortByDropDownConfig.label}
                stateChange={handleSortByState}
                selectedItem={SortByDropDownConfig.selected}
              />
            </div>
            <span className="my-auto cursor-pointer">
              <Tooltip title="Export">
                <Button
                  className="text-black"
                  id="export-button"
                  aria-controls={open ? "export-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  <OpenInNewIcon />
                </Button>
              </Tooltip>
            </span>
            {/* <span className="my-auto cursor-pointer">
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
                    openAddRemoveFilter ? "add-remove-menu" : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={openAddRemoveFilter ? "true" : undefined}
                  onClick={handleAddRemoveFilterClick}
                >
                  <AddBoxOutlinedIcon />
                </Button>
              </Tooltip>
            </span> */}
            <Menu
              id="export-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "export-button",
              }}
            >
              <MenuItem onClick={getExcelData}>Excel</MenuItem>
              <MenuItem onClick={getCsvData}>CSV</MenuItem>
            </Menu>
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
            <div className="flex flex-row min-w-min items-center">
              <CircularProgress
                className={`${!isReviewStatusLoading ? "invisible" : "flex"}`}
                size={20}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-5 w-full">
        {isDocumentsLoading ? (
          <Stack spacing={2} className="flex flex-col grow w-full md:w-9/12">
            <Skeleton variant="rounded" height={180} className="w-full" />
            <Skeleton variant="rounded" height={180} className="w-full" />
            <Skeleton variant="rounded" height={180} className="w-full" />
          </Stack>
        ) : documents.length > 0 ? (
          <TransactionList
            documents={documents}
            riskLevel={riskLevel}
            handleTransDetails={handleNavigateToTransDetails}
            handlePagination={handlePagination}
            page={page}
            perpage={perpage}
            totalCount={totalCount}
          />
        ) : (
          <div className="font-roboto md:flex md:w-10/12">No records found!</div>
        )}

        <div className="hidden md:flex md:w-3/12 h-min shadow-xl border border-solid border-slate-300 rounded-lg">
          <div className="flex flex-col w-full p-5 h-min">
            <div className="flex flex-row font-roboto font-bold justify-between">
              {" "}
              <span className="flex">Control Exceptions</span>
              <span
                className={`cursor-pointer ${!isControlsLoading ? "flex" : "hidden"
                  }`}
                onClick={() => {
                  clearControlException();
                }}
              >
                Clear
              </span>
              <span
                className={`grow item-center justify-center ${!isControlsLoading ? "hidden" : "flex"
                  }`}
              >
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
                  if (filter.filterName === "aprules") {
                    return filter;
                  }
                })!.selected
                  ? filterConfig?.find((filter: any) => {
                    if (filter.filterName === "aprules") {
                      return filter;
                    }
                  })!.selected
                  : []
              }
              handleControlException={handleControlException}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsHome;
