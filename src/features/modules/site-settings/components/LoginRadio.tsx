import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useEffect } from "react";
import { SelectChangeEvent } from '@mui/material';

interface Props {
  loginValue: any;
  setIsButtonEnable:any;
  setUpdatedType:any;
}

export default function RowRadioButtonsGroup( props: Props) {

  const [logIn, setLogIn] = React.useState<any>(props.loginValue);

  const handleChange = (event:any) => {
    setLogIn(event.target.value);
    props.setIsButtonEnable(true)
    props.setUpdatedType(event.target.value)
  };

  useEffect(() => {
    setLogIn(props.loginValue);
  }, [props.loginValue]);

  return (
    <FormControl>
      <FormLabel id="auth-setting-label" sx={{ fontWeight: 'bold' }}>Authentication Setting</FormLabel>
      <RadioGroup
        row
        aria-labelledby="auth-setting-label"
        name="row-radio-buttons-group"
        value={logIn?logIn:'2'}
        onChange={(e)=>handleChange(e)}

      >

        <FormControlLabel value="1"  control={<Radio />} label="Azure AD Login" />
        <FormControlLabel value="2"  control={<Radio />} label="Native Login" />
      </RadioGroup>
    </FormControl>
  );
}
