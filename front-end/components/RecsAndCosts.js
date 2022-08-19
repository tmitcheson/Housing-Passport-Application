import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";

const RecsAndCosts = ({ recommendations, address, lmk_key }) => {
  const [achieved, setAchieved] = useState(false);
  const [done, setDone] = useState();
  const [successfulShare, setSuccessfulShare] = useState();
  const [successfulNoShare, setSuccessfulNoShare] = useState();
  const [recsForCosts, setRecsForCosts] = useState([]);
  const [retrosForCosts, setRetrosForCosts] = useState([]);
  const { data: session, status } = useSession();

  const router = useRouter()

  const handleAchieved = (index) => {
    setDone(index);
  };

  const handleShare = (retrofit, cost, index) => {
    const email = session.user.email;
    axios
      .post("http://localhost:5000/api/update_retrofit_share", {
        retrofit,
        cost,
        lmk_key,
        address,
        email,
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
                    onClick={() => handleShare(item[0], item[1], index)}
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
              {successfulNoShare === index && (
                  <td>
                    {" "}
                    Retrofit added. Page will refresh to update in 3 seconds{" "}
                    {setTimeout(() => {
                      router.reload(window.location.pathname);
                    }, 3000)}
                  </td>
              )}
              {successfulShare === index && (
                  <td>
                    {" "}
                    Retrofit added. Page will refresh to update in 3 seconds{" "}
                    {setTimeout(() => {
                      router.reload(window.location.pathname);
                    }, 3000)}
                  </td>
                )}
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
