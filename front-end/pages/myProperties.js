import { getSession, useSession } from "next-auth/react";
import axios from "axios";
import BasicTabs from '../components/EpcTabs';
import { useState } from 'react';

const myProperties = () => {

    const {data: session, status } = useSession()
    const data = session.user.email
    const [epcData, setEpcData] = useState([]);

    // axios.post('http://localhost:5000/api/get_my_property', {data})
    axios.post('https://housing-passport-back-end.herokuapp.com/api/get_my_property', {data})
        .then(function(response){
            const receivedData = response.data
            setEpcData(receivedData);
        }
    )

    return ( <>{epcData && 
            <BasicTabs props={epcData}/>}
    </>);
}
 
export default myProperties

export async function getServerSideProps(context) {
    const session = await getSession(context)
    return {
      props: { session }
    }
  }