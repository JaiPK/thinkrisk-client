export interface Permissions {
    [key: string]: any;
    // AccessQueryBuilder: boolean;
    // AccountsPayable: boolean;
    // AccountsReceivables: boolean;
    // AdminJobs: boolean;
    // Analysis: boolean;
    // AuthSettings: boolean;
    // CaseManagement: boolean;
    // CaseManagementAssignTask: boolean;
    // CaseManagementCloseDeviation: boolean;
    // CaseManagementRecall: boolean;
    // CaseManagementSendManagerReview: boolean;
    // ChangePassword: boolean;
    // Configuration: boolean;
    // Dashboard: boolean;
    // GLConfiguration: boolean;
    // GLData: boolean;
    // GeneralLedger: boolean;
    // GeneralLedgerConfiguration: boolean;
    // ManageRoles: boolean;
    // ManagerUsers: boolean;
    // QueryBuilderActions: boolean;
    // RiskAnalysis: boolean;
    // RiskAnalysisAssignTask: boolean;
    // RiskAnalysisCloseDeviation: boolean;
    // TEAnalytics: boolean;
    // TECaseManagement: boolean;
    // TEConfiguration: boolean;
    // TEDashboard: boolean;
    // TEData: boolean;
    // TopDownAnalysis: boolean;
    // TopDownConfiguration: boolean;
    // TravelAndExpense: boolean;
    // ViewAllInCaseManagement: boolean;
}

export interface IUser {
    token: string;
    userId: string;
    name: string;
    email: string;
    userType: string;
    exp: number;
    ad: boolean;
    RBAC: object;
    roleId: string;
    permissions: Permissions;
    shortName: string;
}

export class User implements IUser {
    token: string;
    userId: string;
    name: string;
    email: string;
    userType: string;
    exp: number;
    ad: boolean;
    RBAC: object;
    roleId: string;
    permissions: Permissions;
    shortName: string;

    constructor(
        userorToken: IUser | string,
        userId?: string,
        name?: string,
        email?: string,
        userType?: string,
        exp?: number,
        ad?: boolean,
        RBAC?: object,
        roleId?: string,
        permissions?: Permissions,
        shortName?: string
    ) {
        if (typeof userorToken === 'string') {
            this.token = userorToken;
            this.userId = userId!;
            this.name = name!;
            this.email = email!;
            this.userType = userType!;
            this.exp = exp!;
            this.ad = ad!;
            this.RBAC = RBAC!;
            this.roleId = roleId!;
            this.permissions = permissions!;
            this.shortName = shortName!;
        } else {
            this.token = userorToken.token;
            this.userId = userorToken.userId;
            this.name = userorToken.name;
            this.email = userorToken.email;
            this.userType = userorToken.userType;
            this.exp = userorToken.exp;
            this.ad = userorToken.ad;
            this.RBAC = userorToken.RBAC;
            this.roleId = userorToken.roleId;
            this.permissions = userorToken.permissions;
            this.shortName = shortName!;
        }
    }
}

export interface AssignUser {
    ROLEID: number;
    ROLE_CODE: string;
    USERID: number;
    USER_AVATAR: string;
    USER_EMAIL_ID: string;
    USER_FIRST_NAME: string;
    USER_LAST_NAME: string;
    USER_SHORT_NAME: string;
}
