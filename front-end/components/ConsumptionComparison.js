import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import ConsumptionComparisonCard from './ConsumptionComparisonCard'

const ConsumptionComparison = ({
  chosenProperty,
  mpan,
  serialElec,
  mprn,
  serialGas,
  authKey,
  handleCompareSubmit,
}) => {
  useEffect(() => {
    // authKey = "sk_live_F6fSk8HDazIy7wKmWnWA3tD9";
    // mpan = "1200038779673";
    // serialElec = "Z18N333768";
    // mprn = "511319507";
    // serialGas = "E6S17789941861";

    // axios
    //   .post("http://localhost:5000/api/check_accuracy", {
    //     lmk_key,
    //     mprn,
    //     serialElec,
    //     mpan,
    //     serialGas,
    //     authKey,
    //   })
    //   // axios.post('https://housing-passport-back-end.herokuapp.com/api/check_accuracy')
    //   .then(function (response) {
    //     const receivedData = response.data;
    //     console.log(receivedData);
    // });

    let builtForm = chosenProperty["content"]["BUILT_FORM"];
    let age = chosenProperty["content"]["CONSTRUCTION_AGE_BAND"];
    let floorArea = chosenProperty["content"]["TOTAL_FLOOR_AREA"];
    let postcode = chosenProperty["content"]["POSTCODE"];
    let walls = chosenProperty["content"]["WALLS_DESCRIPTION"];

    axios.post("http://localhost:5000/api/compare_property", {
      builtForm,
      age,
      floorArea,
      postcode,
      walls,
    });
  }, [handleCompareSubmit]);

  return <ConsumptionComparisonCard/>;
};

export default ConsumptionComparison;
