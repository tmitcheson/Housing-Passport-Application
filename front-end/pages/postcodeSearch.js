import axios from "axios";
import React from "react";

import Head from "next/head";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSession, getSession } from "next-auth/react";
import Button from "@mui/material/Button";
import styles from "../styles/List.module.css";
import Link from "next/link";
import { Box } from "@mui/system";
import { Stack, TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/router";

export default function PostcodeSearch() {
  const [isSubmitted, setSubmitted] = useState(false);
  const [isAdded, setAdded] = useState(false);
  const [isFailed, setFailed] = useState(false);
  const [listOfAddresses, setListOfAddresses] = useState([]);
  const [postcode, setPostcode] = useState("");
  const { data: session, status } = useSession();
  const [errorInput, setErrorInput] = useState(false);

  const router = useRouter();
  const { pid } = router.query;

  const onSearchSubmit = () => {
    setSubmitted(true);
    setAdded(false);
    setFailed(false);

    // CODE FOR ALLOWING MORE POSTCODE VARIATIONS
    let manipulatedPostcode = postcode.toUpperCase();
    if (!manipulatedPostcode.includes(" ")) {
      if (manipulatedPostcode.length === 5) {
        manipulatedPostcode =
          manipulatedPostcode.slice(0, 2) +
          " " +
          manipulatedPostcode.slice(2, 5);
      } else if (manipulatedPostcode.length === 6) {
        manipulatedPostcode =
          manipulatedPostcode.slice(0, 3) +
          " " +
          manipulatedPostcode.slice(3, 6);
      } else if (manipulatedPostcode.length === 7) {
        manipulatedPostcode =
          manipulatedPostcode.slice(0, 4) +
          " " +
          manipulatedPostcode.slice(4, 7);
      }
    }
    const data = JSON.parse('{"postcode":"' + manipulatedPostcode + '"}');

    axios
      // .post("http://localhost:5000/api/get_list_of_addresses", { data })
      .post('https://housing-passport-back-end.herokuapp.com/api/get_list_of_addresses', {data})
      .then(function (response) {
        const receivedData = response.data;
        console.log(receivedData);

        if (Object.keys(receivedData).length === 0) {
          setErrorInput(true);
        } else {
          setErrorInput(false);
          const newData = [];
          for (const i in receivedData) {
            newData.push([i, receivedData[i]]);
          }
          setListOfAddresses(newData);
        }
      })
      .catch(function (error) {
        console.log(error);
        setErrorInput(true);
      });
  };

  const onSignedInClick = (data) => {
    data =
      '{"lmk_key":"' + data[1] + '", "email": "' + session.user.email + '"}';
    console.log(data);
    data = JSON.parse(data);
    console.log("payload ready to go: " + data);
    axios
      // .post("http://localhost:5000/api/add_property_to_user", { data })
      .post('https://housing-passport-back-end.herokuapp.com/api/add_property_to_user', {data})
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
    router.push("property/" + data[1]);
  };

  return (
    <>
      <Head>
        <title> Housing Passport | Search </title>
      </Head>
      <Stack
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        // autoComplete="off"
      >
        <div>
          {!errorInput && (
            <TextField
              required
              id="postcode"
              label="Postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />
          )}
          {errorInput && (
            <TextField
              error
              id="postcode"
              label="Postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              helperText="That's not a valid postcode!"
            />
          )}
          <Button variant="contained" onClick={onSearchSubmit}>
            Submit
          </Button>
        </div>
      </Stack>
      {isSubmitted && !errorInput && (
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
                  {session.user.role === "homeowner" && (
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
                  {session.user.role === "tradesperson" && (
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
          <Alert severity="success"> Property added! </Alert>
          <br></br>
          <Link href="/myProperties"> View my properties </Link>
        </>
      )}
      {isFailed && (
        <Alert severity="error"> Something went wrong! Please try again.</Alert>
      )}
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
