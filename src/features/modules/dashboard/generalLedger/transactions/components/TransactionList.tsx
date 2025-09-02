import {
    AccDocument,
    RiskLevel,
} from "../../../../../../shared/models/records";
import TransactionListCard from "./TransactionListCard";
import { useEffect, useState } from "react";
import { TablePagination } from "@mui/material";

export interface Props {
    documents: AccDocument[];
    riskLevel: RiskLevel;
    handleTransDetails(
        transId: any,
        document: AccDocument,
        riskLevel: RiskLevel
    ): void;
    handlePagination(page: number, perpage: number): void;
    page: number;
    perpage: number;
    totalCount: number;
}
const TransactionList = ({
    documents,
    riskLevel,
    handleTransDetails,
    handlePagination,
    page,
    perpage,
    totalCount
}: Props) => {
    const [listPage, setListPage] = useState(page);
    const [rowsPerPage, setRowsPerPage] = useState(perpage);

    const handleChangePage = (event: unknown, newPage: number) => {
        setListPage(newPage);
        handlePagination(newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setListPage(0);
        handlePagination(0,parseInt(event.target.value, 10));
    };

    useEffect(() => {
    }, [listPage, rowsPerPage]);

    return (
        <div className="flex flex-col grow w-full md:w-9/12">
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
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={listPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Items Per Page"
            />
        </div>
    );
};

export default TransactionList;
