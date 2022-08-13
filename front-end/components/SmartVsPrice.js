import * as dfd from "danfojs";
import Chart from "chart.js/auto";

import { Bar, Line } from "react-chartjs-2";
import { Button } from "@mui/material";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const SmartVsPrice = ({ mpn, serialNumber, authKey, timePeriod, date, chosenMonth, updateGraph }) => {
  const [isSubmitted, setSubmitted] = useState(false);
  const [graphLabels, setGraphLabels] = useState([]);
  const [graphValues, setGraphValues] = useState([]);
  const [priceValues, setPriceValues] = useState([]);
  const [bigDf, setBigDf] = useState({});
  // const [ mpn, setMpn ] = useState('')
  // const [ serialNumber, setserialNumber ] = useState('')
  // const [ authKey, setAuthKey ] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const removeDate = (dateString) => {
    if (dateString.length > 6) {
      dateString = dateString.slice(11, 16);
    }
    return dateString;
  };

  useEffect(() => {
    let startDate = new Date()
    let endDate = new Date()

    if (timePeriod === "day") {

      const day = parseInt(date.slice(0, 2));
      const month = parseInt(date.slice(3, 5));
      const year = parseInt(date.slice(6, 10));
      console.log(day);
      console.log(month);
      console.log(year);

      startDate = new Date(year, month, day);
      endDate = new Date(year, month, day + 1);
      console.log(startDate.toISOString());
      console.log(endDate.toISOString());

    } else if (timePeriod === "month") {

      const month = parseInt(chosenMonth.slice(0, 2));
      const year = parseInt(chosenMonth.slice(3, 7));
      console.log(month)
      console.log(year)
      
      const month2 = (month + 1) % 12;
      Math.abs(month2 - month) !== 1 ? (year += 1) : console.log(month);
      console.log(year);

      startDate = new Date(year, month);
      endDate = new Date(year, month2);
      console.log(startDate.toISOString());
      console.log(endDate.toISOString());
    } else {
        console.log("Huh")
    }

    const mprn = "1200038779673";
    const serial_number = "Z18N333768";
    const auth_key = "sk_live_F6fSk8HDazIy7wKmWnWA3tD9";

    // to find a month's data, we're gonna have to start period from from
    // first day of month and period to from first day of next month minus 1

    const period_from = startDate.toISOString();
    const period_to = endDate.toISOString();

    let price_period_to = new Date(period_to);
    // price_period_to.setTime(price_period_to.getTime() + (30*60*1000))
    price_period_to = price_period_to.toISOString();


    const params = {
      page_size: 25000,
      period_from: period_from,
      period_to: period_to,
    };

    axios
      .get(
        "https://api.octopus.energy/v1/electricity-meter-points/" +
          mprn +
          "/meters/" +
          serial_number +
          "/consumption/",
        { auth: { username: auth_key }, params: params }
      )
      .then(function (response) {
        const df = new dfd.DataFrame(response.data.results);

        df.sortValues("interval_start", { ascending: true, inplace: true });

        // setGraphLabels(df["interval_start"].values);
        // setGraphValues(df["consumption"].values);
        let new_df = df.applyMap(removeDate);
        let group_df = new_df.groupby(["interval_start"]);
        let hourly_dict = group_df["colDict"];
        let averagesTimes = [];

        for (const [key, value] of Object.entries(hourly_dict)) {
          const sum = value["consumption"].reduce((a, b) => a + b, 0);
          const avg = sum / value["consumption"].length || 0;
          averagesTimes.push([key, avg]);
        }

        const hourly_df = new dfd.DataFrame(averagesTimes, {
          columns: ["time", "avg_consumption"],
        });
        hourly_df.sortValues("time", { ascending: true, inplace: true });
        console.log(hourly_df);
        setGraphLabels(hourly_df["time"].values);
        setGraphValues(hourly_df["avg_consumption"].values);

        setSubmitted(true);
      });

    axios
      .get(
        "https://api.octopus.energy/v1/products/AGILE-18-02-21/electricity-tariffs/E-1R-AGILE-18-02-21-C/standard-unit-rates/?page_size=25000&period_from=" +
          period_from +
          "&period_to=" +
          price_period_to
      )
      .then(function (response) {
        console.log("prices: " + response.data.results[0]);
        const df = new dfd.DataFrame(response.data.results);
        df.sortValues("valid_from", { ascending: true, inplace: true });

        let new_df = df.applyMap(removeDate);
        let group_df = new_df.groupby(["valid_from"]);
        let hourly_dict = group_df["colDict"];
        let averagesPrices = [];

        for (const [key, value] of Object.entries(hourly_dict)) {
          const sum = value["value_inc_vat"].reduce((a, b) => a + b, 0);
          const avg = sum / value["value_inc_vat"].length || 0;
          averagesPrices.push([key, avg]);
        }

        const hourly_price_df = new dfd.DataFrame(averagesPrices, {
          columns: ["time", "price"],
        });
        hourly_price_df.sortValues("time", { ascending: true, inplace: true });

        // console.log("seconda: ")
        console.log(hourly_price_df);
        setPriceValues(hourly_price_df["price"].values);
        console.log("prices: " + response.data);
      });
  }, [updateGraph]);

  const data = {
    labels: graphLabels,
    datasets: [
      {
        type: "bar",
        label: "Consumption",
        borderRadius: 30,
        yAxisID: "y",
        data: graphValues,
        // data : [0.1, 0.2, 0.4, 0.3, 0.6],
        backgroundColour: "rgba(32, 214, 155, 1)",
        barThickness: 5,
        pointStyle: "cross",
      },
      {
        type: "line",
        label: "Prices",
        borderRadius: 20,
        yAxisID: "y1",
        // data : [0.7, 0.7, 0.75, 0.3, 0.2],
        data: priceValues,
        backgroundColour: "rgba(1, 98, 255, 1)",
        lineThickness: 5,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
      },
    },
    elements: {
      line: {
        tension: 0,
        borderwidth: 2,
        borderColor: "rgba(47,97,68,1)",
        backgroundColor: "rgba(47,97,68,0.3)",
      },
      bar: {
        backgroundColor: "#36a2eb",
      },
      point: {
        radius: 0,
        hitRadius: 0,
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
      },
    },
  };

  // const mixedChart = new Chart(ctx, )

  return (
    <>
      <h4>
        {" "}
        Here is a graph of your consumption profile. It takes your consumption
        records for a specific time (currently 20th Feb before the price hikes)
        and compares it against the Octopus Agile (variable) tariff for the day.
        In doing so you can compare your consumption habits to the general
        market demand and potentially decide if a variable tariff is right for
        you
      </h4>
      <Bar data={data} width={100} height={40} options={options} />
    </>
  );
};

export default SmartVsPrice;
