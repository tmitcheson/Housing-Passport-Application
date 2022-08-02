import { getSession, useSession } from "next-auth/react";
import axios from "axios";
import BasicTabs from '../components/EpcTabs';
import SelectProperty from '../components/SelectProperty'
import { useState } from 'react';
import { Button } from "@mui/material";

const myProperties = () => {

    const {data: session, status } = useSession();
    if(session.user.role === 'homeowner'){
        const data = session.user.email;
        // axios.post('http://localhost:5000/api/get_my_property', {data})
        axios.post('https://housing-passport-back-end.herokuapp.com/api/get_my_property', {data})
            .then(function(response){
                const receivedData = response.data
                setEpcData(receivedData);
            }
        )
    }
    const [epcData, setEpcData] = useState([]);

    const onClick = () => {
        axios.post('http://localhost:5000/api/get_list_of_tradespeople', {data})
        // axios.post('https://housing-passport-back-end.herokuapp.com/api/get_my_property', {data})
    }

    return ( 
    <>
        {/* <SelectProperty props= {epcData} /> */}
        {!session &&
            <div> Sign in to view your properties </div>}
        {session && 
            <>
            <BasicTabs props={epcData}/>
            <div> Time to act on the recommendations? </div>
            <Button type='submit' size='small' variant='text' onClick={(e) => onClick(e)}>
                Find a tradesperson
            </Button>
            </>
        }
    </>);
}

export default myProperties

export async function getServerSideProps(context) {
    const session = await getSession(context)
    return {
      props: { session }
    }
  }