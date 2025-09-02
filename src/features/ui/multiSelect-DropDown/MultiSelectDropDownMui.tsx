import React, { useEffect, useState } from "react";
import { CheckPicker } from "rsuite";

export interface Props {
  label: any;
  filterName: any;
  data: any;
  selectedItem: any[];
  stateChange: (items: any, filterName: string) => void;
  width?: any;
  tab?: any;
}

const handleResizeObserverError = () => {
  const overlayIframe = document.getElementById('webpack-dev-server-client-overlay');
  if (overlayIframe) {
    overlayIframe.classList.add('__web-inspector-hide-shortcut__');
  }
};

window.addEventListener('error', (event) => {
  if (event.message === 'ResizeObserver loop completed with undelivered notifications.') {
    handleResizeObserverError();       
  }
});

const MultipleSelectCheckmarks = (props: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [selectedValues, setSelectedValues] = useState<any[]>([]);

  useEffect(() => {
    setData(
      props.data?.map((item: any) =>
        props.tab !== "apgl"
          ? { label: item.name, value: item.id }
          : { label: item.text, value: item.value },
      ),
    );
    if (props.tab === "apgl") {
      props.selectedItem?.length > 0 && props.selectedItem
        ? setSelectedValues(props.selectedItem)
        : setSelectedValues([]);
    } else {
      let selectedValues = props.selectedItem?.map((data) => data?.id);
      setSelectedValues(selectedValues);
    }
  }, [props.data, props.tab, props.selectedItem]);
  const handleChange = (selectedValues: any[]) => {
    let items = props.data?.filter((rec: any) => {
      return selectedValues.includes(rec.id);
    });
    props.stateChange(items, props.filterName);
  };
  const handleClick = (event: any) => {
    props.stateChange(event, props.filterName);
  };

  return (
    <CheckPicker
      label={props.label}
      data={data}
      value={selectedValues}
      size="md"
      style={{ width: props.width || "100%", height: "100%" }}
      onChange={props.tab === "apgl" ? handleClick : handleChange}
    />
  );
};

export default MultipleSelectCheckmarks;
