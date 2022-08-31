import { useSession, getSession } from "next-auth/react";
import { useLayoutEffect, useRef } from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/router";

import axios from "axios";
import BasicTabs from "../components/EpcTabs";
import SelectProperty from "../components/SelectProperty";
import styles from "../styles/List.module.css";
import RecsAndPayback from "../components/RecsAndPaybacks";
import RecsAndCosts from "../components/RecsAndCosts";
import RecStats from "../components/recommendationPrices.json" assert { type: "json" };
import RecsToggle from "../components/RecsToggle";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Alert from "@mui/material/Alert";
import Link from "next/link";
import Head from "next/head";

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
  const [chosenProperty, setChosenProperty] = useState();
  const [paybackOrCosts, setPaybackOrCosts] = useState("costs");
  const [privateRetrofits, setPrivateRetrofits] = useState([]);
  const [publicRetrofits, setPublicRetrofits] = useState([]);
  const [noRecommendations, setNoRecommendations] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

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
            let tempPublicRetrofits = receivedData[i]["public_retrofits"];
            let tempPrivateRetrofits = receivedData[i]["private_retrofits"];
            let recommendationsTemp = receivedData[i]["recommendations"];
            let retrofitsToRemove = [];
            if (tempPublicRetrofits && recommendationsTemp) {
              for (let i = 0; i < recommendationsTemp.length; i++) {
                for (let j = 0; j < tempPublicRetrofits.length; j++) {
                  if (recommendationsTemp[i][0] === tempPublicRetrofits[j]) {
                    retrofitsToRemove.push(recommendationsTemp[i][0]);
                  }
                }
              }
            } else {
              console.log("no public retrofits");
            }
            if (tempPrivateRetrofits && recommendationsTemp) {
              for (let i = 0; i < recommendationsTemp.length; i++) {
                for (let j = 0; j < tempPrivateRetrofits.length; j++) {
                  if (recommendationsTemp[i][0] === tempPrivateRetrofits[j]) {
                    retrofitsToRemove.push(recommendationsTemp[i][0]);
                  }
                }
              }
            } else {
              console.log("no private retrofits");
            }
            for (let k = 0; k < retrofitsToRemove.length; k++) {
              // this is hella hacky
              recommendationsTemp = recommendationsTemp.map((j) =>
                j.filter((e) => e !== retrofitsToRemove[k])
              );
              recommendationsTemp = recommendationsTemp.filter(
                (j) => j.length > 1
              );
            }
            newProperties.push({
              address: receivedData[i]["address"],
              content: receivedData[i]["content"],
              publicRetrofits: receivedData[i]["public_retrofits"],
              privateRetrofits: receivedData[i]["private_retrofits"],
              recommendations: recommendationsTemp,
            });
            setMyProperties(newProperties);
            setLoading(false);
          }
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
      /* THIS SECTION ADDS THE PRICES OF PAYBACK PERIODS OF THE RECS */
      if (chosenProperty["recommendations"][0][0] !== null) {
        setNoRecommendations(false);
        for (let i = 0; i < chosenProperty["recommendations"].length; i++) {
          for (let j = 0; j < RecStats.recList.length; j++) {
            if (
              chosenProperty["recommendations"][i][0]
                .toLowerCase()
                .replaceAll(" ", "_")
                .includes(RecStats.recList[j])
            ) {
              const builtForm = chosenProperty["content"]["BUILT_FORM"]
                .toLowerCase()
                .replaceAll("-", "_");
              if (RecStats.builtForms.includes(builtForm)) {
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

                chosenProperty["recommendations"][i][2] =
                  timeBackLast + " years";
                chosenProperty["recommendations"][i][3] =
                  timeBackNow + " years";
                chosenProperty["recommendations"][i][4] =
                  timeBackNext + " years";
              } else {
                const timeBackNow = (
                  RecStats.InstallationCost[RecStats.recList[j]] /
                  RecStats.BillSavings[RecStats.recList[j]]
                ).toFixed(2);
                const timeBackLast = (
                  RecStats.InstallationCost[RecStats.recList[j]] /
                  (RecStats.BillSavings[RecStats.recList[j]] * 0.57)
                ).toFixed(2);
                const timeBackNext = (
                  RecStats.InstallationCost[RecStats.recList[j]] /
                  (RecStats.BillSavings[RecStats.recList[j]] * 1.81)
                ).toFixed(2);

                chosenProperty["recommendations"][i][2] =
                  timeBackLast + " years";
                chosenProperty["recommendations"][i][3] =
                  timeBackNow + " years";
                chosenProperty["recommendations"][i][4] =
                  timeBackNext + " years";
              }
              setRecommendations(chosenProperty["recommendations"]);
              setPrivateRetrofits(chosenProperty["privateRetrofits"]);
              setPublicRetrofits(chosenProperty["publicRetrofits"]);
              setRecomSubmit(true);
            }
          }
        }
      } else {
        setNoRecommendations(true);
      }
    }
  }, [chosenProperty]);

  if (isLoading) return <p> Loading... </p>;

  const onDeleteProperty = (address) => {
    const email = session.user.email;
    axios
      // .post("http://localhost:5000/api/delete_property_from_user", {
      .post(
        "https://housing-passport-back-end.herokuapp.com/api/delete_property_from_user",
        {
          address,
          email,
        }
      )
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

  const onRetrieveTradesClick = () => {
    axios
      // .post("http://localhost:5000/api/get_list_of_tradespeople")
      .post(
        "https://housing-passport-back-end.herokuapp.com/api/get_list_of_tradespeople"
      )
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

  const onExtendTradeClick = (
    e,
    lmk_key,
    tradeEmail,
    homeownerEmail,
    public_retrofits,
    private_retrofits
  ) => {
    let data = {
      lmk_key: lmk_key,
      tradeEmail: tradeEmail,
      homeownerEmail: homeownerEmail,
      public_retrofits: public_retrofits,
      private_retrofits: private_retrofits,
    };

    axios
      // .post("http://localhost:5000/api/extend_permissions_to_tradesperson", {
      .post(
        "https://housing-passport-back-end.herokuapp.com/api/extend_permissions_to_tradesperson",
        {
          data,
        }
      )
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
      <Head>
        <title> Housing Passport | My Properties </title>
      </Head>
      {!session && (
        <div>
          {" "}
          <Link href="api/auth/signin">Sign in</Link> to view your properties{" "}
        </div>
      )}
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
                <Alert severity="success">
                  {" "}
                  Delete successful. Page refreshing to update...{" "}
                  {window.location.reload()}
                </Alert>
              )}
              {deleted === 2 && (
                <Alert severity="error">
                  {" "}
                  Delete unsuccessful. Please try again.{" "}
                </Alert>
              )}
              <h2> Building Information </h2>
              <BasicTabs chosenProperty={chosenProperty} />
              {publicRetrofits && (
                <>
                  <div> Retrofits undertaken (public): </div>
                  {publicRetrofits.map((item) => {
                    return (
                      <>
                        <div className={styles.single} key={item}>
                          <CheckBoxIcon sx={{ color: "green" }}></CheckBoxIcon>
                          {"  "}
                          {item}
                        </div>
                      </>
                    );
                  })}
                </>
              )}

              {privateRetrofits && (
                <>
                  <div> Retrofits undertaken (private to you): </div>
                  {privateRetrofits.map((item) => {
                    return (
                      <>
                        <div className={styles.single} key={item}>
                          <CheckBoxIcon sx={{ color: "green" }}></CheckBoxIcon>
                          {"  "}
                          {item}
                        </div>
                      </>
                    );
                  })}
                </>
              )}
              <hr />
              {noRecommendations && (
                <h1> No recommendations at this property ! </h1>
              )}
              {!noRecommendations && (
                <>
                  <h2>
                    {" "}
                    Recommendations for {chosenProperty["address"]}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
                      lmk_key={chosenProperty["content"]["LMK_KEY"]}
                    />
                  )}
                  {isRecomSubmit && paybackOrCosts === "payback" && (
                    <RecsAndPayback
                      recommendations={recommendations}
                      chosenProperty={chosenProperty}
                    />
                  )}
                  {session.user.role === "homeowner" && (
                    <>
                      <h4>
                        {" "}
                        Time to act on the recommendations? This one-stop-shop
                        approach means that whenever you decide you are ready to
                        act on these recommendations, you are able to extends
                        permissions to your house to one of these tradespeople
                        who have signed up to our service
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
                        <h4>
                          {" "}
                          Extend permissions for {chosenProperty["address"]} to
                          ...{" "}
                        </h4>
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
                                  onExtendTradeClick(
                                    e,
                                    chosenProperty["content"]["LMK_KEY"],
                                    item[1],
                                    session.user.email,
                                    publicRetrofits,
                                    privateRetrofits
                                  )
                                }
                              >
                                {" "}
                                Extend permissions{" "}
                              </Button>
                            </div>
                          );
                        })}
                      {isAdded && (
                        <Alert severity="success"> Permissions extended</Alert>
                      )}
                      {isFailed && (
                        <Alert severity="error"> Something went wrong</Alert>
                      )}
                      <hr />
                    </>
                  )}
                </>
              )}
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
