import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
  realECC,
  energyConsCurrent,
  higher,
}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 460 }}>
      <CardMedia
        component="img"
        height="180"
        image="/epc_compare.png"
        alt="compare"
      />
      <CardHeader title="EPC Accuracy Tester" />
      <CardContent>
        <Typography fontFamily="Nunito" variant="body1">
          Based on your real energy consumption, your Current Energy
          Consumption, in kWh/m{<sup>2</sup>}/year, should be:{" "}
          <span className="special-word">{realECC}</span>.<br></br>
          <br></br>
          However it is currently described as:{" "}
          <span className="special-word">{energyConsCurrent}</span>
        </Typography>
        <br></br>
        {higher === "estimate" && (
          <Typography fontFamily="Nunito" variant="body2">
            This is in line with the rest of our research. EPC certificates tend
            to overestimate the real levels of consumption in households.
          </Typography>
        )}
        {higher === "empiric" && (
          <Typography fontFamily="Nunito" variant="body2">
            This is anomalous compared to the rest of our research - weird!
          </Typography>
        )}
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
            {" "}
            Octopus Energy smart meters record half-hourly consumption in your
            home, however they're liable to miss a few. Our tool extrapolates
            the consumption that is recorded for your electricty and gas
            consumption, combines them over the course of a 12 month period, and
            then divides that by the square meterage of your property, as
            specified on your EPC certificate{" "}
          </Typography>
          <br></br>
          <Typography fontFamily="Nunito" variant="body2">
            This results in what the Energy Consumption Current metric on your
            certificate estimates. Sometimes they're close - sometimes they're
            not!
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
