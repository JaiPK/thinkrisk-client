
import {
    Link,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import GLConfiguration from "./components/GLConfiguration";
import APConfiguration from "./components/APConfiguration";
import VersionHistory from "./components/VersionHistory";

import React, { useState } from "react";
import { CircularProgress } from "@mui/material";

const ApConfigurationTab = () => {

    const routeArray = [
        {
            routeId: 0,
            route: "/home/configurations/ap/config",
            tabTitle: "Configuration",
            active: false,
        },
        {
            routeId: 1,
            route: "/home/configurations/ap/version_history",
            tabTitle: "Version History",
            active: false,
        },
    ];
    const currentTab = () => {
        let path = window.location.pathname;
        if (path === "/home/configurations/ap/config") return 0;
        else if (path === "/home/configurations/ap/version_history") return 1;
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
    return (
        <div className="flex flex-col w-full">
            <div className="px-7 pt-7 pb-3 text-base font-raleway font-bold bg-[#F5F5F5]">
                AP Configuration
            </div>
            <div className="flex flex-row pl-0 bg-[#F5F5F5] bb">
                <ul className="flex flex-row list-none mb-0 pl-0">
                    {activeRouteArray.map((route) => {
                        return (
                            <Link
                                to={route.route}
                                onClick={() => {
                                    highlightActiveTab(route.routeId);
                                }}
                                key={route.routeId}
                                className={`px-16 font-raleway text-sm no-underline text-black border-x-0 border-t-0 border-b-2 p-2 cursor-pointer hover:border-gray-300 ${route.routeId === activeTab ? "border-solid border-sky-500" : ""
                                    }`}
                            >
                                {route.tabTitle}
                            </Link>
                        );
                    })}
                </ul>

            </div>
            <Routes>
                <Route path="/" element={<Navigate to="config" />} />
                <Route path="config" element={<APConfiguration />} />
                <Route path="version_history" element={<VersionHistory name='ap' />}>
                </Route>
                <Route path="*" element={<Navigate to="config" />} />

            </Routes>

        </div>
    );
};

export default ApConfigurationTab;

