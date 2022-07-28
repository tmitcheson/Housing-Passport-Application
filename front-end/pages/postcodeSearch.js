import axios from 'axios';
import React from 'react';
// // import Home from '.';

// // import { NameForm } from '../classes/nameForm'
// // import { LmkKeyForm } from '../classes/lmkKeyForm'

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import Button from '@mui/material/Button';
import styles from '../styles/List.module.css';
// import { MongoClient } from 'mongodb';

export default function PostcodeSearch() {

  const [isSubmitted, setSubmitted] = useState(false);
  const [listOfAddresses, setListOfAddresses] = useState([]);
  const { data: session, status } = useSession();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => {
    setSubmitted(true);
    console.log('request heree' + data);
    console.log('ehrer : ' + JSON.stringify(data));
    // console.log("whatever: " + makeEpcApiCall(data));
    // let list_of_addresses = makeEpcApiCall(data)
    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json' }
    // };

    // axios.post('http://localhost:5000/api/get_list_of_addresses', {data})
    axios.post('https://housing-passport-back-end.herokuapp.com/api/get_list_of_addresses', {data})
      .then(function(response) {
        const receivedData = response.data;
        console.log(receivedData);
        const newData = [];
        // console.log(status)
        for (const i in receivedData) {
          newData.push([i, receivedData[i]]);
        }
        setListOfAddresses(newData);
      });
  };

//   console.log(status);

  const router = useRouter();

  const onClick = data => {
    console.log(data);
    data = '{"lmk_key":"' + data[1] + '", "email": "' + session.user.email + '"}';
    console.log(data)
    data = JSON.parse(data);
    console.log('payload ready to go: ' + data);
    // axios.post('http://localhost:5000/api/add_property_to_user', {data})
    axios.post('https://housing-passport-back-end.herokuapp.com/api/add_property_to_user', {data})
      .then(function(response) {
        console.log(response)
      }
      );
    // router.push('property/' + data[1]);
  };


  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor='postcode'>
                Postcode: 
      </label>
      <input
        id='postcode'
        aria-invalid={errors.postcode ? 'true' : 'false'}
        {...register('postcode', { required: true })}
      />
      {errors.postcode && (
        <span role='alert'>
                    This field is required
        </span>
      )}
      {/* <input type="submit" /> */}
      <Button type ='submit' variant='contained'>Submit</Button>
      {isSubmitted && 
      <div className='listOfAddresses'>
        <div> Possible Addresses 
          {listOfAddresses.map(item => {
            return (
              <div href={'/property/' + item[1]} className={styles.single} key={item}> 
                {item[0]}
                <Button type='submit' size='small' variant='text' onClick={(e) => onClick(item, e)}> 
                  Claim Property
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      }
    </form>
  );
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    return {
      props: { session }
    }
  }


// // const [value, setValue] = useState('');

// remember any return value must be wrapped in a single JSX element
// const PostcodeSearch = (props) => {
//     console.log(props);
//     return (
//         <><h1>
//             <NameForm />
//         </h1>
//         <h2>
//             whaup
//         </h2>
//         <h3>
//             <LmkKeyForm/>
//         </h3></>
//     );
// }

// export default PostcodeSearch;
    
