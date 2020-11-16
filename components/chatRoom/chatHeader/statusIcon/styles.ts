import { makeStyles } from "@material-ui/styles";

const commonStyles: any = {
  padding: "7px",
  fontWeight: "bold",
  textTransform: "uppercase",
  borderRadius: "5px",
};

export default makeStyles({
  waiting: {
    ...commonStyles,
    backgroundColor: "lightgray",
  },
  connecting: {
    ...commonStyles,
    backgroundColor: "lightyellow",
  },
  connected: {
    ...commonStyles,
    backgroundColor: "lightgreen",
  },
  failed: {
    ...commonStyles,
    backgroundColor: "red",
  },
  full: {
    ...commonStyles,
    backgroundColor: "lavender"
  }
});
