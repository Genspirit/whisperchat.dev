import useStyles from "./styles";

export default function StatusIcon({ status }) {
  const classes = useStyles();
  return <div className={classes[status]}>{status}</div>;
}
