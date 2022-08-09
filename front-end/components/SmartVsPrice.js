import * as dfd from 'danfojs'
import Chart from "chart.js/auto"

import { Bar, Line } from "react-chartjs-2"
import { Button } from '@mui/material';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const SmartVsPrice = () => {

    const [ isSubmitted, setSubmitted] = useState(false)
    const [ graphLabels, setGraphLabels ] = useState([])
    const [ graphValues, setGraphValues ] = useState([])
    const [ priceValues, setPriceValues ] = useState([])
    const [ bigDf, setBigDf] = useState({})
    const [ mpn, setMpn ] = useState('')
    const [ serialNumber, setSerialNumber ] = useState('')
    const [ authKey, setAuthKey ] = useState('')
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    
    const onSubmit = accountData => {
        console.log("try here: " + JSON.stringify(accountData))
        
        // const mpn = accountData['mpn']
        // const serial_number = accountData["serial_number"]
        // const auth_key = accountData["auth_key"]

        const mpn = "1200038779673"
        const serial_number = "Z18N333768"
        const auth_key = "sk_live_F6fSk8HDazIy7wKmWnWA3tD9"

        const period_from = "2022-02-20T00:00:00Z"
        const period_to = "2022-02-21T00:00:00Z"

        let to = new Date(period_to)
        to.setTime(to.getTime() + (30*60*1000))
        const price_period_to = to.toISOString();

        const params = {"page_size": 25000, "period_from": period_from, "period_to": period_to}

        axios.get("https://api.octopus.energy/v1/electricity-meter-points/" + mpn + "/meters/" + serial_number + "/consumption/",
        { auth: { username: auth_key},
            params:params
        }
        ).then(function (response){
            console.log(response.data.results);
            const df = new dfd.DataFrame(response.data.results)
            df.sortValues("interval_start", {ascending:true, inplace:true})
            console.log(df["interval_start"].values)
            setGraphLabels(df["interval_start"].values)
            setGraphValues(df["consumption"].values)
            setBigDf(df)
            console.log("first:")
            console.log(df)
            setSubmitted(true)
            });

        axios.get("https://api.octopus.energy/v1/products/AGILE-18-02-21/electricity-tariffs/E-1R-AGILE-18-02-21-C/standard-unit-rates/?period_from=" + period_from + "&period_to=" + price_period_to)
        .then(function(response){
            console.log("prices: " + response.data.results[0])
            const df = new dfd.DataFrame(response.data.results)
            df.sortValues("valid_from", {ascending:true, inplace:true})

            console.log("seconda: ")
            console.log(df)
            setPriceValues(df["value_inc_vat"].values)
            // console.log("prices: " + response.data)
        })
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
                            mpn:{'   '}
                </label>
                <input
                    id='mpn'
                    aria-invalid={errors.mpn ? 'true' : 'false'}
                    {...register('mpn')}
                    // {...register('mpn', { required: true })}
                    />
                {/* <input type="submit" /> */}
                <p></p>
                <label htmlFor='serial_number'>
                            serial_number:{'   '}
                </label>
                <input
                    id='serial_number'
                    aria-invalid={errors.serial_number ? 'true' : 'false'}
                    {...register('serial_number')}
                    />
                <p></p>
                <label htmlFor='auth_key'>
                            auth_key:{'   '}
                </label>
                <input
                    id='auth_key'
                    aria-invalid={errors.auth_key ? 'true' : 'false'}
                    {...register('auth_key')}
                    />
                <p></p>
                <select {...register('timeframe', { required: true })}> 
                    <option defaultValue="day"> Day </option>
                    <option value="week"> Week </option>
                    <option value="month"> Month </option>
                    <option value="year"> Year </option>
                </select>
                {'   '}
                {/* <input type="submit" /> */}
                <Button type ='submit' variant='contained'>Submit</Button>
                </form>
                {isSubmitted &&
                <Bar data={data} width={100} height={40} options={options}/>
                }
                </>
                )   
            }
 
export default SmartVsPrice;