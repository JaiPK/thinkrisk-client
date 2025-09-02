import { useEffect, useState } from "react";
import { SelectPicker } from 'rsuite';

interface Props {
    itemArray: any[];
    label: string;
    stateChange: (items: any, filterName: string) => void;
    filterName: string;
    selectedItem: number;
}

const handleResizeObserverError = () => {
  const resizeObserverErrDiv = document.getElementById('resize-observer-error');
  if (resizeObserverErrDiv) {
    resizeObserverErrDiv.remove();
  }
};

window.addEventListener('error', (event) => {
  if (event.message === 'ResizeObserver loop completed with undelivered notifications.') {
    handleResizeObserverError();
  }
});

const DropDown = (props: Props) => {
    const [data, setData] = useState<any[]>([]);
    const [value, setValue] = useState<any>(null);
    useEffect(() => {
        setData(
            props.itemArray?.map((item: any) => ({label: item.text, value: item.value}))
        );
        setValue(props.selectedItem)
    }, [props.itemArray, props.selectedItem])

    const handleClick = (event: any) => {
        props.stateChange(event, props.filterName);
    };

    return (
        <div className="w-full">
            <SelectPicker 
                label = {props.label}
                data = {data}
                searchable={false}
                onChange={handleClick}
                placeholder="Select"
                style={{ width: "100%", height: "100%" }}
                value={value}
            />
        </div>
    );
};

export default DropDown;
