import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Insights from "../../../features/modules/dashboard/accountsPayable/insights/Insights";
import Charts from "../../../features/modules/dashboard/accountsPayable/charts/Charts";
import Transactions from "../../../features/modules/dashboard/accountsPayable/transactions/Transactions";
import DuplicateInvoice from "../../../features/modules/dashboard/accountsPayable/duplicateInvoices/DuplicateInvoices";
import AccountsPayable from "../../../features/modules/dashboard/accountsPayable/AccountsPayable";
import GeneralLedger from "../../../features/modules/dashboard/generalLedger/GeneralLedger";

const ShowAudit = () => {
  const [clientName, setClientName] = useState("");
  const [auditName, setAuditName] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathHistory = JSON.parse(localStorage.getItem("pathHistory") ?? "{}");
    setClientName(pathHistory["audits"].client_name);
    setAuditName(pathHistory["audit"].audit_name);
  }, []);

  const navigateViaPathHistory = (key : any) => {
    const pathHistory = JSON.parse(localStorage.getItem("pathHistory") ?? "{}");
    let path = pathHistory[key];
    navigate(path.url);
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="col-span-2 m-10 mb-5 font-normal font-Releway text-base">
          <span
            onClick={() => navigateViaPathHistory("clients")}
            className="app-path inactive"
          >
            Client&nbsp;&nbsp;{">"}&nbsp;&nbsp;
          </span>
          <span
            className="app-path inactive"
            onClick={() => navigateViaPathHistory("audits")}
          >
            {`${clientName}`}
            &nbsp;&nbsp;{">"}&nbsp;&nbsp;
          </span>
          <span
            className="app-path active"
          >{`${auditName}`}</span>
        </div>
        {
          location.pathname.split("/")[2] == "ap" ? 
          <AccountsPayable /> : <GeneralLedger />
        }
      </div>
    </>
  );
};

export default ShowAudit;

const tabs = [
  { tabTitle: "Insights" },
  { tabTitle: "Charts" },
  { tabTitle: "Transactions" },
  { tabTitle: "Duplicate Invoices" },
];
