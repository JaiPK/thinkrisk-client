import { useEffect, useState } from "react";
import {
    Link,
    Navigate,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";
import Charts from "./charts/Charts";
import Insights from "./insights/Insights";
import Transactions from "./transactions/Transactions";
import { AccDocument, RiskLevel } from "../../../../shared/models/records";
import { useDispatch } from "react-redux";
import { useAppDispatch } from "../../../../hooks";
import { updateGLTransDetailsDrillThrough, updateGLTransDetailsDrillThroughConfig } from "./state/GLTransDetailsDrillThroughSlice";
import { updateGLPage} from "../../app-slice/app-slice";
import { updateRouteBackToInsights } from "../../gl-slice/GLSlice";
const GeneralLedger = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const appDispatch = useAppDispatch();
    const [document, setDocument] = useState<AccDocument>({
        ACCOUNTDOCID: 0,
        ACCOUNTDOC_CODE: "",
        ACCOUNT_DOC_ID: "",
        ASSIGNED_BY: null,
        ASSIGNED_TO: null,
        BLENDED_RISK_SCORE: 0,
        BLENDED_SCORE_INDEXED: 0,
        COMMENTS: 0,
        COMPANY_CODE_NAME: null,
        CONTROL_DEVIATION: null,
        CREDIT_AMOUNT: 0,
        DEBIT_AMOUNT: 0,
        DUE_DATE: "",
        ENTRY_ID: 0,
        INVOICE_DATE: "",
        INVOICE_NUMBER: "",
        ISDEVIATION: null,
        PAYMENT_DATE: "",
        POSTED_BY_NAME: null,
        POSTED_DATE: "",
        POSTED_LOCATION_NAME: "",
        REVIEWSTATUSID: 0,
        REVIEW_STATUS_CODE: "",
        SELECTED_TRANSACTIONS: null,
        SUBRSTATUSID: null,
        SUB_R_STATUS_CODE: null,
        riskScore: 0,
    });
    const [riskLevel, setRiskLevel] = useState({
        range_high: 0,
        range_low: 0,
        range_medium: 0,
    });
    const routeArray = [
        {
            routeId: 0,
            route: "insights",
            tabTitle: "Insights",
            active: false,
        },
        {
            routeId: 1,
            route: "charts",
            tabTitle: "Charts",
            active: false,
        },
        {
            routeId: 2,
            route: "transactions",
            tabTitle: "Transactions",
            active: false,
        },
    ];

    const currentTab = () => {
        let path = window.location.pathname;
        let loc = path.split("/")
        if (loc[loc.length -1] == "insights") return 0;
        else if (loc[loc.length -1] == "charts") return 1;
        else if (
            path.includes("transactions")
        )
            return 2;
        else return 0;
    };

    const [activeTab, setActiveTab] = useState(currentTab);
    const [activeRouteArray, setActiveRouteArray] = useState(routeArray);

    const highlightActiveTab = (tabIndex: number) => {
        activeRouteArray.forEach((route) => {
            if (tabIndex === route.routeId) {
                route.active = true;
                setActiveTab(tabIndex);
            } else {
                route.active = false;
            }
        });
        setActiveRouteArray(activeRouteArray);
    };

    useEffect(() => {
        // highlightActiveTab(activeTab);
        appDispatch(updateGLPage(true));
    }, []);

    const handleNavigateToTransDetails = (
        transId: any,
        document: AccDocument,
        riskLevel: RiskLevel
    ) => {
        dispatch(updateGLTransDetailsDrillThrough(true));
        dispatch(updateGLTransDetailsDrillThroughConfig({
            transId: transId,
            document: document,
            riskLevel: riskLevel
        }));
        dispatch(updateRouteBackToInsights(true));
        setDocument(document);
        setRiskLevel(riskLevel);
        highlightActiveTab(2)
        navigate(`transactions/transaction-details/${transId}`);
    };

    return (
        <div className="flex flex-col w-full">
            <div className="px-7 pt-7 pb-3 text-base font-raleway font-bold bg-[#F5F5F5]">
                General Ledger Analysis
            </div>
            <div className="flex flex-row pl-0 bg-[#F5F5F5] bb">
                <ul className="flex flex-row list-none mb-0 pl-0">
                    {activeRouteArray.map((route) => {
                        return (
                            <Link
                            to={route.route}
                                onClick={() => {
                                    highlightActiveTab(route.routeId);
                                }}
                                key={route.routeId}
                                className={`px-16 font-raleway text-sm no-underline text-black border-x-0 border-t-0 border-b-2 p-2 cursor-pointer hover:border-gray-300 ${
                                    route.routeId === activeTab ? "border-solid border-sky-500" : ""
                                }`}
                            >
                                {route.tabTitle}
                            </Link>
                        );
                    })}
                </ul>

            </div>
            <Routes>
                <Route path="/" element={<Navigate to="insights"/>}/>
                <Route path="insights" element={<Insights handleNavigateToTransDetails={
                                handleNavigateToTransDetails
                            } highlightActiveTab={highlightActiveTab} />} />

                <Route path="charts" element={<Charts highlightActiveTab={highlightActiveTab} />}>
                </Route>
                <Route path="transactions/*" element={<Transactions highlightActiveTab={highlightActiveTab}/>} />
                <Route path="*" element={<Navigate to="insights"/>} />
                
            </Routes>
        </div>
    );
};

export default GeneralLedger;
