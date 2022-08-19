/* eslint-disable no-unused-vars */
import Navigation from './Navigation';
import Footer from './Footer';
import Head from "next/head"

const Layout = ({ children }) => {
  return ( 
    <div className='content'>
      <Head>
        <link rel="hp icon" href="/favicon.ico.png"/>
      </Head>
      <Navigation/>
      {children}
      <Footer/>
    </div>
  );
};
 
export default Layout;