import { Button } from "@mui/material";

const RecsAndCosts = ({recommendations}) => {

    const handleAchieved = () => {

    }

  return (
    <table>
        <thead key="headers">
            <tr>
            <th> Recommendation </th>
            <th> Indicative Cost </th>
            </tr>
        </thead>
      <tbody>
        {recommendations.map((item) => {
          return (
            <tr key={item}>
              <td> {item[0]} </td>
              <td> {item[1]} </td>
              <td> <Button variant="contained" onClick={handleAchieved}> I've done this! </Button></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
 
export default RecsAndCosts;