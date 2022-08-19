import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import BasicTabs from "../../components/EpcTabs";
import { useState } from "react";
import { set } from "react-hook-form";
import styles from "../../styles/List.module.css";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const propertyDetails = () => {
  const router = useRouter();
  const [epcReady, setEpcReady] = useState(false);
  const [chosenProperty, setChosenProperty] = useState({});
  const [retrofitsPresent, setRetrofitsPresent] = useState(false);
  const [retrofits, setRetrofits] = useState();

  useEffect(() => {
    const lmk_key = router.query["lmk"];
    console.log(lmk_key);
    axios
      .post("http://localhost:5000/api/get_a_doc", { lmk_key })
      .then(function (response) {
        console.log(response.data);
        const epcData = response.data;
        setChosenProperty({ content: epcData });
        if (epcData["retrofits"]) {
          setRetrofitsPresent(true);
          setRetrofits(epcData["retrofits"]);
        }
        setEpcReady(true);
      });
  }, [router]);

  return (
    <>
      <div>
        {epcReady && (
          <>
            <h1> Showing data for {chosenProperty["content"]["ADDRESS"]}</h1>
            <BasicTabs chosenProperty={chosenProperty} />
          </>
        )}
      </div>
      {retrofitsPresent && (
        <>
          <div> Retrofits undertaken: </div>
          {retrofits.map((item) => {
            return (
              <div className={styles.single} key={item}>
                <CheckBoxIcon sx={{ color: "green" }}></CheckBoxIcon>
                {"  "}
                {item[0]}
              </div>
            );
          })}
        </>
      )}
    </>
  );
};

export default propertyDetails;
