import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useSession } from 'next-auth/react';

export default function SelectProperty({ properties, chosenProperty, onSubmit, onSubmit2 }) {
  const [age, setAge] = useState('');
  const [ myProperties, setMyProperties ] = useState([]);
  const [ isSubmitted, setSubmitted ] = useState(true);
  const { data: session, status } = useSession();

  console.log("here" + properties)

  const handleChange = (event) => {
    setAge(event.target.value);
    onSubmit(event.target.value);
    onSubmit2();
  };

  return (
    <>
    <><Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">My Properties</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={chosenProperty}
          label="property"
          onChange={handleChange}
        >
          {properties.map(item => (
            <MenuItem key={item[0]} value={item}>{item[0]}</MenuItem>
          ))
        }
        </Select>
      </FormControl>
    </Box></>
    </>
  );
}
