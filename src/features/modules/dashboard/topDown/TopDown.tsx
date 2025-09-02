import { useEffect, useState } from "react";
import {
    Link,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";
import TopDownTable from "./components/TopDownTransactions"
import Transactions from "../generalLedger/transactions/Transactions";

const TopDown = () => {
    const routeArray = [
        {
            routeId: 0,
            route: "/home/top-down/financial-statement",
            tabTitle: "Financial Statement",
            active: false,
        },
        {
            routeId: 1,
            route: "/home/top-down/transactions",
            tabTitle: "Transactions",
            active: false,
        },
    ];

    const currentTab = () => {
        let path = window.location.pathname;
        if (path === "/home/top-down/financial-statement") return 0;
        else if (path === "/home/top-down/transactions") return 1;
        else return 0;
    };

    const [activeTab, setActiveTab] = useState(currentTab);
    const [activeRouteArray, setActiveRouteArray] = useState(routeArray);

    const highlightActiveTab = (tabIndex: number) => {
        activeRouteArray.forEach((route) => {
            if (tabIndex === route.routeId) {
                route.active = true;
                setActiveTab(tabIndex);
            } else {
                route.active = false;
            }
        });
        setActiveRouteArray(activeRouteArray);
    };

    useEffect(() => {
        // highlightActiveTab(activeTab);
    }, []);

    return (
        <div className="flex flex-col w-full">
            <div className="px-7 pt-7 pb-3 font-raleway font-bold">
                Top Down Analytics
            </div>
            <div className="flex flex-row pl-7">
                <ul className="flex flex-row list-none pl-0 space-x-4">
                    {activeRouteArray.map((route) => {
                        return (
                            <Link
                            to={route.route}
                                onClick={() => {
                                    highlightActiveTab(route.routeId);
                                }}
                                key={route.routeId}
                                className={`font-raleway text-sm no-underline text-black border-solid border-x-0 border-t-0 border-b-4 p-2 border-transparent cursor-pointer hover:border-gray-300 ${
                                    route.routeId === activeTab ? "border-sky-500" : ""
                                }`}
                            >
                                {route.tabTitle}
                            </Link>
                        );
                    })}
                </ul>
            </div>
            <Routes>
                <Route path="/" element={<Navigate to="financial-statement"/>}/>
                <Route path="financial-statement" element={<TopDownTable />} />
                {/* <Route path="transactions" element={<Transactions />}>
                </Route> */}
                <Route path="*" element={<Navigate to="financial-statement"/>} />
            </Routes>
        </div>
    );
};

export default TopDown;
