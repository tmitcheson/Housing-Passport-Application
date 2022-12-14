import { useSession, getSession } from "next-auth/react";
import { useState } from "react";
import { Button, Stack } from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import SelectProperty from "../components/SelectProperty";
import Grid from "@mui/material/Grid";
import { Alert } from "@mui/material";
import SmartVsPrice from "../components/SmartVsPrice";
import ConsumptionComparison from "../components/ConsumptionComparison";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import AccuracyTester from "../components/AccuracyTester";

const Insights = () => {
  const [isSelectSubmit, setSelectSubmit] = useState(false);

  const [myProperties, setMyProperties] = useState([]);
  const [chosenProperty, setChosenProperty] = useState();
  const [updateGraph, setUpdateGraph] = useState(false);
  const [accuracySubmit, setAccuracySubmit] = useState(false);
  const [compareSubmit, setCompareSubmit] = useState(false);

  const [timePeriod, setTimePeriod] = useState("");
  const [mpn, setMpn] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [authKey, setAuthKey] = useState("");
  const [date, setDate] = useState("");
  const [chosenMonth, setChosenMonth] = useState("");
  const [mprn, setMprn] = useState("");
  const [serialGas, setSerialGas] = useState("");
  const [gasSubmit, setGasSubmit] = useState(false);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [rightProperty, setRightProperty] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const [isFormSubmit, setFormSubmit] = useState(false);

  const [credentialsError, setCredentialsError] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    setLoading(true);
    if (session) {
      const email = session.user.email;
      axios
        // .post("http://localhost:5000/api/retrieve_my_properties", { email })
        .post(
          "https://housing-passport-back-end.herokuapp.com/api/retrieve_my_properties",
          { email }
        )
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
    console.log("why");
    accuracySubmit ? setAccuracySubmit(false) : setAccuracySubmit(true);
  };
  const handleCompareSubmit = () => {
    console.log("why2");
    compareSubmit ? setCompareSubmit(false) : setCompareSubmit(true);
  };
  const handleComparisonSubmit = () => {
    handleAccuracySubmit();
    handleCompareSubmit();
    setGasSubmit(true);
  };

  return (
    <>
      {!session && (
        <h1> You must be signed in to view this page </h1>
      )}
      {session.user.role === "tradesperson" && (
        <h1> You must be a homeowner to view this page </h1>
      )}
      {session.user.role === "homeowner" && (
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
                  <div className="flexbox-container">
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
                  <h2> Consumption Comparators: </h2>
                  <Box
                    component="form"
                    sx={{
                      "& .MuiTextField-root": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <Stack direction="row">
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
                        onClick={handleComparisonSubmit}
                      >
                        {" "}
                        Run Comparisons{" "}
                      </Button>
                    </Stack>
                  </Box>
                  {credentialsError && (
                    <Alert severity="error">
                      {" "}
                      Something wrong with the login credentials{" "}
                    </Alert>
                  )}
                  <br></br>
                  {!credentialsError && gasSubmit && (
                    <>
                      {!rightProperty && (
                        <Alert severity="warning">
                          Double check your input credentials line up with the
                          current property you have chosen at the top of the
                          page. We are unable to automate verification for this
                          ourselves{" "}
                          <Button onClick={() => setRightProperty(true)}>
                            {" "}
                            Okay !
                          </Button>
                        </Alert>
                      )}
                      <Grid container spacing={2}>
                        <Grid item>
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
                              chosenProperty["content"][
                                "ENERGY_CONSUMPTION_CURRENT"
                              ]
                            }
                            handleAccuracySubmit={accuracySubmit}
                            handleCredentialsError={(credentialsError) =>
                              setCredentialsError(credentialsError)
                            }
                            handleTotalConsumption={(totalConsumption) =>
                              setTotalConsumption(totalConsumption)
                            }
                          ></AccuracyTester>
                        </Grid>
                        <Grid item>
                          <ConsumptionComparison
                            chosenProperty={chosenProperty}
                            mpan={mpn}
                            serialElec={serialNumber}
                            mprn={mprn}
                            serialGas={serialGas}
                            authKey={authKey}
                            handleCompareSubmit={compareSubmit}
                            handleCredentialsError={(credentialsError) =>
                              setCredentialsError(credentialsError)
                            }
                            totalConsumption={totalConsumption}
                          ></ConsumptionComparison>
                        </Grid>
                      </Grid>
                    </>
                  )}
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
