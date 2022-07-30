// import axios from 'axios';
// import { useSession } from 'next-auth/react';
// import getAccessToken from '../components/getAccessToken';

// const authEnd = () => {

//   const { data: session, status } = useSession();

//   const access_token = getAccessToken();

//   const options = {
//     method: 'GET',
//     // url: 'https://housing-passport-backend.herokuapp.com/api/private',
//     url: 'http://localhost:5000/api/private',
//     headers: { authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkZCSDUwOEQwNlJpZF9TV0Y3UThPXyJ9.eyJpc3MiOiJodHRwczovL2Rldi01ZzBqOWkyei51cy5hdXRoMC5jb20vIiwic3ViIjoibnpCb0o2VFR5VjlRWGRPamNpMXpmSVp3MzRobXV0N2xAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vaG91c2luZy1wYXNzcG9ydC1iYWNrZW5kLmNvbSIsImlhdCI6MTY1OTExMzc2OSwiZXhwIjoxNjU5MjAwMTY5LCJhenAiOiJuekJvSjZUVHlWOVFYZE9qY2kxemZJWnczNGhtdXQ3bCIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.Q3qbHVmbQYhVOwaVQV42qAukRm2k1yRt9IyqT41vzeM2eSoyeY3QX1NeoIW_OB_v6HQu9yNEbWzxs-APOZRC3LOO2i3-_FURe1ic6JoXl9iLkCbK8ko0oA60RWASmkceTax3HP_YgVbGSrusI6vFzvG0-t-2TnsPq92UyL1Rugos8OOgq7q4abg4ive-O-8Xns28VQ4D5L1Hc0CY_IJHFXuHUfQp0O0lAHeMo5uG-dqsvPK9LPnmwanKRK5Dxtyw2lrjIODbPy8XUja0wBMvnJrdMYgXABoBgB9Kes70QvPqeR2XBYtTrmGC8zDK3Yf8DxMVwDQQ_j9h3a68Hyzfcg'}
//     };
//     axios.request(options)
//     .then(function(response) {
//       console.log(response.data);
//     }).catch(function(error) {
//       console.error(error);
//     });

//   return (<h1> hello </h1>);
// };
 
// export default authEnd;


var axios = require("axios").default;

var options = {
  method: 'POST',
  url: 'https://dev-5g0j9i2z.us.auth0.com/oauth/token',
  headers: {'content-type': 'application/x-www-form-urlencoded'},
  data: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: 'https://housing-passport-backend.com'
  })
};

export default function getAccessToken () {
    axios.request(options).then(function (response) {
    console.log(response.data);
    console.log("hello")
    }).catch(function (error) {
    console.error(error);
    });
    return null;
}