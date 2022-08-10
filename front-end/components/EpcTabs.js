import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs(chosenProperty) {
  const overviewOptions = ['ADDRESS', 'BUILDING_REFERENCE_NUMBER', 'BUILT_FORM', 'CONSTITUENCY_LABEL',
                  'CONSTRUCTION_AGE_BAND', 'COUNTY', 'CURRENT_ENERGY_EFFICIENCY', 'CURRENT_ENERGY_RATING',
                  'INSPECTION_DATE', 'LMK_KEY', 'LOCAL_AUTHORITY_LABEL', 'NUMBER_HABITABLE_ROOMS',
                  'PROPERTY_TYPE', 'TENURE', 'TOTAL_FLOOR_AREA', ]
  const heatingOptions = ['HEATING_COST_CURRENT', 'HEATING_COST_POTENTIAL', 'MAINHEAT_DESCRIPTION',
                    'MAINHEAT_ENV_EFF', 'MAINHEAT_ENERGY_EFF', 'MAIN_FUEL'];
  const lightingOptions =['LIGHTING_DESCRIPTION', 'LIGHTING_COST_CURRENT', 'LIGHTING_COST_POTENTIAL', 
                  'LIGHTING_ENERGY_EFF', 'LIGHTING_ENV_EFF', 'LOW_ENERGY_FIXED_LIGHT_COUNT',
                  'LOW_ENERGY_LIGHTING'];
  const waterOptions =['HOTWATER_DESCRIPTION', 'HOT_WATER_COST_CURRENT', 'HOT_WATER_COST_POTENTIAL', 
                'HOT_WATER_ENERGY_EFF', 'HOT_WATER_ENV_EFF'];
  const windowsOptions = ['GLAZED_AREA', 'GLAZED_TYPE', 'WINDOWS_DESCRIPTION', 'WINDOWS_ENERGY_EFF', 
                  'WINDOWS_ENV_EFF'];
  const roofOptions = ['ROOF_DESCRIPTION', 'ROOF_ENERGY_EFF', 'ROOF_ENV_EFF'];
  const floorOptions =['FLOOR_DESCRIPTION', 'FLOOR_ENERGY_EFF', 'FLOOR_ENV_EFF', 'FLOOR HEIGHT'];
  const wallsOptions =['WALLS_DESCRIPTION', 'WALLS_ENERGY_EFF', 'WALLS_ENV_EFF'];
  const emissionsOptions = ['CO2_EMISSIONS_CURRENT', 'CO2_EMISSIONS_POTENTIAL', 'CO2_EMISSIONS_CURR_PER_FLOOR_AREA'];
  const consumptionOptions = ['ENERGY_CONSUMPTION_CURRENT', 'ENERGY_CONSUMPTION_POTENTIAL',
                      'POTENTIAL_ENERGY_EFFICIENCY', 'POTENTIAL_ENERGY_RATING']
  
  const [value, setValue] = React.useState(0);
  const [epcData, setEpcData] = useState([]);
  const [overview, setOverview] = useState([]);
  const [heating, setHeating] = useState([]);
  const [lighting, setLighting] = useState([]);
  const [water, setWater] = useState([]);
  const [windows, setWindows] = useState([]);
  const [roof, setRoof] = useState([]);
  const [floor, setFloor] = useState([]);
  const [walls, setWalls] = useState([]);
  const [emissions, setEmissions] = useState([]);
  const [consumption, setConsumption] = useState([]);

  const chosenPropertyTabs = chosenProperty['chosenProperty'][1][0]

  const newOverview = [];
  const newHeating = [];
  const newLighting = [];
  const newWater = [];
  const newWindows = [];
  const newRoof = [];
  const newFloor = [];
  const newWalls = [];
  const newEmissions = [];
  const newConsumption = [];
  const other = [];


  for(const i in chosenPropertyTabs){
    if (overviewOptions.includes(i)) {
      newOverview.push([i, chosenPropertyTabs[i]]);
    } else if (heatingOptions.includes(i)){
      newHeating.push([i, chosenPropertyTabs[i]]);
    } else if (lightingOptions.includes(i)){
      newLighting.push([i, chosenPropertyTabs[i]]);
    } else if (waterOptions.includes(i)){
      newWater.push([i, chosenPropertyTabs[i]]);
    } else if (windowsOptions.includes(i)){
      newWindows.push([i, chosenPropertyTabs[i]]);
    } else if (roofOptions.includes(i)){
      newRoof.push([i, chosenPropertyTabs[i]]);
    } else if (floorOptions.includes(i)){
      newFloor.push([i, chosenPropertyTabs[i]]);
    } else if (wallsOptions.includes(i)){
      newWalls.push([i, chosenPropertyTabs[i]]);
    } else if (emissionsOptions.includes(i)){
      newEmissions.push([i, chosenPropertyTabs[i]]);
    } else if (consumptionOptions.includes(i)){
      newConsumption.push([i, chosenPropertyTabs[i]]);
    } else { other.push([i, chosenPropertyTabs[i]]);
    }
  };

  useEffect(() => {
    // Update the document title using the browser API
    setOverview(newOverview);
    setHeating(newHeating);
    setLighting(newLighting);
    setWater(newWater);
    setWindows(newWindows);
    setRoof(newRoof);
    setFloor(newFloor);
    setWalls(newWalls);
    setEmissions(newEmissions);
    setConsumption(newConsumption);
  } ,[chosenProperty]);

  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Overview" {...a11yProps(0)} />
          <Tab label="Heating" {...a11yProps(1)} />
          <Tab label="Lighting" {...a11yProps(2)} />
          <Tab label="Water" {...a11yProps(3)} />
          <Tab label="Windows" {...a11yProps(4)} />
          <Tab label="Roof" {...a11yProps(5)} />
          <Tab label="Floor" {...a11yProps(6)} />
          <Tab label="Walls" {...a11yProps(7)} />
          <Tab label="Emissions" {...a11yProps(8)} />
          <Tab label="Consumption" {...a11yProps(9)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
      <div className='epcData'>
        <table> 
          {overview.map(item => {
            return <tr> <td key={item}> {item[0]}</td> <td> {item[1]}</td> </tr>
            })}
        </table>
      </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <div className='epcData'>
        <table> 
          {heating.map(item => {
            return <tr> <td key={item}> {item[0]}</td> <td> {item[1]}</td> </tr>
            })}
        </table>
      </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <div className='epcData'>
        <table> 
          {lighting.map(item => {
            return <tr> <td key={item}> {item[0]}</td> <td> {item[1]}</td> </tr>
            })}
        </table>
      </div>
      </TabPanel>
      <TabPanel value={value} index={3}>
      <div className='epcData'>
        <table> 
          {water.map(item => {
            return <tr> <td key={item}> {item[0]}</td> <td> {item[1]}</td> </tr>
            })}
        </table>
      </div>
      </TabPanel>
      <TabPanel value={value} index={4}>
      <div className='epcData'>
        <table> 
          {windows.map(item => {
            return <tr> <td key={item}> {item[0]}</td> <td> {item[1]}</td> </tr>
            })}
        </table>
      </div>
      </TabPanel>
      <TabPanel value={value} index={5}>
      <div className='epcData'>
        <table> 
          {roof.map(item => {
            return <tr> <td key={item}> {item[0]}</td> <td> {item[1]}</td> </tr>
            })}
        </table>
      </div>
      </TabPanel>
      <TabPanel value={value} index={6}>
      <div className='epcData'>
        <table> 
          {floor.map(item => {
            return <tr> <td key={item}> {item[0]}</td> <td> {item[1]}</td> </tr>
            })}
        </table>
      </div>
      </TabPanel>
      <TabPanel value={value} index={7}>
      <div className='epcData'>
        <table> 
          {walls.map(item => {
            return <tr> <td key={item}> {item[0]}</td> <td> {item[1]}</td> </tr>
            })}
        </table>
      </div>
      </TabPanel>
      <TabPanel value={value} index={8}>
      <div className='epcData'>
        <table> 
          {emissions.map(item => {
            return <tr> <td key={item}> {item[0]}</td> <td> {item[1]}</td> </tr>
            })}
        </table>
      </div>
      </TabPanel>
      <TabPanel value={value} index={9}>
      <div className='epcData'>
        <table> 
          {consumption.map(item => {
            return <tr> <td key={item}> {item[0]}</td> <td> {item[1]}</td> </tr>
            })}
        </table>
      </div>
      </TabPanel>
    </Box>
  );
}
