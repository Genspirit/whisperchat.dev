import { useState } from "react";

import useStyles from "./styles";

export default function ChatInput({ sendMessage, status }) {
  const [msg, setMsg] = useState("");
  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (msg && status === 'connected') {
      sendMessage(msg);
      setMsg('');
    }
  };

  return (
    <form className={classes.chatInput} onSubmit={handleSubmit}>
      <input value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button type="submit">SEND</button>
    </form>
  );
}
