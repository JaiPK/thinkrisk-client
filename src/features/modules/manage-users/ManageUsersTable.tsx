import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch } from "../../../hooks";
import { updateOtherPage } from "../app-slice/app-slice";
import "../../../App.css";

interface Props {
  rowData: Data[];
  getCheckedUserRole: any;
  setIsChecked: any;
  setIsEditUser: any;
  setOpen: any;
  setOpenAlert: any;
  setSelectedRowId: any;
  getAllUser: any;
  isCancelBtn: any;
  isChecked: any;
  status: any;
  setIsSingleDeletePopup: any;
  setDeleteUserName: any;
  setDeleteUserId: any;
  setEditedUser: any;
  setRoleName: any;
  setDeleteUserEmail: any;
  setEmail: any;
  page: any;
  perPage: any;
  onPageChange: any;
  onPerPageChange: any;
  total: any;
}

export interface Data {
  id: number;
  user: string;
  email: string;
  role: string;
  created_date: string;
  created_by: string;
  status: string;
}

export default function ManageUsersTable(props: Props) {
  const dispatch = useAppDispatch();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const columns: GridColDef[] = [
    { field: "user", headerName: "User", flex: 2 },
    { field: "email", headerName: "Email", flex: 2 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      type: "dateTime",
      flex: 2,
    },
    { field: "created_by", headerName: "Created By", sortable: false, flex: 1 },
    { field: "status", headerName: "Status", sortable: false, flex: 1 },
    {
      field: "edit",
      headerName: "Edit / Delete",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          {params.row.status !== "Deleted" && (
            <>
              <EditIcon
                sx={{ color: "gray", cursor: "pointer", marginRight: "8px"}}
                onClick={() => editUser(params)}
              />
              <DeleteIcon
                sx={{ color: "gray", cursor: "pointer" }}
                onClick={(e) => deleteUser(e, params)}
              />
            </>
          )}
        </>
      ),
    },
  ];

  const editUser = (params: any) => {
    props.setRoleName(
      params.row.role === "Audit Manager" ? "Manager" : params.row.role
    );
    props.setEditedUser(params.row.user);
    props.setEmail(params.row.email);
    props.setIsEditUser(true);
    props.setOpen(true);
    props.setIsChecked(false);
  };

  const deleteUser = (e: any, params: any) => {
    props.setDeleteUserId(params.row.id);
    props.setDeleteUserName(params.row.user);
    props.setDeleteUserEmail(params.row.email);
    props.setIsSingleDeletePopup(true);
  };

  useEffect(() => {
    dispatch(updateOtherPage(false));
    props.getCheckedUserRole(selectedRows);
  }, [selectedRows, dispatch, props]);

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={props.rowData}
        columns={columns}
        autoHeight
        checkboxSelection
        isRowSelectable={(params: GridRowParams) =>
          params.row.status === "Active"
        }
        getRowClassName={(params) =>
          params.row.status === "Deleted" ? "custom-row-class" : ""
        }
        onSelectionModelChange={(ids) => {
          const selectedIDs = new Set(ids);
          const selectedRows = props.rowData.filter((row) =>
            selectedIDs.has(row.id)
          );
          setSelectedRows(selectedRows);
          props.setSelectedRowId(ids);
          props.setIsChecked(true);
        }}
        pageSize={props.perPage}
        pagination
        paginationMode="server"
        rowCount={props.total}
        onPageChange={(newPage) => {
          props.onPageChange(newPage + 1);
        }}
        onPageSizeChange={(newPageSize) => {
          props.onPerPageChange(newPageSize);
        }}
        rowsPerPageOptions={[5, 10, 25, 100]}
      />
    </div>
  );
}