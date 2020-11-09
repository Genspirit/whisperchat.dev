import { withStyles } from "@material-ui/styles";

export default withStyles({
  root: {
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  chatBox: {
    height: "100vh",
    overflowY: "scroll",
    padding: "20px",
  },
});
