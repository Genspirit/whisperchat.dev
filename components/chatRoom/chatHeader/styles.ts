import { makeStyles } from "@material-ui/styles";

export default makeStyles({
  chatHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    "& input": {
      fontWeight: "bold",
      fontSize: "1.25em",
      border: "none",
      "&:focus": {
        outline: "none",
      },
    },
  },
});
