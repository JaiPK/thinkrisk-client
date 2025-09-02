import { createContext, ReactNode, useState } from "react";
import { Permissions, User } from "../../shared/models/user";
import jwt_decode from 'jwt-decode';
import { Rbac, Token } from "../../shared/models/rbac";
import getSymbolFromCurrency from 'currency-symbol-map'

interface Props {
    children?: ReactNode
}

const AuthContext = createContext({ auth: {}, setAuth: (auth: any) => { }, storeToken: (token: string) => { }, storeUser: (res: any, ad: boolean) => { }, getUser: () => User, isLoggedIn: () => { }, getToken: () => { } });

export const AuthProvider = ({ children }: Props) => {
    const [auth, setAuth] = useState(false);
    // const [user, setUser] = useState({});

    const storeUser = (res: any, ad: boolean) => {
        let permissions: Permissions = {};
        res.data.User.RBAC.forEach((element: Rbac) => {
            permissions[element.TR_MODULE] = element.STATUS === 1 ? true : false;
        });
        let Expiry: Token = jwt_decode(res.data.Token);
        let user = new User(
            res.data.Token,
            res.data.User.UserID,
            res.data.User.Name,
            res.data.User.Email,
            res.data.User.Usertype,
            Expiry.exp,
            ad,
            res.data.User.RBAC,
            res.data.User.ROLEID,
            permissions,
            res.data.User.ShortName
        );
        storeToken(res.data.Token);
        localStorage.setItem("CurrencyCode", res.data.User.Currency ? res.data.User.Currency : '');
        let currSymbol = getSymbolFromCurrency(res.data.User.Currency);
        localStorage.setItem("CurrencySymbol", currSymbol ? currSymbol : '');
        let month = res.data.User.FinYearMonth
        localStorage.setItem("Month", month ? month : '');
        // localStorage.setItem("FinYearMonth", res.data.User.FinYearMonth);
        localStorage.setItem('THR_USER', JSON.stringify(user));
        let chartOfAccHLimit = res.data.User.chartOfAccHLimit
        localStorage.setItem("chartOfAccHLimit", chartOfAccHLimit ? chartOfAccHLimit : 5);
    }

    const getUser = () => {
        let Obj = localStorage.getItem('THR_USER');
        return JSON.parse(Obj ?? '');
    }

    const storeToken = (token: string) => {
        localStorage.setItem("TR_Token", token);
    }

    const getToken = () => {
        return localStorage.getItem('TR_Token');
    }

    const isLoggedIn = () => {
        let user = getUser();
        if (user) {
            return user.exp > Date.now() / 1000;
        } else {
            return false;
        }
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, storeToken, storeUser, getUser, isLoggedIn, getToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;