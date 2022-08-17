import { useSession, getSession } from "next-auth/react";
import { useLayoutEffect, useRef } from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { set, useForm } from "react-hook-form";

import axios from "axios";
import BasicTabs from "../components/EpcTabs";
import SelectProperty from "../components/SelectProperty";
import styles from "../styles/List.module.css";
import SmartVsPrice from "../components/SmartVsPrice";
import RecsAndPayback from "../components/RecsAndPaybacks";
import RecsAndCosts from "../components/RecsAndCosts";
import RecStats from "../components/recommendationPrices.json" assert { type: "json" };
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import RecsToggle from "../components/RecsToggle";
import AccuracyTester from "../components/AccuracyTester";
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const MyProperties = () => {
  const [isSelectSubmit, setSelectSubmit] = useState(false);
  const [listOfTradespeople, setListOfTradespeople] = useState([]);
  const [isTradeSubmit, setTradeSubmit] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [isRecomSubmit, setRecomSubmit] = useState(false);
  const [isFailed, setFailed] = useState(false);
  const [deleted, setDeleted] = useState(0);
  const [isAdded, setAdded] = useState(false);
  const [myProperties, setMyProperties] = useState([]);
  const [chosenProperty, setChosenProperty] = useState({});
  const [updateGraph, setUpdateGraph] = useState(false);
  const [paybackOrCosts, setPaybackOrCosts] = useState("costs");
  const [accuracySubmit, setAccuracySubmit] = useState(false);
  const [doneRetrofits, setDoneRetrofits] = useState([]);


  const [timePeriod, setTimePeriod] = useState("");
  const [mpn, setMpn] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [authKey, setAuthKey] = useState("");
  const [date, setDate] = useState("");
  const [chosenMonth, setChosenMonth] = useState("");
  const [mprn, setMprn] = useState("");
  const [serialGas, setSerialGas] = useState("");

  const [isFormSubmit, setFormSubmit] = useState(false);

  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (session.user.role === "homeowner") {
      const email = session.user.email;
      axios
        .post("http://localhost:5000/api/retrieve_my_properties", { email })
        // axios.post('https://housing-passport-back-end.herokuapp.com/api/get_my_property', {data})
        .then(function (response) {
          const receivedData = response.data;
          // console.log("receieveddaa" + JSON.stringify(receivedData));
          console.log(receivedData);
          const newProperties = [];
          for (const i in receivedData) {
            // newProperties.push([
            //   receivedData[i]["address"],
            //   receivedData[i]["content"],
            //   receivedData[i]["retrofits"],
            // ]);
            newProperties.push({
              address: receivedData[i]["address"],
              content: receivedData[i]["content"],
              retrofits: receivedData[i]["retrofits"],
            });
          }
          // console.log("new properties");
          // console.log(newProperties);
          setMyProperties(newProperties);
        })
        .catch(function (error) {
          console.log("initial oops");
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    console.log("NOWNOWNOWNOWNO");


  }, [doneRetrofits]);

  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      // do things after first render

      /* THIS SECTION GETS THE RECOMMENDATIONS FOR THE CHOSEN PROPERTY */

      let config = {
        headers: {
          Authorization:
            "Basic dGJtaXRjaGVzb25AZ21haWwuY29tOjQ5NmRkMDcxZjhjOWY5NTM0YTNiYmM1ZDYyYmE4YjlkMWRlMmFmMzY=",
          Accept: "application/json",
        },
      };

      axios
        .get(
          "https://epc.opendatacommunities.org/api/v1/domestic/recommendations/" +
            chosenProperty["content"]["LMK_KEY"],
          config
        )
        .then(function (response) {
          const recommendationsFull = response.data["rows"];
          let recommendationsTemp = [];
          //   console.log(recommendationsFull);
          for (const i in recommendationsFull) {
            recommendationsTemp.push([
              recommendationsFull[i]["improvement-id-text"],
              recommendationsFull[i]["indicative-cost"],
            ]);
          }
          //   console.log(recommendationsTemp);

          /* THIS SECTION ADDS THE PRICES OF PAYBACK PERIODS OF THE RECS */

          for (let i = 0; i < recommendationsTemp.length; i++) {
            for (let j = 0; j < RecStats.recList.length; j++) {
              if (
                recommendationsTemp[i][0]
                  .toLowerCase()
                  .replaceAll(" ", "_")
                  .includes(RecStats.recList[j])
              ) {
                // console.log(recommendationsTemp[i][0])
                const builtForm = chosenProperty["content"]["BUILT_FORM"]
                  .toLowerCase()
                  .replaceAll("-", "_");
                // console.log(builtForm)
                // console.log(recList)
                const timeBackNow = (
                  RecStats.InstallationCost[builtForm][RecStats.recList[j]] /
                  RecStats.BillSavings[builtForm][RecStats.recList[j]]
                ).toFixed(2);
                const timeBackLast = (
                  RecStats.InstallationCost[builtForm][RecStats.recList[j]] /
                  (RecStats.BillSavings[builtForm][RecStats.recList[j]] * 0.57)
                ).toFixed(2);
                const timeBackNext = (
                  RecStats.InstallationCost[builtForm][RecStats.recList[j]] /
                  (RecStats.BillSavings[builtForm][RecStats.recList[j]] * 1.81)
                ).toFixed(2);

                recommendationsTemp[i][2] = timeBackLast + " years";
                recommendationsTemp[i][3] = timeBackNow + " years";
                recommendationsTemp[i][4] = timeBackNext + " years";
                // recommendationsTemp[i][2] = RecStats.InstallationCost[builtForm][RecStats.recList[j]];
                // recommendationsTemp[i].push(PaybackPrices[builtForm][recList[j]])
                // console.log(recommendationsTemp[i][2])
              }
            }
          }

          // setRecommendations(recommendationsTemp);
          
          // console.log("here");
          // console.log(recommendationsTemp)
          // // console.log(chosenProperty);
          const tempRetros = chosenProperty["retrofits"];
          // setDoneRetrofits(tempRetros);
          // // console.log(doneRetrofits);




          
          setRecommendations(recommendationsTemp)
          setDoneRetrofits(tempRetros)
          setRecomSubmit(true);
          //   const address = chosenProperty["content"]["ADDRESS"];
          //   const email = session.user.email;
          //   axios
          //     .post("http://localhost:5000/api/retrieve_my_retrofits", {
          //       email,
          //       address,
          //     })
          //     // axios.post('https://housing-passport-back-end.herokuapp.com/api/retrieve_my_retrofits', {data})
          //     .then(function (response) {
          //       console.log("retrofits:");
          //       console.log(response.data);
          //       if (response.data !== "no retrofits") {
          //         setDoneRetrofits(response.data);
          //       }
          //     });
        });
    }
  }, [chosenProperty]);

  const onDeleteProperty = (address) => {
    console.log(address);
    const email = session.user.email;
    axios
      .post("http://localhost:5000/api/delete_property_from_user", {
        address,
        email,
      })
      // axios.post('https://housing-passport-back-end.herokuapp.com/api/delete_property_from_user', {address})
      .then(function (response) {
        if (response.data === "True") {
          console.log("woo");
          setDeleted(1);
        } else if (response.data === "False") {
          console.log("boo");
          setDeleted(2);
        }
      });
  };

  const handleAccuracySubmit = () => {
    accuracySubmit ? setAccuracySubmit(false) : setAccuracySubmit(true);
  };

  const onFormSubmit = (accountData) => {
    console.log(accountData);

    // const mpn = accountData['mpn']
    // const serialNumber = accountData["serialNumber"]
    // const authKey = accountData["authKey"]

    const mpn = "1200038779673";
    const serialNumber = "Z18N333768";
    const authKey = "sk_live_F6fSk8HDazIy7wKmWnWA3tD9";

    setMpn(mpn);
    setSerialNumber(serialNumber);
    setAuthKey(authKey);

    setFormSubmit(true);
  };

  const onRetrieveTradesClick = () => {
    axios
      .post("http://localhost:5000/api/get_list_of_tradespeople")
      // axios.post('https://housing-passport-back-end.herokuapp.com/api/get_my_property')
      .then(function (response) {
        const receivedTradespeople = response.data;
        console.log("tradies: " + receivedTradespeople);
        console.log(chosenProperty);
        const newTrades = [];
        for (const i in receivedTradespeople) {
          newTrades.push([i, receivedTradespeople[i]]);
        }
        setListOfTradespeople(newTrades);
        setTradeSubmit(true);
      });
  };

  const onSubmit = async () => {
    setFormSubmit(true);
    updateGraph ? setUpdateGraph(false) : setUpdateGraph(true);
  };

  const onExtendTradeClick = (e, lmk_key, email) => {
    console.log(lmk_key);
    console.log(email);
    let data = '{"lmk_key":"' + lmk_key + '", "email":"' + email + '"}';
    console.log(data);
    data = JSON.parse(data);
    axios
      .post("http://localhost:5000/api/add_property_to_user", { data })
      // axios.post('https://housing-passport-back-end.herokuapp.com/api/add_property_to_user', {data}))
      .then(function (response) {
        console.log(response);
        if (response.data === "False") {
          setFailed(true);
          setTradeSubmit(false);
        }
        if (response.data === "True") {
          setAdded(true);
          setTradeSubmit(false);
        }
      });
  };

  return (
    <>
      {!session && <div> Sign in to view your properties </div>}
      {session && (
        <>
          <h2> Welcome to your properties page </h2>
          <h3> Browse your passports here: </h3>
          <SelectProperty
            properties={myProperties}
            chosenProperty=""
            onSubmit={(property) => setChosenProperty(property)}
            onSubmit2={() => setSelectSubmit(true)}
          />
          {isSelectSubmit && (
            <>
              <p></p>
              <div> Showing the passport for {chosenProperty["address"]}</div>
              <div color="error">
                {" "}
                Remove {chosenProperty["address"]} from your property list?{" "}
                <Button
                  type="submit"
                  size="small"
                  variant="text"
                  color="error"
                  onClick={(e) =>
                    onDeleteProperty(chosenProperty["content"]["ADDRESS"])
                  }
                >
                  {" "}
                  Remove <p></p>
                </Button>
              </div>
              {deleted === 1 && (
                <div>
                  {" "}
                  Delete successful. Please refresh the page to see the update{" "}
                </div>
              )}
              {deleted === 2 && (
                <div> Delete unsuccessful. Please try again. </div>
              )}
              <h2> Building Information </h2>
              <BasicTabs chosenProperty={chosenProperty} />
              <div> Retrofits undertaken: </div>
              {doneRetrofits &&
                doneRetrofits.map((item) => {
                  return (
                    <div className={styles.single} key={item}>
                      <CheckBoxIcon sx={{ color: "green" }}></CheckBoxIcon>{"  "}
                      {item}
                    </div>
                  );
                })}
              <hr />
              <h2>
                {" "}
                Recommendations for {chosenProperty["address"]}{" "}
                <RecsToggle
                  paybackOrCosts={paybackOrCosts}
                  handlePaybackOrCosts={(paybackOrCosts) =>
                    setPaybackOrCosts(paybackOrCosts)
                  }
                ></RecsToggle>{" "}
              </h2>
              {isRecomSubmit && paybackOrCosts === "costs" && (
                <RecsAndCosts
                  recommendations={recommendations}
                  address={chosenProperty["content"]["ADDRESS"]}
                  doneRetrofits={doneRetrofits}
                />
              )}
              {isRecomSubmit && paybackOrCosts === "payback" && (
                <RecsAndPayback
                  recommendations={recommendations}
                  chosenProperty={chosenProperty}
                  doneRetrofits={doneRetrofits}
                />
              )}
              <h4>
                {" "}
                Time to act on the recommendations? This one-stop-shop approach
                means that whenever you decide you are ready to act on these
                recommendations, you are able to extends permissions to your
                house to one of these tradespeople who have signed up to our
                service
              </h4>
              <Button
                type="submit"
                size="small"
                variant="text"
                onClick={(e) => onRetrieveTradesClick(e)}
              >
                Find a tradesperson
              </Button>
              {isTradeSubmit && (
                <h4> Extend permissions for {chosenProperty["address"]} to ... </h4>
              )}
              {isTradeSubmit &&
                listOfTradespeople.map((item) => {
                  return (
                    <div className={styles.single} key={item}>
                      {item[1]}
                      <Button
                        type="submit"
                        size="small"
                        variant="text"
                        onClick={(e) =>
                          onExtendTradeClick(e, epcData["LMK_KEY"], item[1])
                        }
                      >
                        {" "}
                        Extend permissions{" "}
                      </Button>
                    </div>
                  );
                })}
              {isAdded && <div> Permissions extended </div>}
              {isFailed && <div> Something went wrong </div>}
            </>
          )}
          <hr />
          <h2> Consumption Habits </h2>
          <h4>
            For data security reasons we will never ask you to store your
            sensitive Octopus API key on this site. This means each time you log
            in the site will not remember any of the following information and
            it will need to be submitted again
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
          {/* // <SmartVsPrice/> */}
          {isFormSubmit && (
            <SmartVsPrice
              mpn={mpn}
              serialNumber={serialNumber}
              authKey={authKey}
              timePeriod={timePeriod}
              date={date}
              chosenMonth={chosenMonth}
              updateGraph={updateGraph}
            />
          )}
          {isSelectSubmit && isFormSubmit && (
            <>
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
                  <Button variant="contained" onClick={handleAccuracySubmit}>
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
                totalFloorArea={chosenProperty["content"]["TOTAL_FLOOR_AREA"]}
                handleAccuracySubmit={accuracySubmit}
              ></AccuracyTester>
            </>
          )}
        </>
      )}
    </>
  );
};

export default MyProperties;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}
