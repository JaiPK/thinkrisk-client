import { useEffect, useState } from "react";
import { SelectPicker } from "rsuite";
interface Props {
  itemArray: any[];
  label: string;
  stateChange: (items: any) => void;
  selectedItem: string;
}

const DeviationDropDown = (props: Props) => {
  const [value, setValue] = useState("");
  const [data, setData] = useState<any[]>([]);
  const handleClickChange = (event: any) => {
    console.log(event);
    setValue(event);
    props.stateChange(event);
  };

  useEffect(() => {
    const filterData = props.itemArray.map((item: any) => ({
      label: item.text,
      value: item.value,
    }));
    setData(filterData);
    console.log("Selected Items:", props.selectedItem);
    if (props.selectedItem) {
      setValue(props.selectedItem);
    }
  }, [props]);

  return (
    <SelectPicker
      value={value}
      data={data}
      searchable={false}
      cleanable={false}
      style={{ width: "100%" }}
      onChange={(e: any) => {
        handleClickChange(e);
      }}
    />
  );
};

export default DeviationDropDown;
