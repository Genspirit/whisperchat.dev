import { makeStyles } from "@material-ui/styles";

export default makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

    width: "100%",
    height: "100%",

    "& a": {
      color: generateRandomDarkColor(),
    },

    "& > * + div": {
      marginTop: "50px",
    },
  },
});

function generateRandomDarkColor() {
  const h = `${Math.floor(Math.random() * 360)}`;
  const s = `${Math.floor(50 + Math.random() * 50)}%`;
  const l = `${Math.floor(30 + Math.random() * 20)}%`;
  return `hsl(${h} ${s} ${l})`;
}
