import { useRef, useEffect } from "react";
import ChatConnection from "./chatConnection";

export default function ChatRoom({ roomId }) {
  const chatConnectionRef = useRef<ChatConnection>();

  useEffect(() => {
    chatConnectionRef.current = new ChatConnection({
      handleNewMsg,
      roomId,
    });
  }, []);

  function handleNewMsg(msg) {
    console.log(msg);
  }

  function sendMsg(msg) {
    chatConnectionRef.current.sendMsg(msg);
  }

  return (
    <div>
      <h1>Room: {roomId}</h1>
    </div>
  );
}
