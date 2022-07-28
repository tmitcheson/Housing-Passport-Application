import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Navigation = () => {
  const { data: session, status } = useSession();
  return ( 
    <nav>
      <div className='logo'>
        <h1> Housing Passport Application </h1>
        {status === 'authenticated' &&
                    <h5> Signed in as {session.user.email}</h5>}
      </div>
      <Link href='/'><a> Home </a></Link>
      <Link href='/myProperties'><a>My Properties</a></Link>
      <Link href='/search'><a> Search </a></Link>
      <Link href='/postcodeSearch'><a> Postcode Search </a></Link>
      {status === 'authenticated' &&
                <Link href='/api/auth/signout'> Log out </Link>}
      {status !== 'authenticated' &&
                <Link href='/api/auth/signin'> Login </Link>}
    </nav>
  );
};
 
export default Navigation;