/* eslint-disable no-unused-vars */
import Head from "next/head";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import SummarizeIcon from "@mui/icons-material/Summarize";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  verticalAlign: "sub",
  fontSize: "17px",
  color: "#333",
  "&:hover": { backgroundColor: "#87CB76" },
  fontFamily: "Nunito",
}));

export default function Home() {
  const { data: session, status } = useSession();

  // the head component does the tab name
  if (status === "authenticated") {
    return (
      <>
        <Head>
          <title> Housing Passport | Home </title>
          <meta
            name="Housing Passport"
            content="Housing Passport application EPC Energy Efficiency"/>
        </Head>
        <h1>
          Welcome {session.user.name} the {session.user.role}!
        </h1>

        <Box sx={{ width: "100%" }}>
          <Stack spacing={2}>
            <Item sx={{ textAlign: "left" }}>
              <SearchIcon color="green" fontSize="large" /> Search for your
              property on the Postcode Search Page
            </Item>
            <Item sx={{ textAlign: "right" }}>
              Then browse its energy efficiency information on the My Properties
              page <SummarizeIcon fontSize="large" />
            </Item>
            <Item sx={{ textAlign: "left" }}>
              <AnalyticsIcon fontSize="large" /> If you are an Octopus Energy
              customer, then you're able to get real consumption information on
              our Insights page{" "}
            </Item>
          </Stack>
        </Box>
        <br></br>
        <Link href="/api/auth/signout">Logout</Link>
      </>
    );
  }
  return (
    <Link href="/api/auth/signin">
      <h1>Login</h1>
    </Link>
  );
}
