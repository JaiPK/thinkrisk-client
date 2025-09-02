import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Avatar, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks";
import {
    updateGLFilterConfig,
    updateIsDrillThrough,
} from "../../../features/modules/dashboard/generalLedger/state/GLFilterConfigSlice";
import {
    updateAPFilterConfig,
    updateIsAPDrillThrough,
} from "../../../features/modules/dashboard/accountsPayable/state/APFilterConfigSlice";
import {
    updateSelectedRisk,
    updateSelectedRules,
} from "../../../features/modules/gl-slice/GLSlice";
import { useEffect } from "react";

interface Props {
    title: string; //High Risk
    value: string; // $8.26M
    count: string; //33 Accounting Documents
    bgColor: string; //'#d60000'
    txtColor: string; //"white"
    percentage?: string; //100.00
    credit?: boolean;
    glDrillThroughButton?: boolean;
    module?: string;
    filterConfig?: any[];
    risk?: string;
    highlightActiveTab(tabIndex: number):void;
}

export default function KPICard(props: Props) {
    const currencySymbol = localStorage.getItem("CurrencySymbol");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const drillThrough = () => {
    
        if (props?.filterConfig !== undefined) {
            let itemArray = [...props.filterConfig];
            let index = itemArray.findIndex((item) => {
                return item.filterName === "risk";
            });
            itemArray[index].selected = [props.risk];
            let url = window.location.pathname.split("/");
            url.pop();
            url.push("transactions");
            if (props.module === "gl") {
                dispatch(updateIsDrillThrough(true));
                dispatch(updateSelectedRisk(itemArray[index].selected));
                // dispatch(updateGLFilterConfig(itemArray));
                props.highlightActiveTab(2);
                navigate(url.join("/"));
            }
            if (props.module === "ap") {
                //do something
                dispatch(updateIsAPDrillThrough(true));
                dispatch(updateAPFilterConfig(itemArray));
                props.highlightActiveTab(2);
                navigate(url.join("/"));
            }
        }
    };

    return (
        <Card
            sx={{
                minWidth: 225,
                backgroundColor: props.bgColor,
                color: props.txtColor,
                p: 0,
                height: "auto",
            }}
        >
            <CardContent sx={{ p: 1 }}>
                <Typography
                    variant="body1"
                    component="div"
                    align="center"
                    sx={{ fontSize: 15 }}
                >
                    {props.title}
                </Typography>
                <Typography sx={{ fontSize: 22 }} align="center">
                    <span>{currencySymbol}</span>{props.credit ? <span>({props.value})</span> : props.value}
                    {Number(props.percentage)>0 ? (
                        <span>({props.percentage}{props.glDrillThroughButton? '%' : null})</span>
                    ) : <span>{props.glDrillThroughButton? '(0)' : null}{props.glDrillThroughButton? '%' : null}</span>}
                </Typography>
                {/* <Box sx={{ flexDirection: "row" }}>
                    <Box sx={{ width: "80%" }}>
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{ fontSize: 11 }}
                        >
                            {props.count} Accounting Documents
                        </Typography>
                    </Box>
                </Box> */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        mt: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Box sx={{ alignItems: "center" }}>
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{ fontSize: 11 }}
                        >
                            {props.count} Accounting Documents
                        </Typography>
                    </Box>
                    <Box sx={{ ml: 1 }}>
                        {props.glDrillThroughButton ? (
                            <Avatar
                                sx={{
                                    width: 14,
                                    height: 14,
                                    bgcolor: "white",
                                    cursor: "pointer",
                                }}
                                onClick={drillThrough}
                            >
                                <ArrowForwardIosIcon
                                    sx={{ fontSize: 6, color: "black" }}
                                />
                            </Avatar>
                        ) : null}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
