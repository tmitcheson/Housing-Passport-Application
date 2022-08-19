/* eslint-disable no-unused-vars */
import Head from "next/head";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  // the head component does the tab name
  if (status === "authenticated") {
    return (
      <>
        <Head>
          <title> Housing Passport | Home </title>
          <link rel="hp icon" href="/favicon.ico.png"/>
        </Head>
        <h1>
          Welcome {session.user.name} the {session.user.role}!
        </h1>
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
