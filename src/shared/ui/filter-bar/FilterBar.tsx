import { Collapse } from "@mui/material";
import DropDown from "../dropdowns/DropDown";
import { useEffect, useState } from "react";
import { Config } from "../../models/filters";
import CustomDropDownTree from "./datepicker/CustomDropDownTree";
import { DateRangePicker } from "rsuite";
import MultiSelectDropDownMui from "../../../features/ui/multiSelect-DropDown/MultiSelectDropDownMui";
interface Props {
    config: Config[];
    handleStateToParent: (items: any, filterName: string) => void;
    isLoading: boolean;
}

const FilterBar = (props: Props) => {
    const [expanded, setExpanded] = useState<boolean>(true);
    const [filterConfig, setFilterConfig] = useState(props.config);

    const handleStateChange = (items: any, filterName: string) => {
        props.handleStateToParent(items, filterName);
    };

    const handleDateRangeChange = (value: [Date, Date] | null, filterName: any) => {
    let startDate: any = createDateString(value?.length ? value[0] : null);
    let endDate: any = createDateString(value?.length ? value[1] : null);

    props.handleStateToParent(
      {
        posted_date_start: startDate,
        posted_date_end: endDate,
      },
      filterName
    );

  };
  const createDateString = (date: any) => {
    if (date) {
      let month = date.getMonth() + 1; //months from 1-12
      let day = date.getDate();
      let year = date.getFullYear();

      let dateString = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day
        }`;
      return dateString;
    }
    return null;
  };

  useEffect(() => {
     setFilterConfig(props.config);
  }, [props.config]);

  console.log("filterConfig", filterConfig);

    return (
        <div className="flex flex-col w-full">
            <Collapse in={expanded}>
                <div className=" py-2">
                    <div className="grid gap-2 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        {filterConfig?.map((filter: Config, i: number) => {
                            if(filter.active){
                                switch (filter.filterType) {
                                    case "single-dropdown":
                                        return (
                                            <DropDown
                                                key={i}
                                                filterName={filter.filterName}
                                                label={filter.label}
                                                itemArray={filter.data}
                                                selectedItem={filter.selected}
                                                stateChange={handleStateChange}
                                            />
                                        );
                                    case "multi-dropdown":
                                        return (
                                            <span className="h-[35px]">
                                                <MultiSelectDropDownMui
                                                    key={i}
                                                    label={filter.label}
                                                    filterName={filter.filterName}
                                                    data={filter.data}
                                                    selectedItem={filter.selected}
                                                    stateChange={handleStateChange}
                                                    tab="apgl"
                                                />
                                            </span>
                                        );
                                    case "date-picker":
                                        return (
                                            <div className="h-[35px]">
                                                <DateRangePicker
                                                    label={`${filter.label} :`}
                                                    placeholder=" "
                                                    size="md"
                                                    onChange={(value)=>handleDateRangeChange(value, filter.filterName)}
                                                    style={{ width: "100%", height:"100%" }}
                                                    gap-10
                                                    format="yyyy-MM-dd"
                                                    placement="bottomEnd"
                                                    value={
                                                        filter.selected.posted_date_start && filter.selected.posted_date_end
                                                        ? [new Date(filter.selected.posted_date_start), new Date(filter.selected.posted_date_end)]
                                                        : null
                                                    }
                                                />
                                            </div>
                                        );
                                    case "dropdown-tree":
                                        return(
                                            <CustomDropDownTree 
                                            key={i}
                                            filterName={filter.filterName}
                                            label={filter.label}
                                            itemArray={filter.data}
                                            selectedItem={filter.selected}
                                            stateChange={handleStateChange}
                                            />
                                        );
                                    default:
                                        break;
                                }
                            }
                        })}
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

export default FilterBar;
