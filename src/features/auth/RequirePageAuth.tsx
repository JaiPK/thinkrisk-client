import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../store/Store";

//Used to check whether a user role has permission to access the route

export interface Props {
    allowedRoles: number[];
    tr_model?: string 
}

const RequirePageAuth = (props: Props) => {
    const routes = useSelector((state: RootState) => state.Rbac.tr_model) as string[];
    const { allowedRoles, tr_model }  = props;

    const isAllowedAccess = () => {
        let Obj = JSON.parse(localStorage.getItem("THR_USER")!);
        return allowedRoles.includes(Obj?.roleId) ||(tr_model && routes.includes(tr_model))
    };

    return isAllowedAccess() ? <Outlet /> : <Navigate to="unauthorized" />;
};

export default RequirePageAuth;
