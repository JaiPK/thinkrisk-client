import { Routes, Route, Navigate } from "react-router-dom";
import RequirePageAuth from "../../auth/RequirePageAuth";
import ExecutiveDashboard from "../../modules/dashboard/executiveDashboard/ExecutiveDashboard";
import AccountsPayable from "../../modules/dashboard/accountsPayable/AccountsPayable";
import GeneralLedger from "../../modules/dashboard/generalLedger/GeneralLedger";
import ManageRoles from "../../modules/manage-roles/ManageRoles";
import ManageUsers from "../../modules/manage-users/ManageUsers";
import SiteSettings from "../../modules/site-settings/SiteSettings";
import PageNotFound from "../../../pages/page-not-found/PageNotFound";
import Sidenav from "../sidenav/Sidenav";
import UserNotAuthorized from "../../../pages/user-not-authorized/UserNotAuthorized";
import TopDown from "../../modules/dashboard/topDown/TopDown";
//import GLCaseManagement from "../../../pages/gl-case-management/CaseManagement";
//import APCaseManagement from "../../../pages/ap-case-management/CaseManagement";
import GLCaseManagement from "../../modules/case-management/gl-case-management/GLCaseManagement";
import APCaseManagement from "../../modules/case-management/ap-case-management/APCaseManagement";
import SpreadSheet from "../../modules/dataonboarding/SpreadSheet/SpreadSheet";
import DataConfig from "../../modules/dataonboarding/SpreadSheet/Components/DataConfig";
import APSpreadSheet from "../../modules/dataonboarding/APSpreadSheet/SpreadSheet";
import VersionHistory from "../../modules/configuration/components/VersionHistory";
import GlConfigurationTab from "../../modules/configuration/GlConfigurationTab";
import ApConfigurationTab from "../../modules/configuration/ApConfigurationTab";
import ManagementTable from "../../modules/dataonboarding/JobManagementTable";
import GLConfiguration from "../../modules/configuration/components/GLConfiguration";
import ClientManagement from "../../../pages/clinet-management/ClientManagement";
import ShowAllClients from "../../../pages/all-clients/ShowAllClients";
import AssignUsers from "../../../pages/clinet-management/Assign-Users/AssignUsers";
import AuditManagement from "../../../pages/audit-management/AuditManagement";
import ShowAudit from "../../../pages/audit-management/show-audit/ShowAudit";
import HistoricalMgmt from "../../../pages/audit-management/historical-mgmt/HistoricalMgmt";
const MainContent = () => {
  // const navigate = useNavigate();
  // const navigateToPageNotFound = () => {
  //     navigate("/page-not-found");
  // };
  return (
    <div className="flex mt-12">
      <Sidenav />
      <div className="flex flex-col w-full min-h-screen">
        <Routes>
          <Route path="" element={<Navigate to="ap" />}></Route>
          {/* <Route path="/gl" element={<Navigate to="gl/*" />}></Route> */}

          {
            //The allowedRoles array contains the roleIds that are
            //allowed to access the routes
          }

          {
            //Executive Dashboard
          }
          {/* <Route
                        element={
                            <RequirePageAuth allowedRoles={[1, 2, 3, 4, 5]} />
                        }
                    >
                        <Route
                            path="executive-dashboard"
                            element={<ExecutiveDashboard />}
                        ></Route>
                    </Route> */}

          {
            //GL
          }
          {/* <Route
                        element={
                            <RequirePageAuth allowedRoles={[1, 2, 3, 4, 5]} />
                        }
                    >
                        <Route path="gl/*" element={<GeneralLedger />}></Route>
                    </Route> */}

          <Route path="/gl">
            <Route path="" element={<Navigate to="clients" />}></Route>
            <Route path="clients">
              <Route path="" element={<ShowAllClients />}></Route>
              <Route path="audits" element={<AuditManagement/>}/>
              <Route path="audits/audit/*" element={<ShowAudit/>}/>
            </Route>
          </Route>

          <Route path="/ap">
            <Route path="" element={<Navigate to="clients" />}></Route>
            <Route path="clients">
              <Route path="" element={<ShowAllClients />}></Route>
              <Route path="hist-data/management" element={<HistoricalMgmt/>}/>
              <Route path="audits" element={<AuditManagement/>}/>
              <Route path="audits/audit/*" element={<ShowAudit />}>
                {/* <Route path=""  element={<Navigate to="insights" />} />
                        <Route path="insights" element={<AccountsPayable />}/> */}
              </Route>
            </Route>
          </Route>

          {/* <Route path="/ap" element={<Navigate to="clients" />}></Route>
            <Route element={<RequirePageAuth allowedRoles={[1, 2, 3, 4, 5]} />}>
                <Route path="gl/clients" element={<ShowAllClients />} />
                <Route path="ap/clients" element={<ShowAllClients />} />
            </Route>
            <Route  element={<RequirePageAuth allowedRoles={[1, 2, 3, 4, 5]} />}>
                <Route path="gl/clients/audits" element={<AuditManagement/>}/>
            </Route>
            <Route  element={<RequirePageAuth allowedRoles={[1, 2, 3, 4, 5]} />}>
                <Route path="clients/audits/audit" element={<ShowAudit/>}/>
            </Route> */}

          {
            //AP
          }
          {/* <Route element={<RequirePageAuth allowedRoles={[1, 2, 3, 4, 5]} />}>
            <Route path="ap/*" element={<AccountsPayable />} />
          </Route>  */}
          {
            //Vendor Master
          }
          {/* <Route
                        element={
                            <RequirePageAuth allowedRoles={[1, 2, 3, 4, 5]} />
                        }
                    >
                        <Route
                            path="vendor-master/*"
                            element={<AccountsPayable />}
                        />
                    </Route> */}
          {
            //Cdocs
          }
          {/* <Route
                        element={
                            <RequirePageAuth allowedRoles={[1, 2, 3, 4, 5]} />
                        }
                    >
                        <Route path="cdocz/*" element={<AccountsPayable />} />
                    </Route> */}
          {
            //Top-Down
          }
          {/* <Route
                        element={
                            <RequirePageAuth allowedRoles={[1, 2, 3, 4, 5]} />
                        }
                    >
                        <Route path="top-down/*" element={<TopDown />} />
                    </Route> */}
          {
            //Admin Pages
          }
          <Route element={<RequirePageAuth allowedRoles={[1, 2]}  tr_model={"ManagerUsers"}/>}>
            <Route path="manage-users" element={<ManageUsers />} />
          </Route>
          <Route  element={<RequirePageAuth allowedRoles={[1]} />}>
            <Route path="manage-clients" element={<ClientManagement />} />
          </Route>
          <Route  element={<RequirePageAuth allowedRoles={[1]} />}>
              <Route path="manage-clients/assign-clients" element={<AssignUsers/>} />
          </Route>

          <Route element={<RequirePageAuth allowedRoles={[1]} />}>
            <Route path="manage-roles" element={<ManageRoles />} />
          </Route>

          <Route element={<RequirePageAuth allowedRoles={[1, 2]} />}>
            <Route
              path="site-settings"
              element={<SiteSettings />}
            />
          </Route>
          <Route element={<RequirePageAuth allowedRoles={[1, 2, 3, 4, 5]} tr_model="GeneralLedgerConfiguration " />}>
            <Route
              path="configurations/gl/*"
              element={<GlConfigurationTab />}
            />
          </Route>
          <Route element={<RequirePageAuth allowedRoles={[1, 2, 3, 4, 5]} tr_model="Configuration" />}>
            <Route
              path="configurations/ap/*"
              element={<ApConfigurationTab />}
            />
          </Route>
          {/* <Route element={<RequirePageAuth allowedRoles={[1, 2]} />}>
                        <Route
                            path="configurations/*"
                            element={<Configuration />}
                        />
                    </Route> */}
          <Route
            element={
              <RequirePageAuth allowedRoles={[]} tr_model="CaseManagement " />
            }
          >
            <Route
              path="gl-case-management"
              element={<GLCaseManagement />}
            />
          </Route>
          <Route
            element={
              <RequirePageAuth allowedRoles={[1, 2, 3, 4, 5]} tr_model="CaseManagement "/>
            }
          >
            <Route
              path="ap-case-management"
              element={<APCaseManagement />}
            />
          </Route>
          <Route
            path="unauthorized"
            element={<UserNotAuthorized />}
          />

          <Route path="*" element={<PageNotFound />} />
          <Route element={<RequirePageAuth allowedRoles={[1, 2]} />}>
            <Route
              path="gl-transactions-data-onboarding"
              element={<SpreadSheet />}
            />
          </Route>
          <Route element={<RequirePageAuth allowedRoles={[1, 2]} />}>
            <Route
              path="ap-transactions-data-onboarding"
              element={<APSpreadSheet />}
            />
          </Route>
          <Route element={<RequirePageAuth allowedRoles={[1, 2]} />}>
            <Route
              path="gl-transactions-data-onboarding-dataconfig"
              element={<DataConfig />}
            />
          </Route>
          <Route element={<RequirePageAuth allowedRoles={[1, 2]} />}>
            <Route
              path="gl-transactions-data-onboarding-management-table"
              element={<ManagementTable name='gl' />}
            />
          </Route>
          <Route element={<RequirePageAuth allowedRoles={[1, 2]} />}>
            <Route
              path="ap-transactions-data-onboarding-management-table"
              element={<ManagementTable  name='ap'/>}
            />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default MainContent;
