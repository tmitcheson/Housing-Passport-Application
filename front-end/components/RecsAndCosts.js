import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";
import axios from "axios";

const RecsAndCosts = ({ recommendations, address, doneRetrofits }) => {
  const [achieved, setAchieved] = useState(false);
  const [done, setDone] = useState();
  const [successfulShare, setSuccessfulShare] = useState();
  const [successfulNoShare, setSuccessfulNoShare] = useState();
  const [recsForCosts, setRecsForCosts] = useState([]);
  const [retrosForCosts, setRetrosForCosts] = useState([])
  const { data: session, status } = useSession();

  // useEffect(() => {
  //   setRecsForCosts(recommendations)
  //   setRetrosForCosts(doneRetrofits)
  //   let indexesToRemove = [];
  //   console.log("sanitycheck:");
  //   // console.log(doneRetrofits);
  //   console.log(recommendationsTemp);
  //   if (tempRetros) {
  //     for (let i = 0; i < recommendationsTemp.length; i++) {
  //       for (let j = 0; j < tempRetros.length; j++) {
  //         if (recommendationsTemp[i][0] === tempRetros[j]) {
  //           console.log("matchy:");
  //           // console.log(recommendationsTemp[i][0]);
  //           let indexToRemove = recommendationsTemp.indexOf(tempRetros[j])
  //           recommendationsTemp.splice(indexToRemove, 1);
  //           // indexesToRemove.push(i);
  //           // console.log(indexesToRemove);
  //         }
  //       }
  //     }
  //     for (let k = 0; k < indexesToRemove.length; k++) {
  //       console.log(indexesToRemove[k])
  //       console.log(recommendationsTemp)
  //       recommendationsTemp.splice(indexesToRemove[k], 1);
  //       console.log(recommendationsTemp)
  //     }
  //     // console.log(recommendationsTemp);
  //   } else {
  //     console.log("no done retrofits");
  //   }

  // }, [])

  const handleAchieved = (index) => {
    setDone(index);
  };

  const handleShare = (retrofit, index) => {
    const email = session.user.email;
    axios
      .post("http://localhost:5000/api/update_retrofit_share", {
        retrofit,
        email,
        address,
      })
      // axios.post('https://housing-passport-back-end.herokuapp.com/api/update_retrofit_share', {retrofit}))
      .then(function (response) {
        console.log(response.data);
        if (response.data === "True") {
          setSuccessfulShare(index);
          setDone();
        }
        console.log(response);
      });
  };

  const handleNoShare = (retrofit, index) => {
    const email = session.user.email;
    axios
      .post("http://localhost:5000/api/update_retrofit_no_share", {
        retrofit,
        email,
        address,
      })
      // axios.post('https://housing-passport-back-end.herokuapp.com/api/update_retrofit_no_share', {retrofit}))
      .then(function (response) {
        console.log(response);
        if (response.data === "True") {
          setSuccessfulNoShare(index);
          setDone();
        }
      });
  };

  const handleUndo = () => {
    setDone();
  };

  return (
    <table>
      <thead key="headers">
        <tr>
          <th> Recommendation </th>
          <th> Indicative Cost </th>
        </tr>
      </thead>
      <tbody>
        {recommendations.map((item, index) => {
          return (
            <tr key={item}>
              <td> {item[0]} </td>
              <td> {item[1]} </td>
              {done !== index && (
                <td>
                  {" "}
                  <Button
                    variant="contained"
                    onClick={() => handleAchieved(index)}
                  >
                    {" "}
                    I've done this!{" "}
                  </Button>
                </td>
              )}
              {done === index && (
                <td>
                  <Button
                    variant="contained"
                    onClick={() => handleShare(item[0], index)}
                  >
                    {" "}
                    Share Publicly{" "}
                  </Button>{" "}
                  <Button
                    variant="contained"
                    onClick={() => handleNoShare(item[0], index)}
                  >
                    {" "}
                    Keep Private{" "}
                  </Button>{" "}
                  <Button
                    sx={{ backgroundColor: "red" }}
                    variant="contained"
                    onClick={() => handleUndo(item[0], index)}
                  >
                    {" "}
                    Undo{" "}
                  </Button>
                </td>
              )}
              {successfulShare === index && <td> Retrofit added </td>}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default RecsAndCosts;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}
