import "../styles/globals.css";
import React from "react";
import Layout from "../components/Layout";
// import { withFronteggApp } from '@frontegg/nextjs';
import { SessionProvider, useSession } from "next-auth/react";
import { Auth0Provider } from "@auth0/auth0-react";

export default function App({ Component, pageProps }) {
  return (
    <Auth0Provider>
      <SessionProvider session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </Auth0Provider>
  );
}

// function Auth({ children }) {
//   const { data: session, status } = useSession({ required: true });

//   if (status === "loading") {
//     return <div> Loading... </div>;
//   }

//   return children;
// }
