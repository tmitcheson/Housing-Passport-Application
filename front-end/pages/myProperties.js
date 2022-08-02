import { getSession, useSession } from "next-auth/react";
import axios from "axios";
import BasicTabs from '../components/EpcTabs';
import SelectProperty from '../components/SelectProperty'
import { useState } from 'react';
import { Button } from "@mui/material";
import styles from '../styles/List.module.css'

const myProperties = () => {

    const [ listOfTradespeople, setListOfTradespeople ] = useState([]);
    const [ isSubmitted, setSubmitted ] = useState(false);
    const [epcData, setEpcData] = useState([]);
    const [ isFailed, setFailed ] = useState(false);
    const [ isAdded, setAdded ] = useState(false);

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

    const onClick = () => {
        axios.post('http://localhost:5000/api/get_list_of_tradespeople')
        // axios.post('https://housing-passport-back-end.herokuapp.com/api/get_my_property')
        .then(function(response){
            const receivedTradespeople = response.data;
            console.log(receivedTradespeople);
            const newTrades = [];
            for (const i in receivedTradespeople){
                newTrades.push([i, receivedTradespeople[i]]);
            }
            setListOfTradespeople(newTrades);
            setSubmitted(true);
        })
    }

    const onTradeClick = (e, lmk_key, email) => {
        console.log(lmk_key)
        console.log(email)
        let data = '{"lmk_key":"' + lmk_key + '", "email":"' + email + '"}';
        console.log(data);
        data = JSON.parse(data);
        axios.post('http://localhost:5000/api/add_property_to_user', {data})
        // axios.post('https://housing-passport-back-end.herokuapp.com/api/add_property_to_user', {data}))
        .then(function(response) {
            console.log(response)
            if(response.data === 'False'){
                setFailed(true);
                setSubmitted(false);
            }
            if(response.data === 'True'){
                setAdded(true);
                setSubmitted(false);
            }
        }
        );
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
            {isSubmitted &&
                <h1> Extend permissions for {epcData['ADDRESS']} to ... </h1>}
            {isSubmitted &&
                listOfTradespeople.map(item => {
                    return( 
                        <div className={styles.single} key={item}>
                            {item[1]}
                            <Button type='submit' size='small' variant="text" onClick={(e) => onTradeClick(e, epcData['LMK_KEY'], item[1])}> Extend permissions </Button>
                        </div>)
                })}
            {isAdded &&
                <div> Permissions extended </div>}
            {isFailed &&
                <div> Something went wrong </div>}

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