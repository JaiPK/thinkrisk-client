import { useEffect, useState } from "react";
import { SelectPicker } from "rsuite";
interface Props {
  itemArray: any[];
  label: string;
  stateChange: (items: any) => void;
  selectedItem: number | string;
  defaultValue: number | string;
  totalCount?: number;
  totalSum?: number;
}

const ReviewStatusDropDown = (props: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [value, setValue] = useState<any>();
  useEffect(() => {
    const filterData = props.itemArray.map((item: any) => ({
      label: item.text,
      value: item.value,
    }));
    setData(filterData);
    setValue(props.selectedItem);
  }, [props]);

  const handleClickChange = (event: any) => {
    props.stateChange(event);
  };
  return (
      <SelectPicker
        value={value}
        data={data}
        searchable={false}
        cleanable={false}
        defaultValue={props.defaultValue}
        style={{ width: 250 }}
        onChange={(e: any) => {
          handleClickChange(e);
        }}
      />
  );
};

export default ReviewStatusDropDown;
