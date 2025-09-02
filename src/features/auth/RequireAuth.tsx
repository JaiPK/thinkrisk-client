import { useLocation, Navigate, Outlet } from "react-router-dom";

//Handles the validation of user token
//Authorization of the user permissions for each pages are handled separately

export const getUser = () => {
    let Obj = localStorage.getItem('THR_USER');
    return JSON.parse(Obj!);
}

export const clearLocalStorage = () => {
    localStorage.clear();
}

export const isLoggedIn = () => {
    let user = getUser();
    if (user) {
        return user.exp > Date.now() / 1000;
    } else {
        clearLocalStorage();
        return false;
    }
}

const RequireAuth = () => {
    // const { auth} = useAuth();
    const location = useLocation();
    

    return(
        // auth?.user
        isLoggedIn()
        ? <Outlet />
        : <Navigate to="/login" state={{from: location}} replace/>
    );
}

export default RequireAuth;