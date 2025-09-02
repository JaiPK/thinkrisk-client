import {
    AccDocument,
    RiskLevel,
} from "../../../../../shared/models/records";
import TransactionListCard from "./TransactionListCard";

export interface Props {
    documents: AccDocument[];
    riskLevel: RiskLevel;
    handleTransDetails(
        transId: number,
        document: AccDocument,
        riskLevel: RiskLevel
    ): void;
}
const TransactionList = ({
    documents,
    riskLevel,
    handleTransDetails,
}: Props) => {



    return (
        <div className="flex flex-col grow w-full">
            {documents.map((record) => {
                return (
                    <TransactionListCard
                        documentTitle={"Accounting Document"}
                        document={record}
                        riskLevel={riskLevel}
                        key={record?.ACCOUNTDOC_CODE}
                        handleTransDetails={handleTransDetails}
                    />
                );
            })}
        </div>
    );
};

export default TransactionList;
