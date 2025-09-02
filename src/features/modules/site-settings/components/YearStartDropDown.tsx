import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect } from "react";

interface Props {
  monthValue: string;
  setIsButtonEnable: any
  setUpdatedMonth: any
}

export default function YearSelectLabels(props: Props) {

  const [month, setMonth] = React.useState<any>(props.monthValue);

  useEffect(() => {
    setMonth(props.monthValue);
  }, [props.monthValue]);

  const handleChange = (event: SelectChangeEvent) => {
    setMonth(event.target.value);
    props.setUpdatedMonth(event.target.value)
    props.setIsButtonEnable(true)
  };


  return (
    <div>
      <FormControl sx={{ minWidth: 120, mt: 5 }}>
        <InputLabel id="month-label">Financial Year</InputLabel>
        <Select
          labelId="month-label"
          id="month-label"
          value={month}
          label="Financial Year Start Month"
          onChange={handleChange}
        >
          <MenuItem value={'1'}>January</MenuItem>
          <MenuItem value={'2'}>Febuary</MenuItem>
          <MenuItem value={'3'}>March</MenuItem>
          <MenuItem value={'4'}>April</MenuItem>
          <MenuItem value={'5'}>May</MenuItem>
          <MenuItem value={'6'}>June</MenuItem>
          <MenuItem value={'7'}>July</MenuItem>
          <MenuItem value={'8'}>August</MenuItem>
          <MenuItem value={'9'}>September</MenuItem>
          <MenuItem value={'10'}>October</MenuItem>
          <MenuItem value={'11'}>November</MenuItem>
          <MenuItem value={'12'}>December</MenuItem>


        </Select>
        <FormHelperText>START MONTH</FormHelperText>
      </FormControl>
    </div>
  );
}
