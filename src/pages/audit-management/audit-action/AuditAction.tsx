import React, { useState, useEffect, useRef } from "react";
import "./FileInput.css";
import AuditManagement from "../AuditManagement";
import ApAuditConfiguration from "./ApAuditConfiguration";
import axios from "../../../api/axios";
import { CircularProgress } from "@mui/material";
import { getPath } from "../../../shared/helpers/getPath";
import GlAuditConfiguration from "./GlAuditConfiguration";
import { SelectPicker } from 'rsuite';
import { DateRangePicker } from "rsuite";
interface SharedFunctionProps {
  auditId: any;
  clientId: any;
}
interface DateRangePickerValue {
  startDate: any;
  endDate: any;
}
const AuditAction: React.FC<SharedFunctionProps> = ({ auditId, clientId }) => {
  const [showAuditMgmt, setShowAuditMgmt] = useState<boolean>(false);
  const [auditName, setAuditName] = useState("");
  const configRef: any = useRef(null);
  const [isSumbit, setIsSubmit] = useState(false);
  const [erp, setErp] = useState([]) as any[];
  const [currentErp, setCurrentErp] = useState({}) as any;

  const [months, setMonths] = useState(Array.from({ length: 13 }, (_, i) => ({ label: `${i}`, value: i + 1 })));
  const [years, setYears] = useState(Array.from({ length: 10 }, (_, i) => ({ label: `${i}`, value: i + 1 })));
  const [selectedYear, setSelectedYear] = useState(null) as any;
  const [selectedMonth, setSelectedMonth] = useState(null) as any;

  const { after } = DateRangePicker;
  const [selectedDateRange, setSelectedDateRange] =
    useState<DateRangePickerValue>({
      startDate: undefined,
      endDate: undefined,
    });
  const [historicalDateRange, setHistoricalDateRange] =
    useState<DateRangePickerValue>({
      startDate: undefined,
      endDate: undefined,
    });

  const handleResizeObserverError = () => {
    const resizeObserverErrDiv = document.getElementById('webpack-dev-server-client-overlay');
    if (resizeObserverErrDiv) {
      resizeObserverErrDiv.remove();
    }
  };

  window.addEventListener('error', (event) => {
    if (event.message === 'ResizeObserver loop completed with undelivered notifications.') {
      handleResizeObserverError();
    }
  });


  useEffect(() => {
    if (auditId) {
      getAudit();
    }
    getErpData();
  }, []);

  const getAudit = async () => {
    try {
      const response = await axios.get(
        `v1/client/${clientId}/audit/${auditId}`,
        {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        }
      );
      let audit = response.data.data.audit;
      if (audit) {
        setAuditName(audit.audit_name);
        setCurrentErp(audit.erp_id);
        setSelectedDateRange(
          {
            startDate: audit.audit_start_date,
            endDate: audit.audit_end_date,
          }
        )
        setHistoricalDateRange(
          {
            startDate: audit.hist_data_start_date,
            endDate: audit.hist_data_end_date,
          }
        )
      }
    } catch (error) {
      console.log(error);
    }
  };

  //handle Erp changes
  let erpdata: { [key: string]: Object }[] = [];
  const handleErpDropdownChange = (e: any) => {
    setCurrentErp(e);
  };

  //get ERP data
  const getErpData = async () => {
    try {
      const response = await axios.get(`v1/client/${clientId}`, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      if (response.data.erp_data) {
        response.data.erp_data.map((value: any) => {
          erpdata.push({ value: value.erp_id, label: value.erp_name });
        });
      }
      setErp(erpdata);
      setCurrentErp(erpdata.find((erp: any) => erp.value === currentErp)?.erp_name || "");
    } catch (error) {
      console.log(error);
    }
  }

  const handleAuditAction = async () => {
    try {
      setIsSubmit(true);
      const configData = await configRef.current.getConfigData();


      let historicalDate = {
        hist_data_start_date: null,
        hist_data_end_date: null
      }

      if (historicalDateRange.startDate && historicalDateRange.endDate) {
        historicalDate = {
          hist_data_start_date: historicalDateRange.startDate,
          hist_data_end_date: historicalDateRange.endDate
        }
      }
      else if (selectedYear || selectedMonth) {
        const endDate : any = new Date(selectedDateRange.startDate);
        const startDate : any = new Date(endDate);
        startDate.setFullYear(startDate.getFullYear() - selectedYear);
        startDate.setMonth(startDate.getMonth() - selectedMonth);
        historicalDate = {
          hist_data_start_date: startDate,
          hist_data_end_date: endDate
        }
      }
      const AuditformData = {
        audit_name: auditName,
        call_list_id: getPath.callListID(),
        configdata: configData,
        erp_id: currentErp,
        audit_start_date: selectedDateRange.startDate,
        audit_end_date: selectedDateRange.endDate,
        hist_data_start_date: historicalDate.hist_data_start_date,
        hist_data_end_date: historicalDate.hist_data_end_date,
      };
      if (!auditId) {
        const response = await axios.post(
          `v1/client/${clientId}/audit`,
          AuditformData,
          {
            headers: {
              Authorization: localStorage.getItem("TR_Token") as string,
            },
          }
        );
        setIsSubmit(false);
        setShowAuditMgmt(true);
      }
      else {
        const response = await axios.patch(
          `v1/client/${clientId}/audit/${auditId}`,
          AuditformData,
          {
            headers: {
              Authorization: localStorage.getItem("TR_Token") as string,
            },
          }
        );
        setIsSubmit(false);
        setShowAuditMgmt(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateRangeFilter = (value: any) => {
    let startDate: any = createDateString(value?.length ? value[0] : null);
    let endDate: any = createDateString(value?.length ? value[1] : null);
    setSelectedDateRange(
      {
        startDate: startDate,
        endDate: endDate,
      }
    );
  }

  const handleHistoricalDateRangeFilter = (value: any) => {
    let startDate: any = createDateString(value?.length ? value[0] : null);
    let endDate: any = createDateString(value?.length ? value[1] : null);
    setHistoricalDateRange(
      {
        startDate: startDate,
        endDate: endDate,
      }
    );
  }

  const createDateString = (date: any) => {
    if (date) {
      let month = date.getMonth() + 1; //months from 1-12
      let day = date.getDate();
      let year = date.getFullYear();

      let dateString = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day
        }`;
      return dateString;
    }
    return null;
  };

  return (
    <div>
      {!showAuditMgmt && (
        <>
          <div className="container m-8 w-auto">
            <style jsx>{`
              .no-focus-border:focus {
                outline: none;
                border: none;
                border-bottom: 2px solid green;
              }
            `}</style>
            <div className="grid grid-cols-3">
              <div
                className="col-span-3 font-normal font-sans text-base"
                style={{
                  fontSize: "16px",
                  fontFamily: "Raleway",
                  fontWeight: 500,
                }}
              >
                {auditId ? "Edit Audit" : "Create New Audit"}
              </div>
              <div className="col-span-1 flex justify-start">
                <input
                  type="text"
                  name=""
                  id=""
                  value={auditName || ""}
                  placeholder="Audit Name"
                  className="w-9/12 border-0 border-b border-black no-focus-border pt-4 pb-1 pl-0"
                  style={{
                    fontSize: "16px",
                    fontFamily: "Raleway",
                    fontWeight: 500,
                  }}
                  onChange={(e) => {
                    setAuditName(e.target.value);
                  }}
                  required
                />
              </div>
            </div>
            <div className="flex w-full mt-[24px] mb-[48px] flex-col gap-8">
              <div className="flex flex-col w-full gap-[12px]">
                <label
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: 400,
                    fontSize: "16px",
                  }}
                >
                  Audit ERP System
                </label>
                <SelectPicker
                  className="custom-audit-dropdown"
                  data={erp}
                  searchable={false}
                  onChange={handleErpDropdownChange}
                  style={{ width: 300 }}
                  placeholder="Select ERP"
                  value={currentErp}
                />
              </div>
              <div className="flex flex-col w-full gap-[12px]">
                <label
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: 400,
                    fontSize: "16px",
                  }}
                >
                  Audit Date
                </label>
                <div className="audit_dateRange flex items-end">
                  <DateRangePicker
                    className="custom-date-range"
                    label=""
                    placeholder="Select Audit Date Range"
                    size="md"
                    onChange={(value) => handleDateRangeFilter(value)}
                    style={{ width: 300, height: "100%", backgroundColor: "white", fontFamily: "Roboto", color: "black" }}
                    gap-10
                    format="yyyy-MM-dd"
                    placement="bottomStart"
                    value={
                      selectedDateRange.startDate && selectedDateRange.endDate
                        ? [new Date(selectedDateRange.startDate), new Date(selectedDateRange.endDate)]
                        : null
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col w-full gap-[12px]">
                <label
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: 400,
                    fontSize: "16px",
                  }}
                >
                  Historical Date <em>(Optional)</em>
                </label>
                <div className="audit_dateRange flex items-center gap-6">
                  <DateRangePicker
                    className="custom-date-range"
                    label=""
                    placeholder="Select Historical Date Range"
                    size="md"
                    shouldDisableDate={(date) => {
                      if (!selectedDateRange.endDate) return false;
                      const selectedEnd = new Date(selectedDateRange.endDate);
                      selectedEnd.setHours(0, 0, 0, 0);
                      const d = new Date(date);
                      d.setHours(0, 0, 0, 0);
                      return d > selectedEnd;
                    }}
                    onChange={(value) => handleHistoricalDateRangeFilter(value)}
                    style={{ width: 300, height: "100%", backgroundColor: "white", fontFamily: "Roboto", color: "black" }}
                    gap-10
                    format="yyyy-MM-dd"
                    placement="bottomStart"
                    value={
                      historicalDateRange.startDate && historicalDateRange.endDate
                        ? [new Date(historicalDateRange.startDate), new Date(historicalDateRange.endDate)]
                        : null
                    }
                  />
                  <div className="">(OR)</div>
                  <div className="flex gap-4" style={{ marginTop: '-32px' }}>
                    <div className="flex-col flex gap-2">
                      <label
                        style={{
                          fontFamily: "Roboto",
                          fontWeight: 400,
                          fontSize: "14px",
                        }}
                      >
                        No of Last Years
                      </label>
                      <SelectPicker
                        className="custom-audit-dropdown"
                        data={years}
                        searchable={false}
                        onChange={(e) => setSelectedYear(e)}
                        style={{ width: 175 }}
                        placeholder="Select Years"
                        value={selectedYear}
                        placement="bottomStart"
                      />
                    </div>
                    <div className="flex-col flex gap-2">
                      <label
                        style={{
                          fontFamily: "Roboto",
                          fontWeight: 400,
                          fontSize: "14px",
                        }}
                      >
                        No of Last Months
                      </label>
                      <SelectPicker
                        className="custom-audit-dropdown"
                        data={months}
                        searchable={false}
                        onChange={(e) => setSelectedMonth(e)}
                        style={{ width: 175 }}
                        placeholder="Select Months"
                        value={selectedMonth}
                        placement="bottomStart"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="custom-config" style={{ marginLeft: '-12px' }}>
              {getPath.callListID() === 1 ? (
                <ApAuditConfiguration
                  ref={configRef}
                  auditId={auditId ? auditId : ""}
                  clientId={clientId}
                />
              ) : (
                <GlAuditConfiguration
                  ref={configRef}
                  auditId={auditId ? auditId : ""}
                  clientId={clientId}
                />
              )}
            </div>
          </div>
          <div className="col-span-2 dropDown1 mt-10 mb-5 flex  gap-3 items-center">
          </div>
          <div
            className="relative bottom-0 right-0 m-4"
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              className="bg-transparent py-1 px-4 rounded border-none cursor-pointer"
              disabled={isSumbit}
              onClick={() => {
                setShowAuditMgmt(true);
              }}
              style={{
                fontSize: "16px",
                fontWeight: 400,
                color: "#1565C0",
              }}
            >
              Cancel
            </button>
            <button
              disabled={isSumbit || !auditName}
              className="bg-transparent py-2 px-4 rounded border-none ml-2 cursor-pointer"
              onClick={handleAuditAction}
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#1565C0",
                display: "flex",
                alignItems: "center",
              }}
            >
              {
                isSumbit && <CircularProgress
              style={{ color: " rgb(116, 187, 251)" , marginRight: "10px"}}
                  size={20}
                  color="secondary"
                />
              }
              { isSumbit? 'Submitting': "Submit" }
            </button>
          </div>
        </>
      )}
      {showAuditMgmt && <AuditManagement />}
    </div>
  );
};

export default AuditAction;
