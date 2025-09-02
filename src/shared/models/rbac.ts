export interface Rbac {
    RBACID: number;
    STATUS: number;
    TR_MODULE: string;
}

export interface Token {
    exp: number;
    iat: number;
    iss: string;
    nbf: number;
    uid: number;
    utype: string;
}
