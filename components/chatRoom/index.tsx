import { Component } from "react";

import ChatConnection from "./chatConnection";

import ChatHeader from "./chatHeader";
import ChatMessage from "./chatMessage";
import ChatInput from "./chatInput";

import withStyles from "./styles";

//({ roomId })

type Message = {
  type: string;
  content: string;
  name: string;
};

type ChatRoomState = {
  messages: Message[];
  status: string;
  name: string;
};

class ChatRoom extends Component<
  { roomId: string; classes: Record<string, string> },
  ChatRoomState
> {
  state: ChatRoomState = {
    messages: [],
    status: "waiting",
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
      updateStatus: this.updateStatus,
    });
  };

  updateStatus = (status: string) => {
    if (status === "failed" && this.state.status !== "connecting") return;
    this.setState({ ...this.state, status });
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

  sendMessage = (msg) => {
    this.chatConnection.sendMsg({
      name: this.state.name,
      content: msg,
    });

    const messages = [
      ...this.state.messages,
      { type: "outgoing", content: msg, name: "Me" },
    ];

    this.setState({ ...this.state, ...{ messages } });
  };

  render = () => (
    <div className={this.props.classes.root}>
      <ChatHeader
        roomId={this.props.roomId}
        setName={(name) => this.setState({ ...this.state, name })}
        name={this.state.name}
        status={this.state.status}
      />
      <div id="msg-box" className={this.props.classes.chatBox}>
        {this.state.messages.map(({ type, content, name }, index) => (
          <ChatMessage key={index} content={content} type={type} name={name} />
        ))}
      </div>
      <ChatInput sendMessage={this.sendMessage} status={this.state.status} />
    </div>
  );
}

export default withStyles(ChatRoom);
