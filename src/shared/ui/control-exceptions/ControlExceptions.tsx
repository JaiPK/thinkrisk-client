import { Checkbox, FormGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { ControlException } from "../../models/records";
import formatNumber from "../../helpers/numberFormatter";

export interface Props {
    controls: ControlException[];
    selectedControls: any[];
    handleControlException: (control: ControlException) => void;
}

const initControls = (
    controls: ControlException[],
    selectedControls: string[]
) => {
    let checkedItems: ControlException[] = [];
    let nonCheckedItems: ControlException[] = [];

    if (controls.length > 0) {
        controls.forEach((control) => {
            let Obj: ControlException = {
                doccount: control.doccount,
                rule: control.rule,
                rule_desc: control.rule_desc,
                title: control.title,
                selected:
                    selectedControls.find(
                        (element) => element === control.rule
                    ) !== undefined
                        ? true
                        : false,
            };

            if (Obj.selected === true) {
                checkedItems.push(Obj);
            } else {
                nonCheckedItems.push(Obj);
            }
        });
    }

    return [...checkedItems, ...nonCheckedItems];
};

const ControlExceptions = ({
    controls,
    selectedControls,
    handleControlException,
}: Props) => {
    const [controlsArray, setControlsArray] = useState(
        initControls(controls, selectedControls)
    );

    const handleNodeChecked = (control: ControlException) => {
        let controlsCopy = [...controlsArray];
        let index = controlsArray.findIndex((Obj) => Obj.rule === control.rule);
        controlsCopy[index].selected = !control.selected;
        setControlsArray(controlsCopy);

        handleControlException(control);
    };

    useEffect(() => {
        setControlsArray(initControls(controls, selectedControls));
    }, [controls, selectedControls]);

    return (
        <div>
            <FormGroup>
                {controlsArray.map((control) => {
                    return (
                        <div className="flex" key={control.title}>
                            <Checkbox
                                checked={control.selected}
                                onClick={() => {
                                    handleNodeChecked(control);
                                }}
                            />
                            <span className="flex w-full justify-between my-auto">
                                <span className="font-roboto text-sm text-[#1976d2]">
                                    {control.title}
                                </span>
                                <span className="font-roboto text-sm">
                                    { formatNumber(control.doccount)}
                                </span>
                            </span>
                        </div>
                    );
                })}
            </FormGroup>
        </div>
    );
};

export default ControlExceptions;
