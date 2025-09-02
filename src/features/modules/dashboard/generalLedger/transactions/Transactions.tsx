import { Route, Routes, useNavigate } from "react-router-dom";
import TransactionsHome from "./components/TransactionsHome";
import TransactionDetails from "./components/TransactionDetails";
import { AccDocument, RiskLevel } from "../../../../../shared/models/records";
import { useState } from "react";
import { useAppSelector } from "../../../../../hooks";

export interface Props{
    highlightActiveTab(tabIndex: number): void;
};

const Transactions = ({highlightActiveTab}:Props) => {
    // const id = "1234";
    let riskLevels = useAppSelector((state) => state.GLDataSlice.risk_level);
    const navigate = useNavigate();
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
    const [riskLevel, setRiskLevel] = useState(riskLevels);
    const handleNavigateToTransDetails = (
        transId: number,
        document: AccDocument,
        riskLevel: RiskLevel
    ) => {
        setDocument(document);
        setRiskLevel(riskLevel);
        navigate(`transaction-details/${transId}`);
    };
    return (
        <div className="w-full">
            {/* <Link to="/home/gl/transactions">Transactions Home</Link>
            <Link to={`/home/gl/transactions/transaction-details/${id}`}>
                Transaction Details
            </Link> */}
            <Routes>
                <Route
                    path="/"
                    element={
                        <TransactionsHome
                            handleNavigateToTransDetails={
                                handleNavigateToTransDetails
                            }
                            highlightActiveTab={highlightActiveTab}
                        />
                    }
                />
                <Route
                    path={`transaction-details/:id`}
                    element={<TransactionDetails document={document} riskLevelData={riskLevel}
                    highlightActiveTab={highlightActiveTab}/>}
                />
            </Routes>
        </div>
    );
};

export default Transactions;
