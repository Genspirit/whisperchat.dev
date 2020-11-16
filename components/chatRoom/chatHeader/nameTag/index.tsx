import { useState } from "react";

export default function NameTag({ setName, name }) {
  const [nameTag, setNameTag] = useState(name);

  return (
    <span>
      Chatting as{" "}
      <input
        onChange={(e) => setNameTag(e.target.value)}
        onBlur={() => setName(nameTag)}
        value={nameTag}
      />
    </span>
  );
}
