/* eslint-disable no-unused-vars */
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = ({ children }) => {
  return ( 
    <div className='content'>
      <Navigation/>
      {children}
      <Footer/>
    </div>
  );
};
 
export default Layout;