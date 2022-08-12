import { useSession, getSession } from "next-auth/react";
import { useLayoutEffect, useRef } from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import axios from "axios";
import BasicTabs from "../components/EpcTabs";
import SelectProperty from "../components/SelectProperty";
import styles from "../styles/List.module.css";
import SmartVsPrice from "../components/SmartVsPrice";
import RecsAndPayback from "../components/RecsAndPaybacks";
import RecStats from "../components/recommendationPrices.json" assert { type: "json" };

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
  const [chosenProperty, setChosenProperty] = useState([]);

  const [mpn, setMpn] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [authKey, setAuthKey] = useState("");
  const [isFormSubmit, setFormSubmit] = useState(false);

  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (session.user.role === "homeowner") {
      const payload = session.user.email;
      axios
        .post("http://localhost:5000/api/retrieve_my_properties", { payload })
        // axios.post('https://housing-passport-back-end.herokuapp.com/api/get_my_property', {data})
        .then(function (response) {
          const receivedData = response.data;
          // console.log("receieveddaa" + JSON.stringify(receivedData));
          const newProperties = [];
          for (const i in receivedData) {
            newProperties.push([i, receivedData[i]]);
          }
          // console.log(newProperties)
          setMyProperties(newProperties);
        })
        .catch(function (error) {
          console.log("initial oops");
          console.log(error);
        });
    }
  }, []);

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
            chosenProperty[1][0]["LMK_KEY"],
          config
        )
        .then(function (response) {
          const recommendationsFull = response.data["rows"];
          let recommendationsTemp = [];
          console.log(recommendationsFull);
          for (const i in recommendationsFull) {
            recommendationsTemp.push([
              recommendationsFull[i]["improvement-id-text"],
              recommendationsFull[i]["indicative-cost"],
            ]);
          }
          console.log(recommendationsTemp);

          /* THIS SECTION ADDS THE PRICES OF PAYBACK PERIODS OF THE RECS */

          for (let i = 0; i < recommendationsTemp.length; i++) {
            console.log(
              recommendationsTemp[i][0].toLowerCase().replaceAll(" ", "_")
            );
            for (let j = 0; j < RecStats.recList.length; j++) {
              if (
                recommendationsTemp[i][0]
                  .toLowerCase()
                  .replaceAll(" ", "_")
                  .includes(RecStats.recList[j])
              ) {
                // console.log(recommendationsTemp[i][0])
                const builtForm = chosenProperty[1][0]["BUILT_FORM"]
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

          setRecommendations(recommendationsTemp);
          setRecomSubmit(true);
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
          <h3> Browse your property EPC data here: </h3>
          <SelectProperty
            properties={myProperties}
            chosenProperty=""
            onSubmit={(property) => setChosenProperty(property)}
            onSubmit2={() => setSelectSubmit(true)}
          />
          {isSelectSubmit && (
            <>
              <h4> Showing results for {chosenProperty[0]}</h4>
              <div color="error">
                {" "}
                Remove {chosenProperty[0]} from your property list?{" "}
                <Button
                  type="submit"
                  size="small"
                  variant="text"
                  color="error"
                  onClick={(e) =>
                    onDeleteProperty(chosenProperty[1][0]["ADDRESS"])
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
              <BasicTabs chosenProperty={chosenProperty} />
              <hr />
              <h5> Recommendations for {chosenProperty[0]} </h5>
              {isRecomSubmit && (
                <RecsAndPayback
                  recommendations={recommendations}
                  chosenProperty={chosenProperty}
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
                <h4> Extend permissions for {chosenProperty[0]} to ... </h4>
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
          <h3> Examine your smart meter data here: </h3>
          <h4>
            For data security reasons we will never ask you to store your
            sensitive Octopus API key on this site. This means each time you log
            in the site will not remember any of the following information and
            it will need to be submitted again
          </h4>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <label htmlFor="mpn">mpn:{"   "}</label>
            <input
              id="mpn"
              aria-invalid={errors.mpn ? "true" : "false"}
              {...register("mpn")}
              // {...register('mpn', { required: true })}
            />
            <p></p>
            <label htmlFor="serialNumber">serialNumber:{"   "}</label>
            <input
              id="serialNumber"
              aria-invalid={errors.serialNumber ? "true" : "false"}
              {...register("serialNumber")}
            />
            <p></p>
            <label htmlFor="authKey">authKey:{"   "}</label>
            <input
              id="authKey"
              aria-invalid={errors.authKey ? "true" : "false"}
              {...register("authKey")}
            />
            <p></p>
            <select {...register("timeframe", { required: true })}>
              <option defaultValue="day"> Day </option>
              <option value="week"> Week </option>
              <option value="month"> Month </option>
              <option value="year"> Year </option>
            </select>
            {"   "}
            {/* <input type="submit" /> */}
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </form>
          {/* // <SmartVsPrice/> */}
          {isFormSubmit && (
            <SmartVsPrice
              mpn={mpn}
              serialNumber={serialNumber}
              authKey={authKey}
            />
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
