import { getSession, useSession } from "next-auth/react";
import axios from "axios";
import BasicTabs from '../components/EpcTabs';
import SelectProperty from '../components/SelectProperty'
import { useState } from 'react';
import { Button } from "@mui/material";
import styles from '../styles/List.module.css'
import { useEffect } from "react";

const myProperties = () => {
    const [ isFirstSubmit, setFirstSubmit ] = useState(false);
    const [ isSecondSubmit, setSecondSubmit ] = useState(false);
    const [ listOfTradespeople, setListOfTradespeople ] = useState([]);
    const [ isSubmitted, setSubmitted ] = useState(false);
    const [epcData, setEpcData] = useState([]);
    const [ isFailed, setFailed ] = useState(false);
    const [ isAdded, setAdded ] = useState(false);
    const [ myProperties, setMyProperties] = useState([]);
    const [ isTradesperson, setTradesperson ] = useState(false);
    const [ chosenProperty, setChosenProperty ] = useState([]);

    const {data: session, status } = useSession();

    useEffect(() => {
        if(session.user.role === 'homeowner'){
            const payload = session.user.email;
            axios.post('http://localhost:5000/api/retrieve_my_properties', {payload})
            // axios.post('https://housing-passport-back-end.herokuapp.com/api/get_my_property', {data})
                .then(function(response){
                    const receivedData = response.data;
                    // console.log("receieveddaa" + JSON.stringify(receivedData));
                    const newProperties = [];
                    for(const i in receivedData){
                        newProperties.push([i, receivedData[i]]);
                    }
                    console.log(newProperties)
                    setEpcData(newProperties);
                    setFirstSubmit(true);
                }
                )
            }
    })

    const onClick = () => {
        axios.post('http://localhost:5000/api/get_list_of_tradespeople')
        // axios.post('https://housing-passport-back-end.herokuapp.com/api/get_my_property')
        .then(function(response){
            const receivedTradespeople = response.data;
            console.log("tradies: " + receivedTradespeople);
            console.log(chosenProperty)
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
        {!session &&
            <div> Sign in to view your properties </div>}
        {session && 
            <>
                <h2> Welcome to your properties page </h2>
                <h3> Browse your properties' EPC data here: </h3>
                <SelectProperty properties={epcData} chosenProperty='' 
                                onSubmit={(property) => setChosenProperty(property)}
                                onSubmit2={() => setSecondSubmit(true)}/>
                {isSecondSubmit &&
                <>
                <BasicTabs chosenProperty={chosenProperty}/>
                <hr/>
                <div> Time to act on the recommendations? </div>
                <Button type='submit' size='small' variant='text' onClick={(e) => onClick(e)}>
                    Find a tradesperson
                </Button>
                {isSubmitted &&
                    <h1> Extend permissions for {chosenProperty[0]} to ... </h1>}
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
                <hr/>
            
            </>
    }
    <hr/>
    <h3> Act upon the recommendations here: (still working on) </h3>
    <hr/>
    <h3> Examine your smart meter data here: </h3>
    </>
        }</>
)
    };

export default myProperties

export async function getServerSideProps(context) {
    const session = await getSession(context)
    return {
      props: { session }
    }
  }