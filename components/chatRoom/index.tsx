import { Console } from "console";
import { useRef, useEffect, useState, Component } from "react";

import ChatConnection from "./chatConnection";
import ChatMessage from "./chatMessage";

import withStyles from "./styles";

//({ roomId })

type Message = {
  type: string;
  content: string;
  name: string;
};

class ChatRoom extends Component<
  { roomId: string; classes: Record<string, string> },
  { messages: Message[]; outgoingMsg: string; name: string }
> {
  state = {
    messages: [],
    outgoingMsg: "",
    name: "Unknown",
  };

  chatConnection;

  componentDidMount = () => this.props.roomId && this.#createChatConnection();

  componentDidUpdate = (prevProps) =>
    this.props.roomId !== prevProps.roomId && this.#createChatConnection();

  #createChatConnection = () => {
    this.chatConnection = new ChatConnection({
      handleNewMsg: this.handleIncomingMsg,
      roomId: this.props.roomId,
    });
  };

  handleIncomingMsg = (msg) => {
    console.log(msg);
    const messages = [...this.state.messages, { type: "incoming", ...msg }];

    this.setState({ ...this.state, ...{ messages } });
  };

  updateOutgoingMsg = (event) => {
    const outgoingMsg = event.target.value;

    this.setState({ ...this.state, ...{ outgoingMsg } });
  };

  sendMessage = () => {
    if (this.state.outgoingMsg) {
      this.chatConnection.sendMsg({
        name: this.state.name,
        content: this.state.outgoingMsg,
      });

      const messages = [
        ...this.state.messages,
        { type: "outgoing", content: this.state.outgoingMsg, name: "" },
      ];

      this.setState({ ...this.state, ...{ messages } });
    }
  };

  render = () => (
    <div className={this.props.classes.root}>
      <h1>Room: {this.props.roomId}</h1>
      <div id="msg-box" className={this.props.classes.chatBox}>
        {this.state.messages.map(({ type, content, name }, index) => (
          <ChatMessage key={index} content={content} type={type} name={name} />
        ))}
      </div>
      <input value={this.state.outgoingMsg} onChange={this.updateOutgoingMsg} />
      <button onClick={this.sendMessage}>SEND</button>
    </div>
  );
}

export default withStyles(ChatRoom);
