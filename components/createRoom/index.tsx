import { useEffect, useState } from "react";

import randomWords from "random-words";

export default function CreateRoom() {
  const [room, setRoom] = useState("");

  useEffect(() => {
    setRoom(randomWords({ exactly: 2, join: "-" }));
  }, []);

  return (
    <div>
      <input value={room} onChange={(e) => setRoom(e.target.value)} />
      <a href={`/room/${room}`}>
        <button>CREATE</button>
      </a>
    </div>
  );
}
