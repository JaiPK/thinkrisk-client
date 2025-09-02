import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import RequireAuth from "./features/auth/RequireAuth";
import MainContent from "./features/ui/mainContent/MainContent";
import PageNotFound from "./pages/page-not-found/PageNotFound";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import ManageUsersPage from "./pages/manage-users/ManageUsersPage";
import VerifyEmail from "./pages/verify-email/VerifyEmail";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="App">
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate replace to="/login" />}
                    />
                    <Route path="/admin/login" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/forgot-password/verify-email" element={<ForgotPassword />} />
                    <Route element={<RequireAuth />}>
                        <Route path="/home/*" element={<HomePage />}>
                            <Route path="" element={<MainContent />} />
                        </Route>
                    </Route>
                    <Route path="/manage-users" element={<ManageUsersPage />} />
                    <Route path="page-not-found" element={<PageNotFound />} />
                    <Route
                        path="*"
                        element={<Navigate to="page-not-found" />}
                    />
                </Routes>
                <ToastContainer position="bottom-right" autoClose={5000}
                    hideProgressBar newestOnTop={false}
                    closeOnClick rtl={false} pauseOnFocusLoss draggable
                    pauseOnHover theme="dark"/>
            </div>
        </LocalizationProvider>
    );
}

export default App;
