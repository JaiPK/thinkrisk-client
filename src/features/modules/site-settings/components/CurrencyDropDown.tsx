import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect } from "react";

interface Props {
  currencyValue: string;
  setIsButtonEnable: any
  setUpdatedCurrencyData:any
}


export default function CurrencySelectLabels( props: Props) {


  const [getCurrency, setGetCurrency] = React.useState<any>(props.currencyValue); 

  
  const handleChange = (event: SelectChangeEvent) => {
    setGetCurrency(event.target.value);
    props.setIsButtonEnable(true)
    props.setUpdatedCurrencyData(event.target.value)
  };

  useEffect(() => {
    setGetCurrency(props.currencyValue);
}, [props.currencyValue]);

  return (
    <div>
      <FormControl sx={{ minWidth: 120, mt: 5 }}>
        <InputLabel id="currency-label" >Currency</InputLabel>
        <Select
          labelId="currency-label"
          id="currency-label"
          value={getCurrency}
          label="Currency"
          onChange={handleChange}
        >
          <MenuItem  value='USD'>USD</MenuItem>
          <MenuItem  value='GBP'>GBP</MenuItem>

        </Select>
      </FormControl>
    </div>
  );
}
