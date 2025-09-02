import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function ControlledRadioButtonsGroup(props: any) {
  const [value, setValue] = React.useState('female');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '1') {
      props.setaccountStyle('accounts_with_transactions')
    }
    else {
      props.setaccountStyle('accounts_without_transactions')
    }
  };

  return (
    <FormControl>
      <FormLabel id="demo-controlled-radio-buttons-group">Account Style</FormLabel>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value="1" control={<Radio checked={props.accountStyle == 'accounts_with_transactions'} />} label="Accounts with transactions" />
        <FormControlLabel value="2" control={<Radio checked={props.accountStyle == 'accounts_without_transactions'} />} label="Accounts without transactions" />
      </RadioGroup>
    </FormControl>
  );
}