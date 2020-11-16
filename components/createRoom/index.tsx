import { useEffect, useState } from "react";
import Link from "next/link";
import useStyles from "./styles";

import randomWords from "random-words";

export default function CreateRoom({ type }) {
  const [room, setRoom] = useState("");

  const classes = useStyles();

  useEffect(() => {
    setRoom(randomWords({ exactly: 2, join: "-" }));
  }, []);

  return (
    <div className={classes.root}>
      <h3>Create a {type} room</h3>
      <input value={room} onChange={(e) => setRoom(e.target.value)} />
      <Link href={`/room/${type}/${room}`}>
        <a>
          <button>CREATE</button>
        </a>
      </Link>
    </div>
  );
}
