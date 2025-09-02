import { Button } from "@mui/material";
import {
    AccDocument,
    RiskLevel,
} from "../../../../../shared/models/records";
import { useEffect } from "react";
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

    useEffect(() => {
    });

    return (
        <div className="flex flex-col w-full border font-roboto border-solid border-slate-300 rounded-md pt-5 mb-2 shadow-lg text-xs">
            <div className="flex flex-row px-5 mb-2 align-middle">
                <div className="basis-1/3">
                    <div className=" text-[#b8b8b8] ">
                        {documentTitle.toUpperCase()}
                    </div>
                    <div className="font-bold text-base text-slate-700 mt-2">
                        {document?.ACCOUNTDOC_CODE}
                    </div>
                </div>
                <div className="basis-1/3">
                    <div className="text-[#b8b8b8] text-center">
                        AMOUNT
                    </div>
                    <div className="font-bold text-base  text-slate-700 text-center mt-2">
                        <span>{currencySymbol}</span>{numberSuffixPipe(document?.CREDIT_AMOUNT)}
                    </div>
                </div>
                <div className="basis-1/3">
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
            <div className="block px-5 mb-2 align-middle w-auto table">
                <div className="w-11/12 text-base text-slate-700 table-cell">
                    {formatDate(document?.POSTED_DATE.split(' ')[0])}
                </div>
                <div className="w-1/12 table-cell align-right">
                <Button className="font-roboto text-slate-700 " onClick={() => handleTransDetails(Number(document.ACCOUNTDOC_CODE), document, riskLevel)}>
                    <span className="flex w-full h-5 text-[#b8b8b8] rounded-full items-center justify-center">
                        <ArrowRightAltIcon
                            sx={{ fontSize: "35px" }}
                        />
                    </span>
                </Button>
            </div>
            </div>
            
        </div>
    );
};

export default TransactionListCard;
