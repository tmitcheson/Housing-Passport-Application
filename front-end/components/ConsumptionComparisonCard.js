import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ThemeProvider, createTheme } from "@mui/system";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function AccuracyTesterCard({
  result,
  builtForm,
  age,
  floorArea,
  imd,
  region,
}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card fontFamily="Nunito" sx={{maxWidth: 460 }}>
      <CardMedia
        component="img"
        height="180"
        image="/compare.png"
        alt="compare"
      />
      <CardHeader title="Consumption Comparison Tester" />
      <CardContent >
        <Typography fontFamily="Nunito" variant="body1">
          Based on the characterics of your property, properties with a similar
          disposition are averaging consumption levels around:{" "}
          <span className="special-word">{result}</span> . <br></br>
          <br></br>
          Based on a <span className="special-word">{builtForm}</span> property
          built <span className="special-word">{age}</span> in the{" "}
          <span className="special-word">{region}</span> region of the country,
          with a floor area of{" "}
          <span className="special-word">
            {floorArea}m{<sup>2</sup>}
          </span>{" "}
          residing in an area with an index of multiple deprivation score of{" "}
          <span className="special-word">{imd}</span>.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          {" "}
          <Typography fontFamily="Nunito" variant="body1">How do we calculate this?</Typography>
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography fontFamily="Nunito" variant="body2">
            We take a subset of the characterics of your proprerty, derived from
            various details on your EPC certificate as well as your real
            consumption data, then we run that through a Radius Neighbours
            Regression model, to return the result of what similar properties to
            yours consume.
          </Typography>
          <br></br>
          <Typography fontFamily="Nunito" variant="body2">
            We do this by using data from the National Energy Efficiency
            Framework (NEED) which offers anonymised real consumption data from
            UK properties. With this tool you can see how you compare to similar
            properties.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
