import { Badge, Button, Collapse } from "@mui/material";
import {
    AccDocument,
    RiskLevel,
} from "../../../../../shared/models/records";
import { useEffect, useState } from "react";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import numberSuffixPipe from "../../../../../shared/helpers/numberSuffixPipe";
import formatDate from "../../../../../shared/helpers/dateFormatter";
export interface Props {
    documentTitle: string;
    document: AccDocument;
    riskLevel: RiskLevel;
    handleTransDetails(transId: number, document: AccDocument, riskLevel: RiskLevel): void;
}

const TransactionListCard = ({ documentTitle, document, riskLevel, handleTransDetails }: Props) => {
    const currencySymbol = localStorage.getItem("CurrencySymbol");
    const risk: string = "High";

    useEffect(() => {
        // console.log("riskLevel:", riskLevel);
        // console.log("document:", document);
        // console.log("controls:", controls);
    });

    return (
        <div className="flex flex-col w-full border font-roboto border-solid border-slate-300 rounded-md pt-5 mb-2 shadow-lg text-xs">
            <div className="flex flex-row px-5 mb-2">
                <div className="basis-1/4">
                    <div className=" text-[#b8b8b8] ">
                        {documentTitle.toUpperCase()}
                    </div>
                    <div className="font-bold text-base text-slate-700 mt-2">
                        {document?.ENTRY_ID}
                    </div>
                </div>
                <div className="basis-1/4">
                    <div className="text-[#b8b8b8] text-center">
                        INVOICE NUMBER
                    </div>
                    <div className="font-bold text-base  text-slate-700 text-center mt-2">
                        {document?.INVOICE_NUMBER}
                    </div>
                </div>
                <div className="basis-1/4">
                    <div className="text-[#b8b8b8] text-center">
                        AMOUNT
                    </div>
                    <div className="font-bold text-base  text-slate-700 text-center mt-2">
                        <span>{currencySymbol}</span> {numberSuffixPipe(document?.CREDIT_AMOUNT + document?.DEBIT_AMOUNT)}
                    </div>
                </div>
                <div className="basis-1/4">
                    <div className="text-right my-auto text-[#b8b8b8]">
                        RISK SCORE
                    </div>
                    <div className="flex justify-end mt-3">
                        <div
                            className={`rounded-lg w-12 p-2 text-center text-white font-bold ${
                                document.riskScore >=
                                riskLevel.range_high
                                    ? "bg-[#d60000]"
                                    : document.riskScore >=
                                        riskLevel.range_medium
                                    ? "bg-[#f2641a]"
                                    : document.riskScore >=
                                        riskLevel.range_low
                                    ? "bg-[#f5af2d]"
                                    : "bg-[#00A4DF]"
                            }`}
                        >
                            {document.riskScore}%
                        </div>
                    </div>

                </div>
            </div>
            <div className="px-5 mt-3">
                <div className="flex text-base text-slate-700">
                    {formatDate(document?.POSTED_DATE.split(' ')[0])}
                </div>
            </div>
            <div className="min-h-fit flex flex-row-reverse">
                <Button className="font-roboto text-slate-700" onClick={() => handleTransDetails(Number(document.ACCOUNTDOC_CODE), document, riskLevel)}>
                    <span className="flex w-full h-5 text-[#b8b8b8] rounded-full items-center justify-center">
                        <ArrowRightAltIcon
                            sx={{ fontSize: "35px" }}
                        />
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default TransactionListCard;
