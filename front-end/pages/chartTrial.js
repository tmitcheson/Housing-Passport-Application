// import { Chart, BarController, BarElement } from "chart.js";
// const myChart = new Chart(ctx, { BarController, BarElement })
// Chart.register(Bar);

import * as dfd from 'danfojs'

import Chart from "chart.js/auto"

import { Bar, Line } from "react-chartjs-2"
import { Button } from '@mui/material';

// Chart.register(...registerables);

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const chartTrial = () => {

    const [ isSubmitted, setSubmitted] = useState(false)
    const [ graphLabels, setGraphLabels ] = useState([])
    const [ graphValues, setGraphValues ] = useState([])
    const [ priceValues, setPriceValues ] = useState([])
    const [ bigDf, setBigDf] = useState({})
    const [ mpn, setMpn ] = useState('')
    const [ serialNumber, setSerialNumber ] = useState('')
    const [ authKey, setAuthKey ] = useState('')
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    // slightly hacky way around but got no other ideas
    const removeDate = (dateString) => {
        if(dateString.length > 6){
            dateString = dateString.slice(11, 16)
        } 
        return dateString;
    }
    
    const onSubmit = accountData => {
        console.log("try here: " + JSON.stringify(accountData))
        
        // const mpn = accountData['mpn']
        // const serial_number = accountData["serial_number"]
        // const auth_key = accountData["auth_key"]

        const mpn = "1200038779673"
        const serial_number = "Z18N333768"
        const auth_key = "sk_live_F6fSk8HDazIy7wKmWnWA3tD9"

        
        let monthAgo = new Date();
        // monthAgo.setHours(0,0,0,0);
        monthAgo.setTime(monthAgo.getTime() - (1000 * 60 * 60 * 24 * 30))
        console.log(monthAgo.toISOString())
        let now = new Date()

        const period_from = monthAgo.toISOString()
        const period_to = now.toISOString()

        let price_period_to = new Date(period_to)
        // price_period_to.setTime(price_period_to.getTime() + (30*60*1000))
        price_period_to = price_period_to.toISOString();

        const params = {"page_size": 25000, "period_from": period_from, "period_to": period_to}

        axios.get("https://api.octopus.energy/v1/electricity-meter-points/" + mpn + "/meters/" + serial_number + "/consumption/",
        { auth: { username: auth_key},
            params:params
        }
        ).then(function (response){
            const df = new dfd.DataFrame(response.data.results)
            
            df.sortValues("interval_start", {ascending:true, inplace:true})

            if(accountData["timeframe"] === "Day"){
                setGraphLabels(df["interval_start"].values)
                setGraphValues(df["consumption"].values)
            } else if (accountData["timeframe"] === "month"){
                let new_df = df.applyMap(removeDate)
                let group_df = new_df.groupby(["interval_start"])  
                let hourly_dict = group_df["colDict"]
                let averagesTimes = []
    
                for(const [key, value] of Object.entries(hourly_dict)){
                    const sum = value["consumption"].reduce((a, b) => a + b, 0);
                    const avg = (sum/value["consumption"].length) || 0;
                    averagesTimes.push([key, avg])
                }
    
                const hourly_df = new dfd.DataFrame(averagesTimes, {columns:["time", "avg_consumption"]})
                hourly_df.sortValues("time", {ascending:true, inplace:true})
                // console.log(hourly_df)
                setGraphLabels(hourly_df["time"].values)
                setGraphValues(hourly_df["avg_consumption"].values)
            }            
            setSubmitted(true)
        });

        axios.get("https://api.octopus.energy/v1/products/AGILE-18-02-21/electricity-tariffs/E-1R-AGILE-18-02-21-C/standard-unit-rates/?page_size=25000&period_from=" + period_from + "&period_to=" + price_period_to)
        .then(function(response){
            console.log("prices: " + response.data.results[0])
            const df = new dfd.DataFrame(response.data.results)
            df.sortValues("valid_from", {ascending:true, inplace:true})

            let new_df = df.applyMap(removeDate)
            let group_df = new_df.groupby(["valid_from"])  
            let hourly_dict = group_df["colDict"]
            let averagesPrices = []

            for(const [key, value] of Object.entries(hourly_dict)){
                const sum = value["value_inc_vat"].reduce((a, b) => a + b, 0);
                const avg = (sum/value["value_inc_vat"].length) || 0;
                averagesPrices.push([key, avg])
            }

            const hourly_price_df = new dfd.DataFrame(averagesPrices, {columns:["time", "price"]})
            hourly_price_df.sortValues("time", {ascending:true, inplace:true})

            // console.log("seconda: ")
            console.log(hourly_price_df)
            setPriceValues(hourly_price_df["price"].values)
            console.log("prices: " + response.data)
        }
        )
        }


    const data = {
        labels : graphLabels,
        datasets : [
            {
                type: "bar",
                label : "Consumption",
                borderRadius: 30,
                yAxisID: "y",
                data : graphValues,
                // data : [0.1, 0.2, 0.4, 0.3, 0.6],
                backgroundColour : "rgba(32, 214, 155, 1)",
                barThickness: 5,
                pointStyle: "cross"
            },
            {
                type: "line",
                label: "Prices",
                borderRadius : 20,
                yAxisID: "y1",
                // data : [0.7, 0.7, 0.75, 0.3, 0.2],
                data: priceValues,
                backgroundColour: "rgba(1, 98, 255, 1)",
                lineThickness: 5
            }
        ],
    }

    const options = {
        plugins: {
            legend: {
                display: true
            },
        },
        elements : {
            line: {
                tension: 0,
                borderwidth: 2,
                borderColor: "rgba(47,97,68,1)",
                backgroundColor: "rgba(47,97,68,0.3)"
            },
            bar: {
                backgroundColor: "#36a2eb",
            },
            point: {
                radius: 0,
                hitRadius: 0
            },
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
            }
        }
    }

    // const mixedChart = new Chart(ctx, )
    
    return ( 
        <> 
        <form 
        onSubmit={handleSubmit(onSubmit)}>      
                <label htmlFor='mpn'>
                            mpn: 
                </label>
                <input
                    id='mpn'
                    aria-invalid={errors.mpn ? 'true' : 'false'}
                    {...register('mpn')}
                    // {...register('mpn', { required: true })}
                    />
                {/* <input type="submit" /> */}

                <label htmlFor='serial_number'>
                            serial_number: 
                </label>
                <input
                    id='serial_number'
                    aria-invalid={errors.serial_number ? 'true' : 'false'}
                    {...register('serial_number')}
                    />
                <label htmlFor='auth_key'>
                            auth_key: 
                </label>
                <input
                    id='auth_key'
                    aria-invalid={errors.auth_key ? 'true' : 'false'}
                    {...register('auth_key')}
                    />
                <select {...register('timeframe', { required: true })}> 
                    <option defaultValue="day"> Day </option>
                    <option value="week"> Week </option>
                    <option value="month"> Month </option>
                    <option value="year"> Year </option>
                </select>
                {/* <input type="submit" /> */}
                <Button type ='submit' variant='contained'>Submit</Button>
                </form>
                {/* {isSubmitted && */}
                <Bar data={data} width={100} height={40} options={options}/>
                {/* } */}
                </>
                )   
            }
            
            export default chartTrial;