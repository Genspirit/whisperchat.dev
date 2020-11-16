import { makeStyles } from "@material-ui/styles";

export default makeStyles({
  chatInput: {
    display: "flex",
    flexDirection: "row",

    justifyContent: "center",

    width: "100%",

    "& input": {
      padding: "5px",

      borderRadius: "5px",
      border: "1px solid gray",

      transition: "border .3s ease-in-out",

      width: "30%",

      "&:focus": {
        outline: "none",
        border: "1px solid blue",
      },
    },
  },
});
