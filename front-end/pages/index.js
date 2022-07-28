/* eslint-disable no-unused-vars */
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  // the head component does the tab name
  if (status === 'authenticated') {
    return (
      <>
        <Head>
          <title> Housing Passport | Home </title>
        </Head>
        <h1>Welcome {session.user.name} the {session.accessToken}!</h1>
        <a href='/api/auth/signout'>
        Logout
        </a>
      </>
    );
  }
  return (<a href='/api/auth/signin'>
    <h1>Login</h1>
  </a>);
}