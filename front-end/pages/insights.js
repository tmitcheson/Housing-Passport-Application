import { useSession, getSession } from "next-auth/react";
import { useLayoutEffect, useRef } from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import { useEffect } from "react";

import axios from "axios";
import BasicTabs from "../components/EpcTabs";
import SelectProperty from "../components/SelectProperty";
import styles from "../styles/List.module.css";
import SmartVsPrice from "../components/SmartVsPrice";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import RecsToggle from "../components/RecsToggle";
import AccuracyTester from "../components/AccuracyTester";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Link from "next/link";
import Head from "next/head";

const Insights = () => {
  const [isSelectSubmit, setSelectSubmit] = useState(false);

  const [myProperties, setMyProperties] = useState([]);
  const [chosenProperty, setChosenProperty] = useState();
  const [updateGraph, setUpdateGraph] = useState(false);
  const [accuracySubmit, setAccuracySubmit] = useState(false);

  const [timePeriod, setTimePeriod] = useState("");
  const [mpn, setMpn] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [authKey, setAuthKey] = useState("");
  const [date, setDate] = useState("");
  const [chosenMonth, setChosenMonth] = useState("");
  const [mprn, setMprn] = useState("");
  const [serialGas, setSerialGas] = useState("");

  const [isLoading, setLoading] = useState(false);

  const [isFormSubmit, setFormSubmit] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    setLoading(true);
    if (session) {
      const email = session.user.email;
      axios
        .post("http://localhost:5000/api/retrieve_my_properties", { email })
        // axios.post('https://housing-passport-back-end.herokuapp.com/api/retrieve_my_properties', {data})
        .then(function (response) {
          const receivedData = response.data;
          const newProperties = [];
          for (const i in receivedData) {
            newProperties.push({
              address: receivedData[i]["address"],
              content: receivedData[i]["content"],
              publicRetrofits: receivedData[i]["public_retrofits"],
              privateRetrofits: receivedData[i]["private_retrofits"],
              recommendations: receivedData[i]["recommendations"],
            });
          }
          setMyProperties(newProperties);
          setLoading(false);
        })
        .catch(function (error) {
          console.log("initial oops");
          console.log(error);
        });
    }
  }, []);

  const onSubmit = async () => {
    setFormSubmit(true);
    updateGraph ? setUpdateGraph(false) : setUpdateGraph(true);
  };

  const handleAccuracySubmit = () => {
    accuracySubmit ? setAccuracySubmit(false) : setAccuracySubmit(true);
    console.log()
  };

  return (
    <>
      {session && (
        <>
          <h2> Welcome to your insights page </h2>
          <h3> Choose a property: </h3>
          <SelectProperty
            properties={myProperties}
            chosenProperty=""
            onSubmit={(property) => setChosenProperty(property)}
            onSubmit2={() => setSelectSubmit(true)}
          />
          {isSelectSubmit && (
            <>
              <h3> Chosen Property: {chosenProperty["address"]}</h3>
              <h2> Consumption Habits </h2>
              <h4>
                For data security reasons we will never ask you to store your
                sensitive Octopus API key on this site. This means each time you
                log in the site will not remember any of the following
                information and it will need to be submitted again
              </h4>
              <Box
                component="form"
                sx={{
                  "& .MuiTextField-root": { m: 1, width: "25ch" },
                }}
                noValidate
                // autoComplete="off"
              >
                <div>
                  <TextField
                    required
                    id="mpan"
                    label="MPAN"
                    value={mpn}
                    onChange={(e) => setMpn(e.target.value)}
                  />
                  <TextField
                    required
                    id="serialElec"
                    label="Serial Number"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                  />
                  <TextField
                    required
                    id="authKey"
                    label="Auth Key"
                    value={authKey}
                    onChange={(e) => setAuthKey(e.target.value)}
                  />
                  <br></br>
                  <br></br>
                  <div class="flexbox-container">
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={timePeriod}
                      label="property"
                      onChange={(e) => {
                        setTimePeriod(e.target.value);
                      }}
                    >
                      <MenuItem key="day" value="day">
                        Day
                      </MenuItem>
                      <MenuItem key="month" value="month">
                        Month
                      </MenuItem>
                    </Select>
                    {timePeriod === "day" && (
                      <TextField
                        required
                        id="date"
                        label="Date"
                        value={date}
                        placeholder="DD/MM/YYYY"
                        onChange={(e) => setDate(e.target.value)}
                      />
                    )}
                    {timePeriod === "month" && (
                      <TextField
                        required
                        id="month"
                        label="Month"
                        value={chosenMonth}
                        placeholder="MM/YYYY"
                        onChange={(e) => setChosenMonth(e.target.value)}
                      />
                    )}
                    <Button variant="contained" onClick={onSubmit}>
                      Submit
                    </Button>
                  </div>
                </div>
              </Box>
              {isFormSubmit && (
                <>
                  <SmartVsPrice
                    mpn={mpn}
                    serialNumber={serialNumber}
                    authKey={authKey}
                    timePeriod={timePeriod}
                    date={date}
                    chosenMonth={chosenMonth}
                    updateGraph={updateGraph}
                  />
                  <h2> How accurate is your EPC? Test it here: </h2>
                  <Box
                    component="form"
                    sx={{
                      "& .MuiTextField-root": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <div>
                      <TextField
                        required
                        id="mprn"
                        label="MPRN"
                        value={mprn}
                        onChange={(e) => setMprn(e.target.value)}
                      />
                      <TextField
                        required
                        id="serialGas"
                        label="Gas Serial Number"
                        value={serialGas}
                        onChange={(e) => setSerialGas(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        onClick={handleAccuracySubmit}
                      >
                        {" "}
                        Submit{" "}
                      </Button>
                    </div>
                  </Box>
                  <AccuracyTester
                    lmk_key={chosenProperty["content"]["LMK_KEY"]}
                    mpan={mpn}
                    serialElec={serialNumber}
                    mprn={mprn}
                    serialGas={serialGas}
                    authKey={authKey}
                    totalFloorArea={
                      chosenProperty["content"]["TOTAL_FLOOR_AREA"]
                    }
                    energyConsCurrent={
                        chosenProperty["content"]["ENERGY_CONSUMPTION_CURRENT"]
                    }
                    handleAccuracySubmit={accuracySubmit}
                  ></AccuracyTester>
                </>
              )}{" "}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Insights;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}
