import { useEffect, useState } from "react";
import { SelectPicker } from "rsuite";
interface Props {
  itemArray: any[];
  label: string;
  stateChange: (items: any) => void;
  selectedItem: number | string;
}

const StatusDropDown = (props: Props) => {
  const [filterArray, setfilterArray] = useState(props.selectedItem.toString());
  const [data, setData] = useState<any[]>([]);
  const [value, setValue] = useState(1);

  const handleChange = (event: any) => {
    setfilterArray(event);
    setValue(event);
    props.stateChange(event);
  };
  useEffect(() => {
    console.log("Item Array:", props.itemArray);
    const formateData = props.itemArray.map((item: any) => ({
      label: item.text,
      value: item.value,
    }));
    setData(formateData);
  }, [props.itemArray]);
  return (
      <SelectPicker
        value={value}
        data={data}
        searchable={false}
        cleanable={false}
        style={{ width: "100%" }}
        onChange={(e: any) => {
          handleChange(e);
        }}
      />
  );
};

export default StatusDropDown;
