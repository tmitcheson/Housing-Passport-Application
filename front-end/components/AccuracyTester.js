import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const AccuracyTester = ({
  lmk_key,
  mprn,
  serialElec,
  mpan,
  serialGas,
  authKey,
  totalFloorArea,
  handleAccuracySubmit,
  energyConsCurrent
}) => {
  const [annualElec, setAnnualElec] = useState();
  const [annualGas, setAnnualGas] = useState();
  const [floorArea, setFloorArea] = useState();
  const [realCEC, setRealCEC] = useState();
  const [reply, setReply] = useState(false);

  useEffect(() => {
    authKey = "sk_live_F6fSk8HDazIy7wKmWnWA3tD9";
    mpan = "1200038779673";
    serialElec = "Z18N333768";
    mprn = "511319507";
    serialGas = "E6S17789941861";
    axios
      .post("http://localhost:5000/api/check_accuracy", {
        lmk_key,
        mprn,
        serialElec,
        mpan,
        serialGas,
        authKey,
        totalFloorArea,
      })
      // axios.post('https://housing-passport-back-end.herokuapp.com/api/check_accuracy')
      .then(function (response) {
        const receivedData = response.data;
        console.log(receivedData);
        setAnnualElec(receivedData["annualElec"]);
        setAnnualGas(receivedData["annualGas"]);
        setFloorArea(receivedData["floorArea"]);
        setRealCEC(receivedData["result"].toFixed(2));
        setReply(true);
      });
  }, [handleAccuracySubmit]);

  return (
    <>
      <div>
        {" "}
        Based on your real energy consumption, your Current Energy Consumption,
        as defined in the EPC, should be: {realCEC}{" "}.
      </div>
      <div> However it is currently described as: {energyConsCurrent}</div>
    </>
  );
};

export default AccuracyTester;
