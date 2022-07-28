import '../styles/globals.css';
import React from 'react';
import Layout from '../components/Layout';
// import { withFronteggApp } from '@frontegg/nextjs';
import { SessionProvider, useSession } from 'next-auth/react';

export default function App({ Component, pageProps}) {
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps}/>
        </Auth>
      ) : (
        <Component {...pageProps}/>
      )}
      </Layout>
    </SessionProvider>
  );
}

function Auth({ children }) {
  const { data: session, status } = useSession({required : true})

  if(status === "loading"){
    return <div> Loading... </div>
  }

  return children
}
