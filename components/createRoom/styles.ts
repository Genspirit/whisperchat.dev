import { makeStyles } from "@material-ui/styles";

export default makeStyles({
  root: {
    "& input": {
      fontSize: "1.5em",
      border: "none",
      borderBottom: "1px solid lightgray",
      transition: "border-bottom .3s ease-in-out",
    },
    "& input:focus": {
      outline: "none",
      borderBottom: "1px solid blue",
    },

    "& button": {
      backgroundColor: "transparent",
      border: "1px solid gray",
      borderRadius: "5px",
      padding: "5px",
    },
  },
});
