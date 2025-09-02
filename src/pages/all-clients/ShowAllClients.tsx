import React, { useState, useEffect } from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress, Stack, TextField } from "@mui/material";

import axios from "../../api/axios";
import { updateAPPage, updateGLPage } from "../../features/modules/app-slice/app-slice";
import { useAppDispatch } from "../../hooks";
import { updateWorkflow } from "../../features/modules/gl-slice/GLSlice";

const GET_CLIENTS = "v1/user/clients";
const GET_REVIEW_STATUS_CODE_URL = "v1/je/workflowstatus";

function ShowAllClients() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [clients, setClients] = useState<GridRowsProp>([]);
  const [backupClients, setBackupClients] = useState<GridRowsProp>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch( location.pathname.includes('gl') ? updateGLPage(true) : dispatch(updateAPPage(true)));
    getClients();
    const pathHistory = JSON.parse(localStorage.getItem("pathHistory") ?? "{}");
    pathHistory["clients"] = {
        label: "Client",
        id: "",
        url: location.pathname,
    }
    localStorage.setItem("pathHistory", JSON.stringify(pathHistory));
    getWorkFlowStatus();
  }, []);

  const getWorkFlowStatus = async () => {
    try {
        let formData = new FormData();
        formData.append("module", location.pathname.split("/")[2]);

        const reviewStatusArray = await axios.post(
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

                reviewStatObj.push(status);
            });
            dispatch(updateWorkflow([...reviewStatObj]));


        }
    } catch (error: any) {
        if (error.response.status === 401) {
            localStorage.clear();
            navigate("/login");
        }
    }
  };

  const getClients = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append("module", location.pathname.split("/")[2]);
      const response = await axios.get(`${GET_CLIENTS}?${queryParams.toString()}`, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      if (response.status === 200) {
        let responseClients = response.data.data.map((value: any) => ({
          ...value,
          id: value.client_id,
          is_active: value.is_active ? "Active" : "Inactive",
        }));
        setClients(responseClients);
        setBackupClients(responseClients);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toLowerCase();
    setClients(
      value
        ? backupClients.filter((row: any) =>
            row.client_name.toLowerCase().includes(value)
          )
        : backupClients
    );
  };

  const onClientSelect = (params: any) => {
    if (params.row.is_active == "Active"){
      const pathHistory = JSON.parse(localStorage.getItem("pathHistory") ?? '{}');
      pathHistory["audits"] = {
          client_name: params.row.client_name,
          client_id: params.id,
          url: location.pathname + "/audits",
      }
      localStorage.setItem("pathHistory", JSON.stringify(pathHistory));
      navigate("audits");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", hide: true },
    {
      field: "client_name",
      headerName: "Client",
      flex: 2,
      sortable: false,
      headerClassName: "font-medium font-roboto text-base text-black"
    },
    {
      field: "created_at",
      headerName: "Created Date",
      flex: 2,
      sortable: false,
      headerClassName: "font-medium font-roboto text-base text-black",
    },
    {
      field: "created_by",
      headerName: "Created By",
      flex: 2,
      sortable: false,
      headerClassName: "font-medium font-roboto text-base text-black",
    },
    {
      field: "data_path",
      headerName: "Data Path",
      flex: 2,
      sortable: false,
      headerClassName: "font-medium font-roboto text-base text-black",
    },
    {
      field: "total_audits",
      headerName: "Number of Audits",
      flex: 2,
      sortable: false,
      headerClassName: "font-medium font-roboto text-base text-black",
    },
    {
      field: "ongoing_audits",
      headerName: "Ongoing Audits",
      flex: 2,
      sortable: false,
      headerClassName: "font-medium font-roboto text-base text-black",
    },
    {
      field: "is_active",
      headerName: "Status",
      flex: 2,
      sortable: false,
      headerClassName: "font-medium font-roboto text-base text-black",
    },
  ];

  return (
    <div className=" m-10 all-user-container">
      <style jsx>{`
        .no-focus-border:focus {
          outline: none;
          border: none;
          border-bottom: 2px solid green;
        }
        .tableCell {
          border-right: 1px solid #8c8c8c;
        }
        .MuiDataGrid-cell {
          cursor: pointer;
        }
        .MuiDataGrid-cellContent {
          font-size: 1rem !important;
        }
      `}</style>
      <div className="grid md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2 app-path active">
          Clients{" "}
          <span
           className="app-path active"
          >
          </span>
        </div>
        <Stack spacing={2} direction="row" className="col-start-1">
            <TextField id="standard-basic" sx={{ width: '100%' }} onChange={(e: any) => handleSearch(e)} label="Search Clients" placeholder="Search by name" variant="standard" />
        </Stack>

        <div
          className="col-span-2 lg:col-span-3 mt-8 rounded overflow-x-auto"
          style={{
            fontFamily: "Roboto",
            position: "relative",
          }}
          id="tableContainer"
        >
          {isLoading && (
            <div
              style={{
                position: "absolute",
                top: "65%",
                left: "50%",
                transform: "translate(-50%, -55%)",
              }}
            >
              <CircularProgress size={24} />
            </div>
          )}
          <DataGrid
            rows={clients}
            localeText={{ noRowsLabel: isLoading? "" : "No Clients" }}
            autoHeight
            columns={columns}
            hideFooter
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            disableDensitySelector
            disableExtendRowFullWidth
            disableSelectionOnClick
            disableVirtualization
            disableIgnoreModificationsIfProcessingProps
            onRowClick={onClientSelect}
            sx={{
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ShowAllClients;
