import axios from "axios";
import { useEffect } from "react";

const AccuracyTester = ({
  lmk_key,
  mprn,
  serialElec,
  mpan,
  serialGas,
  authKey,
  totalFloorArea,
  handleAccuracySubmit,
}) => {
  useEffect(() => {
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
      });
  }, [handleAccuracySubmit]);

  return <h5> hello </h5>;
};

export default AccuracyTester;
