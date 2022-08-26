import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import ConsumptionComparisonCard from "./ConsumptionComparisonCard";

const ConsumptionComparison = ({
  chosenProperty,
  mpan,
  serialElec,
  mprn,
  serialGas,
  authKey,
  handleCompareSubmit,
  handleCredentialsError
}) => {
  const [result, setResult] = useState();
  const [floorAreaSend, setFloorAreaSend] = useState();
  const [imd, setImd] = useState();
  const [region, setRegion] = useState()
  const [credentialsError, setCredentialsError] = useState(false);
  const [firstRenderStopper, setFirstRenderStopper] = useState(false);

  const regionConverter = (code) => {
    switch(code){
      case("E12000001"):
        return "North East"
      case("E12000002"):
        return "North West"
      case("E12000003"):
        return "East Midlands"
      case("E12000004"):
        return "West Midlands"
      case("E12000005"):
        return "East"
      case("E12000006"):
        return "London"
      case("E12000007"):
        return "South East"
      case("E12000008"):
        return "South West"
      case("W92000004"):
        return "Wales"
    }
  }

  const floorAreaConverter = (number) => {
    switch(number){
      case(1):
        return "less than 50"
        break;
      case(2):
        return "between 50 - 100"
        break;
      case(3):
        return "between 100 - 150"
        break;
      case(4): 
        return "between 150 - 200"
        break;
      case(5):
        return "more than 200"
        break
      default:
        return "mistake"
    }
  }

  useEffect(() => {
    let builtForm = chosenProperty["content"]["BUILT_FORM"];
    let age = chosenProperty["content"]["CONSTRUCTION_AGE_BAND"];
    let floorArea = chosenProperty["content"]["TOTAL_FLOOR_AREA"];
    let postcode = chosenProperty["content"]["POSTCODE"];
    let walls = chosenProperty["content"]["WALLS_DESCRIPTION"];

    if(firstRenderStopper){
      axios
        // .post("http://localhost:5000/api/compare_property", {
        .post("https://housing-passport-app.vercel.app/api/compare_property", {
          builtForm,
          age,
          floorArea,
          postcode,
          walls,
        })
        .then(function (response) {
          const receivedData = response.data;
          console.log(receivedData);
          handleCredentialsError(false)
          setResult(parseFloat(receivedData["result"]).toFixed(2));
          setFloorAreaSend(floorAreaConverter(receivedData["args"][2]))
          setImd(receivedData["args"][3])
          setRegion(regionConverter(receivedData["region"]))
        }).catch(function(error){
          handleCredentialsError(true)
        });
      }
      setFirstRenderStopper(true)
  }, [handleCompareSubmit]);

  return (
    <ConsumptionComparisonCard
      result={result}
      builtForm={chosenProperty["content"]["BUILT_FORM"]}
      age={chosenProperty["content"]["CONSTRUCTION_AGE_BAND"].slice(18)}
      floorArea={floorAreaSend}
      imd={imd}
      region={region}
    />
  );
};

export default ConsumptionComparison;
