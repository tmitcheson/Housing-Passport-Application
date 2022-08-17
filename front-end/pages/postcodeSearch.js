import axios from "axios";
import React from "react";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSession, getSession } from "next-auth/react";
import Button from "@mui/material/Button";
import styles from "../styles/List.module.css";
import Link from "next/link";
import { Box } from "@mui/system";
import { TextField } from "@mui/material";
import { useRouter } from "next/router";

export default function PostcodeSearch() {
  const [isSubmitted, setSubmitted] = useState(false);
  const [isAdded, setAdded] = useState(false);
  const [isFailed, setFailed] = useState(false);
  const [listOfAddresses, setListOfAddresses] = useState([]);
  const [postcode, setPostcode] = useState("");
  const { data: session, status } = useSession();

  const router = useRouter()
  const{pid} = router.query

  const onSubmit = () => {
    setSubmitted(true);
    setAdded(false);
    setFailed(false);

    // CODE FOR ALLOWING MORE POSTCODE VARIATIONS
    let manipulatedPostcode = postcode.toUpperCase()
    if(!(manipulatedPostcode.includes(" "))){
      if(manipulatedPostcode.length === 5){
        manipulatedPostcode = manipulatedPostcode.slice(0,2) + " " + manipulatedPostcode.slice(2,5)
      } else if (manipulatedPostcode.length === 6){
        manipulatedPostcode = manipulatedPostcode.slice(0,3) + " " + manipulatedPostcode.slice(3,6)
      } else if (manipulatedPostcode.length === 7){
        manipulatedPostcode = manipulatedPostcode.slice(0,4) + " " + manipulatedPostcode.slice(4,7)
      }
      }
    const data = JSON.parse("{\"postcode\":\"" + manipulatedPostcode + "\"}")

    axios
      .post("http://localhost:5000/api/get_list_of_addresses", { data })
      // axios.post('https://housing-passport-back-end.herokuapp.com/api/get_list_of_addresses', {data})
      .then(function (response) {
        const receivedData = response.data;
        console.log(receivedData);
        const newData = [];
        // console.log(status)
        for (const i in receivedData) {
          newData.push([i, receivedData[i]]);
        }
        setListOfAddresses(newData);
      });
  };

  const onSignedInClick = (data) => {
    data =
      '{"lmk_key":"' + data[1] + '", "email": "' + session.user.email + '"}';
    console.log(data);
    data = JSON.parse(data);
    console.log("payload ready to go: " + data);
    axios
      .post("http://localhost:5000/api/add_property_to_user", { data })
      // axios.post('https://housing-passport-back-end.herokuapp.com/api/add_property_to_user', {data})
      .then(function (response) {
        console.log(response);
        if (response.data === "False") {
          setFailed(true);
          setSubmitted(false);
        }
        if (response.data === "True") {
          setAdded(true);
          setSubmitted(false);
        }
      });
  };

  const onSignedOutClick = (data) => {
    router.push("property/" + data[1])
  }

  return (
    <>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        // autoComplete="off"
      >
        <div>
          <TextField
            required
            id="postcode"
            label="Postcode"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
          <Button variant="contained" onClick={onSubmit}>
            Submit
          </Button>
        </div>
      </Box>
        {isSubmitted && (
          <div className="listOfAddresses">
            <div>
              {" "}
              Possible Addresses
              {listOfAddresses.map((item) => {
                return (
                  <div
                    href={"/property/" + item[1]}
                    className={styles.single}
                    key={item}
                  >
                    {item[0]}
                    {session && (
                      <Button
                        type="submit"
                        size="small"
                        variant="text"
                        onClick={(e) => onSignedInClick(item, e)}
                      >
                        Claim Property
                      </Button>
                    )}
                    {!session && (
                      <Button
                        type="submit"
                        size="small"
                        variant="text"
                        onClick={(e) => onSignedOutClick(item, e)}
                      >
                        View Property
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {isAdded && (
          <>
            <h1> Property added ! </h1>
            <Link href="/myProperties"> View my properties </Link>
          </>
        )}
        {isFailed && <h1> Something went wrong! Try again </h1>}
      {/* </form> */}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}
