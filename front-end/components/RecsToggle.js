import {useState} from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function RecsToggle({paybackOrCosts, handlePaybackOrCosts}) {

    const handleChange = (event) => {
        handlePaybackOrCosts(event.target.value)
    }

  return (
    <ToggleButtonGroup
      color="primary"
      value={paybackOrCosts}
      exclusive
      onChange={handleChange}
    >
      <ToggleButton value="costs">Costs</ToggleButton>
      <ToggleButton value="payback">Payback</ToggleButton>
    </ToggleButtonGroup>
  );
}
