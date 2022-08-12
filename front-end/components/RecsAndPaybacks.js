const RecsAndPayback = ({ recommendations, chosenProperty }) => {

  return (
    <table>
        <thead key="headers">
            <tr>
            <th> Recommendation </th>
            <th> Indicative Cost </th>
            <th> Time to profit LAST YEAR </th>
            <th> Time to profit NOW </th>
            <th> Time to profit NEXT YEAR </th>
            </tr>
        </thead>
      <tbody>
        {recommendations.map((item) => {
          return (
            <tr key={item}>
              <td> {item[0]}</td>
              <td> {item[1]}</td>
              <td> {item[2]}</td>
              <td> {item[3]}</td>
              <td> {item[4]}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default RecsAndPayback;
