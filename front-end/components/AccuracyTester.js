import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import AccuracyTesterCard from "./AccuracyTesterCard";

const AccuracyTester = ({
  lmk_key,
  mpan,
  serialElec,
  mprn,
  serialGas,
  authKey,
  totalFloorArea,
  handleAccuracySubmit,
  energyConsCurrent,
  handleCredentialsError,
  handleTotalConsumption
}) => {
  const [annualElec, setAnnualElec] = useState();
  const [annualGas, setAnnualGas] = useState();
  const [floorArea, setFloorArea] = useState();
  const [realECC, setRealECC] = useState();
  const [reply, setReply] = useState(false);
  const [higher, setHigher] = useState("");
  const [firstRenderStopper, setFirstRenderStopper] = useState(false);

  useEffect(() => {
    // authKey = "sk_live_F6fSk8HDazIy7wKmWnWA3tD9";
    // mpan = "1200038779673";
    // serialElec = "Z18N333768";
    // mprn = "511319507";
    // serialGas = "E6S17789941861";
    // if(firstRenderStopper === true) {
    axios
      // .post("http://localhost:5000/api/check_accuracy", {
      .post("https://housing-passport-back-end.herokuapp.com/api/check_accuracy", {
        lmk_key,
        mprn,
        serialElec,
        mpan,
        serialGas,
        authKey,
        totalFloorArea,
      })
      .then(function (response) {
        const receivedData = response.data;
        console.log(receivedData);
        handleCredentialsError(false)
        setAnnualElec(receivedData["annualElec"]);
        setAnnualGas(receivedData["annualGas"]);
        handleTotalConsumption((receivedData["annualElec"] + receivedData["annualGas"]).toFixed(2))
        setFloorArea(receivedData["floorArea"]);
        setRealECC(receivedData["result"].toFixed(2));
        setReply(true);
        if(parseFloat(realECC) < parseFloat(energyConsCurrent)){
          setHigher("estimate")
        } else if (parseFloat(energyConsCurrent) <= parseFloat(realECC)){
          setHigher("empiric")
        }
      }).catch(function (error){
        console.log("there's an error over here:")
        handleCredentialsError(true)
      });
    // }
    // setFirstRenderStopper(true)
  }, [handleAccuracySubmit]);

  return (
    <>
      <AccuracyTesterCard realECC={realECC} energyConsCurrent={energyConsCurrent} higher={higher}/>
    </>
  );
};

export default AccuracyTester;
