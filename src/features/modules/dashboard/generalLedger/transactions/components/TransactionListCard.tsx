import {
    Avatar,
    Badge,
    Box,
    Button,
    Collapse,
    Typography,
} from "@mui/material";
import {
    AccDocument,
    RiskLevel,
} from "../../../../../../shared/models/records";
import ForumIcon from "@mui/icons-material/Forum";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import Divider from "@mui/material/Divider";
import { useEffect, useState } from "react";
import CommentsPopOver from "../../../../../../shared/ui/pop-overs/CommentsPopOver";
import axios from "../../../../../../api/axios";
export interface Props {
    documentTitle: string;
    document: AccDocument;
    riskLevel: RiskLevel;
    handleTransDetails(
        transId: any,
        document: AccDocument,
        riskLevel: RiskLevel
    ): void;
}

const POST_DOCUMENT_INFO_URL = "v1/je/documentinfo";

const TransactionListCard = ({
    documentTitle,
    document,
    riskLevel,
    handleTransDetails,
}: Props) => {
    const currencySymbol = localStorage.getItem("CurrencySymbol");
    const [showPanel, setShowPanel] = useState(false);
    const controls =
        document?.CONTROL_DEVIATION !== null &&
        document?.CONTROL_DEVIATION.length
            ? document?.CONTROL_DEVIATION.split(",").filter(
                  (control) => control !== ""
              )
            : [];
    const [risk, setRisk] = useState<string>("High");
    const [totalRiskTrans, setTotalRiskTrans] = useState(0);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const [documentInfo, setDocumentInfo] = useState({
        activities: [],
        connections: [],
        riskiness: [],
        message: "",
    });
    const Axios = axios;

    const handleShowPanel = () => {
        if (!showPanel) {
            getDocumentInfo();
        }
        setShowPanel(!showPanel);
    };

    const getDocumentInfo = async () => {
        let formData = new FormData();
        formData.append("ACCOUNTDOCID", document.ACCOUNTDOCID.toString());
        const getDocumentInfoResponse = await Axios.post(
            POST_DOCUMENT_INFO_URL,
            formData,
            {
                headers: {
                    Authorization: localStorage.getItem("TR_Token") as string,
                },
            }
        );

        if (
            getDocumentInfoResponse.data.data.activities.length ||
            getDocumentInfoResponse.data.data.riskiness.length
        ) {
            setDocumentInfo(getDocumentInfoResponse.data.data);
            setRisk(getDocumentInfoResponse.data.data.riskiness.risklevel);
            if (getDocumentInfoResponse.data.data.riskiness.length) {
                let Obj = 0;
                getDocumentInfoResponse.data.data.riskiness.forEach(
                    (element: any) => {
                        Obj = Obj + element.countval;
                    }
                );
                setTotalRiskTrans(Obj);
            }
        }
    };

    useEffect(() => {
        // console.log("riskLevel:", riskLevel);
        // console.log("document:", document.COMMENTS);
        // console.log("controls:", controls);
    });

    return (
        <div className="flex flex-col w-full border border-solid border-slate-300 rounded-xl mb-4 shadow-lg font-roboto">
            <div className="flex flex-col p-5 min-w-fit h-full gap-3">
                <div className="w-full grow">
                    <div className="flex flex-col gap-2 md:flex-row w-full content-between">
                        <div className="flex grow content-between">
                            <span className="flex grow md:flex-grow-0 text-sm md:text-base font-roboto  text-slate-500">
                                {documentTitle.toUpperCase()}
                            </span>
                            <span className="font-roboto text-sm md:text-base font-bold  text-slate-700 ">
                                &nbsp;&nbsp;{document?.ACCOUNTDOC_CODE}
                            </span>
                        </div>
                        <div className="flex grow content-between">
                            <div className="flex grow md:flex-grow-0 font-roboto">
                                <span className="text-slate-500 text-sm md:text-base">
                                    {"company".toUpperCase()}
                                </span>
                            </div>
                            <div className="flex font-roboto font-bold text-sm md:text-base text-slate-700">
                                &nbsp;&nbsp;
                                {document?.COMPANY_CODE_NAME?.toUpperCase()}
                            </div>
                        </div>
                        <div className="flex mt-2 md:mt-0 md:mr-4">
                            <div className="flex grow content-between">
                                <div className="flex grow font-roboto">
                                    <span className="text-slate-500 my-auto text-sm md:text-base flex md:hidden">
                                        COMMENTS
                                    </span>
                                </div>
                                <Button onClick={handleClick}>
                                    <Badge
                                        className="flex"
                                        badgeContent={document?.COMMENTS > 0 ? document?.COMMENTS: '0'}
                                        color="primary"
                                    >
                                        <ForumIcon color="action" />
                                    </Badge>
                                </Button>
                                <CommentsPopOver
                                    open={open}
                                    anchorEl={anchorEl}
                                    handleClose={handleClose}
                                    module={"je"}
                                    docId={Number(document.ACCOUNTDOCID)}
                                    type={"doc"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Divider />
                <div className="w-full grow">
                    <div className="flex flex-col gap-2 md:flex-row w-full content-between font-roboto">
                        <div className="flex grow">
                            <div className="flex flex-row w-full md:flex-col justify-between gap-1">
                                <div className="flex text-sm md:text-base text-slate-500">
                                    POSTED DATE
                                </div>
                                <div className="flex font-bold text-sm md:text-base text-slate-700">
                                    {document?.POSTED_DATE.split(" ")[0]}
                                </div>
                            </div>
                        </div>
                        <div className="flex grow">
                            <div className="flex flex-row w-full md:flex-col justify-between gap-1">
                                <div className="flex text-sm md:text-base text-slate-500">
                                    DEBIT
                                </div>
                                <div className="flex font-roboto font-bold text-sm md:text-base text-slate-700">
                                    <span>{currencySymbol}</span>{document?.DEBIT_AMOUNT.toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div className="flex grow">
                            <div className="flex flex-row w-full md:flex-col justify-between gap-1">
                                <div className="flex text-sm md:text-base text-slate-500">
                                    CREDIT
                                </div>
                                <div className="flex font-bold text-sm md:text-base text-slate-700">
                                <span>{currencySymbol}</span>({document?.CREDIT_AMOUNT.toLocaleString()}
                                    )
                                </div>
                            </div>
                        </div>
                        <div className="flex grow">
                            <div className="flex flex-row w-full md:flex-col justify-between gap-1">
                                <div className="flex text-sm md:text-base text-slate-500">
                                    RISK LEVEL
                                </div>
                                <div className="flex font-bold text-sm md:text-base text-slate-700">
                                    {document.riskScore >= riskLevel.range_high
                                        ? "High"
                                        : document.riskScore >=
                                          riskLevel.range_medium
                                        ? "Medium"
                                        : document.riskScore >=
                                          riskLevel.range_low
                                        ? "Low"
                                        : "Lowest"}
                                </div>
                            </div>
                        </div>
                        <div className="flex grow">
                            <div className="flex flex-row w-full md:flex-col justify-between gap-1">
                                <div className="flex my-auto text-sm md:text-base text-slate-500">
                                    RISK SCORE
                                </div>
                                <div className="flex">
                                    <div
                                        className={`rounded-lg md:w-12 p-1 text-center text-white font-bold ${
                                            document.riskScore >=
                                            riskLevel.range_high
                                                ? "bg-[#d60000]"
                                                : document.riskScore >=
                                                  riskLevel.range_medium
                                                ? "bg-[#f2641a]"
                                                : document.riskScore >=
                                                  riskLevel.range_low
                                                ? "bg-[#f5af2d]"
                                                : "bg-[#00A4DF]"
                                        }`}
                                    >
                                        {document.riskScore}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Divider />
                <div className="w-full min-h-fit">
                    <Collapse in={showPanel}>
                        <div className="flex flex-col md:flex-row w-full gap-3 md:gap-2">
                            <div className="flex flex-col grow">
                                <div className="w-full flex flex-row md:flex-col gap-2">
                                    <div className="flex w-1/3 md:w-full mb-1 font-roboto text-sm">
                                        CONTROLS
                                    </div>
                                    <div className="flex flex-col w-2/3 md:w-full">
                                        {controls.map((control) => (
                                            <div
                                                key={control}
                                                className="flex flex-row w-full gap-2"
                                            >
                                                <span>
                                                    <WhatshotIcon
                                                        sx={{
                                                            fontSize: "18px",
                                                            color: "#EA907A",
                                                        }}
                                                    />
                                                </span>{" "}
                                                <span className="font-roboto text-sm">
                                                    {control}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col grow">
                                <div className="w-full flex flex-row md:flex-col gap-2">
                                    <div className="flex w-1/3 md:w-full mb-1 font-roboto text-sm">
                                        RISKINESS
                                    </div>
                                    {documentInfo.riskiness.map(
                                        (element: any, index:number) => {
                                            return (
                                                <div className="flex flex-row w-2/3 md:w-full gap-2" key={index}>
                                                    {/* change the border colour dynamically after the new api changes */}
                                                    <div
                                                        className={`font-bold text-gray-700 rounded-full flex items-center justify-center font-mono h-5 w-5 my-auto md:h-10 md:w-10 border-3 border-solid text-lg ${
                                                            element.risklevel ===
                                                            "High"
                                                                ? "border-red-700 "
                                                                : element.risklevel ===
                                                                  "Medium"
                                                                ? "border-[#f2641a]"
                                                                : element.risklevel ===
                                                                  "Low"
                                                                ? "border-[#f5af2d]"
                                                                : "border-slate-400"
                                                        }`}
                                                    >
                                                        {element.countval}
                                                    </div>
                                                    {/* <div className="bg-red-300 h-30 w-30 w-min rounded-full">2</div> */}
                                                    <div className="flex flex-col my-auto gap-1">
                                                        <div className="font-roboto text-sm">
                                                            {risk} Risk
                                                        </div>
                                                        <div className="font-roboto text-sm">
                                                            Out of{" "}
                                                            {totalRiskTrans}{" "}
                                                            Transactions
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col grow gap-3">
                                <div className="w-full flex flex-row md:flex-col gap-1">
                                    <div className="flex w-1/2 md:w-full mb-1 font-roboto text-sm">
                                        POSTED LOCATION
                                    </div>
                                    <div className="flex flex-row-reverse md:flex-row w-1/2 md:w-full font-roboto font-bold text-sm">
                                        {document?.POSTED_LOCATION_NAME}
                                    </div>
                                </div>
                                <div className="w-full flex flex-row md:flex-col gap-2">
                                    <div className="flex w-1/2 md:w-full mb-1 font-roboto text-sm">
                                        NEW ACTIVITY
                                    </div>
                                    <div className="flex flex-col md:flex-col w-1/2 md:w-full font-roboto text-sm">
                                        {documentInfo.activities.map(
                                            (element: any, index: number) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex flex-row gap-2"
                                                    >
                                                        <div
                                                            // sx={{
                                                            //     backgroundColor:
                                                            //         "red",
                                                            // }}
                                                            className="my-auto"
                                                        >
                                                            <Avatar
                                                                sx={{
                                                                    width: 34,
                                                                    height: 34,
                                                                    bgcolor:
                                                                        "#00A4DF",
                                                                }}
                                                            >
                                                                <Typography
                                                                    fontSize={
                                                                        12
                                                                    }
                                                                >
                                                                    {
                                                                        element.ASSIGN_BY_SHORT_NAME
                                                                    }
                                                                </Typography>
                                                            </Avatar>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span>
                                                                {
                                                                    element.ASSIGN_BY_NAME
                                                                }
                                                            </span>
                                                            <span className="font-bold">
                                                                {
                                                                    element.COMMENTS
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col grow">
                                <div className="w-full flex flex-row md:flex-col gap-1">
                                    <div className="flex w-full mb-1 font-roboto text-sm">
                                        POSTED BY
                                    </div>
                                    <div className="font-roboto font-bold text-sm">
                                        {document?.POSTED_BY_NAME}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full mt-2">
                            <Divider />
                        </div>
                    </Collapse>
                    <div className="w-full flex flex-row mt-1">
                        <Button
                            className="font-roboto text-sm font-semibold text-slate-700"
                            onClick={() =>
                                handleTransDetails(
                                    document.ACCOUNTDOC_CODE,
                                    document,
                                    riskLevel
                                )
                            }
                        >
                            <span className="hidden md:flex bg-[#1976d2] w-5 h-5 mr-2 text-white rounded-full items-center justify-center">
                                <ArrowForwardIosIcon
                                    sx={{ fontSize: "14px" }}
                                />
                            </span>
                            View Transactions
                        </Button>
                        <Button
                            onClick={handleShowPanel}
                            className="font-roboto text-sm font-semibold text-slate-700"
                        >
                            {!showPanel ? 'Show Document Info': 'Hide Document Info'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionListCard;
