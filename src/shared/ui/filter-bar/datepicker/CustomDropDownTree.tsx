import { useEffect, useState } from "react";
import { TreePicker } from "rsuite";

interface Props {
  label: string;
  itemArray: any[];
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

const CustomDropDownTree = (props: Props) => {
  const [data, setData] = useState<any[]>([]);
  const convertToTreePickerFormat = (data: any[]) => {
    const transformData: any = (items: any[]) => {
      return items.map((item) => ({
        label: item.title,
        value: item.id,
        children: item.subitems ? transformData(item.subitems) : null,
        hasChildren: item.subitems && item.subitems.length > 0,
      }));
    };
    return transformData(data);
  };
  useEffect(() => {
    const transformedData = convertToTreePickerFormat(
      props.itemArray[0].dataSource,
    );
    setData(transformedData);
    console.log("Transformed Data:", transformedData);
  }, [props.itemArray]);
  const handleChange = (value: any) => {
    console.log(`Selected Value: ${value}`);
    props.stateChange(value, props.filterName);
  };
  return (
    <div className="flex m-0 overflow-hidden bg-[#ebebeb] ">
      <div className="h-max my-auto  font-roboto text-md items-right text-center text-black w-max whitespace-nowrap pl-3">
        {props.label}&nbsp;&nbsp;:&nbsp;&nbsp;
      </div>
      <div className="w-full">
        <TreePicker
          labelKey="label"
          data={data}
          searchable={false}
          style={{ width: "100%" }}
          onChange={handleChange}
          placeholder="Select"
          appearance="default"
          value={props.selectedItem}
          menuAutoWidth
        />
      </div>
    </div>
  );
};
export default CustomDropDownTree;
