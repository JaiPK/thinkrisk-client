import { TablePagination } from "@mui/material";

export interface Props {
  rowsPerPageOptions: number[];
  count: number;
  rowsPerPage: number;
  page: number;
  onPageChange(event: any, newPage: number): void;
  onRowsPerPageChange(event:any): void;
}

const TransactionDetailsPagination = ({
  rowsPerPageOptions,
  count,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange,
}: Props) => {
  return <div>
    <TablePagination
                        rowsPerPageOptions={rowsPerPageOptions}
                        component="div"
                        count={count}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={onRowsPerPageChange}
                    />
  </div>;
};

export default TransactionDetailsPagination;
