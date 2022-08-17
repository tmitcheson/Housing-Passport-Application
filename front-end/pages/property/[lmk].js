import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import BasicTabs from "../../components/EpcTabs";
import { useState } from "react";

const propertyDetails = () => {
  const router = useRouter();
  const [epcReady, setEpcReady] = useState(false);
  const [chosenProperty, setChosenProperty] = useState({});

  useEffect(() => {
    const lmk_key = router.query["lmk"];
    console.log(lmk_key);
    axios
      .post("http://localhost:5000/api/get_a_doc", { lmk_key })
      .then(function (response) {
        console.log(response.data);
        const epcData = response.data;
        setChosenProperty({ content: epcData });
        setEpcReady(true);
      });
  }, [router]);

  return (
    <div>
      {epcReady && (
        <>
          <h1> Showing data for {chosenProperty["content"]["ADDRESS"]}</h1>
          <BasicTabs chosenProperty={chosenProperty} />
        </>
      )}
    </div>
  );
};

export default propertyDetails;
