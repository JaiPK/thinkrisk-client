import { useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceTwoToneIcon from "@mui/icons-material/AccountBalanceTwoTone";
import { RootState } from "../../../store/Store";
import { Link } from "react-router-dom";
// import GeneralLedgerIcon from "./icons/GeneralLedgerIcon";
import GeneralLedgerIcon from "../../../assets/sidemenu-icons/General-Ledger.svg";
import AccountsPayableIcon from "../../../assets/sidemenu-icons/Accounts-Payable.svg";
import ExecutiveDashboardIcon from "../../../assets/sidemenu-icons/Executive_Dashboard.svg";
import TopDownAnalysisIcon from "../../../assets/sidemenu-icons/Risk-Analysis.svg";
import { useAppSelector } from "../../../hooks";

export interface toggleType {
    open: boolean;
}

const Sidenav = () => {
    // const [open, setOpen] = useState(true);
    let glPage = useAppSelector((state) => state.APPDataSlice.gl_page);
    let apPage = useAppSelector((state) => state.APPDataSlice.ap_page);

    const navigateToQAGL = () => {
        window.location.replace(
            "https://cloudqa.thinkrisk.ai/dashboard/gl/insights"
        );
    };
    const navigateToQAP = () => {
        window.location.replace(
            "https://cloudqa.thinkrisk.ai/dashboard/ap/insights"
        );
    };
    const open = useSelector((state: RootState) => state.toggleSideNav.open);
    return (
        <div
            className={`hidden md:flex md:flex-col bg-[#212121] text-white p-3 pt-4 font-roboto text-xs font-bold duration-300 ${
                open ? "w-36" : "w-14"
            }`}
        >
            <div className="flex flex-col sticky top-16 ">
                {/* <Link
                    to="/home/executive-dashboard"
                    className="text-white no-underline hover:text-yellow-400">
                
                    <div
                        className={`flex mb-3 ${
                            open ? "flex-row" : "flex-col"
                        }`}
                    >
                        <IconButton
                            size="medium"
                            color="inherit"
                            aria-label="menu"
                        > */}
                            {/* <HomeIcon /> */}
                            {/* <img
                                height={25}
                                width={25}
                                className="text-white"
                                src={ExecutiveDashboardIcon}
                                alt="general-ledger-logo"
                            />
                        </IconButton>
                        <div className="text-center m-auto font-thin">
                            Executive Dashboard
                        </div>
                    </div>
                </Link> */}
                <Link to="/home/gl" className={glPage ? `text-white no-underline text-yellow-400 `:`text-white no-underline hover:text-yellow-400` }>
                    <div
                        className={`flex mb-3 ${
                            open ? "flex-row" : "flex-col"
                        }`}
                        // onClick={navigateToQAGL}
                    >
                        <IconButton
                            size="medium"
                            color="inherit"
                            aria-label="menu"
                        >
                            {/* <PaidIcon /> */}
                            <img
                                height={25}
                                width={25}
                                className="text-white"
                                src={GeneralLedgerIcon}
                                alt="general-ledger-logo"
                            />
                            {/* <GeneralLedgerIcon /> */}
                        </IconButton>
                        <div className="text-center m-auto font-thin">General Ledger</div>
                    </div>
                </Link>
                <Link to="/home/ap" className={apPage ? `text-white no-underline text-yellow-400 `:`text-white no-underline hover:text-yellow-400` }>
                    <div
                        className={`flex mb-4 ${
                            open ? "flex-row" : "flex-col"
                        }`}
                        // onClick={navigateToQAP}
                    >
                        <IconButton
                            size="medium"
                            color="inherit"
                            aria-label="menu"
                        >
                            {/* <AccountBalanceTwoToneIcon /> */}
                            <img
                                height={30}
                                width={30}
                                className="text-white"
                                src={AccountsPayableIcon}
                                alt="general-ledger-logo"
                            />
                        </IconButton>
                        <div className="text-center m-auto font-thin">
                            Accounts Payable
                        </div>
                    </div>
                </Link>
                {/* <Link to="/home/top-down" className="text-white no-underline hover:text-yellow-400">
                    <div
                        className={`flex mb-4 ${
                            open ? "flex-row" : "flex-col"
                        }`}
                    >
                        <IconButton
                            size="medium"
                            color="inherit"
                            aria-label="menu"
                        > */}
                            {/* <AccountBalanceTwoToneIcon /> */}
                            {/* <img
                                height={30}
                                width={30}
                                className="text-white"
                                src={TopDownAnalysisIcon}
                                alt="general-ledger-logo"
                            />                            
                        </IconButton>
                        <div className="text-center m-auto font-thin">
                            Top Down Analysis
                        </div>
                    </div>
                </Link> */}
            </div>
        </div>
    );
};

export default Sidenav;
