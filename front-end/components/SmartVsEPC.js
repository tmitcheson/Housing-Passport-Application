import axios from "axios";
import { useEffect } from "react";

const SmartVsEpc = ({mprn, serialElec, mpan, serialGas, authKey}) => {



    useEffect(() => {
        axios.get
    })

    return ( 
        <>
            <h4> If you use Octopus Energy for both electrity and gas, then
            we can offer you a comparison of how your EPC estimations for energy
            consumption compare to the reality. Enter your additional information
            below to find out... 
            </h4>

        </>
    );
}
 
export default SmartVsEpc;