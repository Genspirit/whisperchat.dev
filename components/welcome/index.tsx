import Link from "next/link";
import useStyles from "./styles";

export default function Welcome({ children }) {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      <h1>
        Welcome to{" "}
        <Link href="/">
          <a>WhisperChat.dev!</a>
        </Link>
      </h1>
      {children}
    </main>
  );
}
