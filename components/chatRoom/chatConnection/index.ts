import { Manager } from "socket.io-client";
import type { Socket } from "socket.io-client/build/socket";
import { iceCandidate } from "~/servers/signaling/events";

export default class ChatConnection {
  #handleNewMsg: (msg: string) => void;
  #socket: Socket;
  #peer: string;
  #peerConnection: RTCPeerConnection;
  #chatChannel: RTCDataChannel;
  #pendingICECandidates: RTCIceCandidate[] = [];

  constructor({ handleNewMsg, roomId }) {
    this.#handleNewMsg = handleNewMsg;

    this.#socket = new Manager("ws://localhost:8080").socket("/");
    const socket = this.#socket;

    socket.emit("join room", roomId);

    socket.on("other user", this.#handleOtherUser);

    socket.on("user joined", (otherUser) => {
      console.log(`User joined ${otherUser}`);

      this.#peer = otherUser;
    });

    socket.on("offer", this.#handleOfferMsg);
    socket.on("response", this.#handleResponseMsg);
    socket.on("ice-candidate", this.#handleIceCandidateMsg);
  }

  sendMsg = (msg) => {
    console.log("sending message");
  };

  #handleOtherUser = async (otherUser) => {
    console.log(`Connecting to ${otherUser}`);
    this.#peer = otherUser;
    await this.#startConnection();
    this.#chatChannel = this.#peerConnection.createDataChannel("chat");
    console.log("data channel", this.#chatChannel);
  };

  #startConnection = async () => {
    const accessToken = await fetch("/api/getAccessToken");

    this.#peerConnection = new RTCPeerConnection({
      iceServers: accessToken["ice_ servers"],
    });

    this.#peerConnection.onicecandidate = this.#handleNewIceCandidateEvent;
    this.#peerConnection.ondatachannel = this.#handleNewDataChannelEvent;
    this.#peerConnection.onnegotiationneeded = this.#handleNegotionNeededEvent;

    for (const iceCandidate of this.#pendingICECandidates)
      this.#peerConnection.addIceCandidate(iceCandidate).catch((err) => {
        console.log("err", err.message);
        console.log(iceCandidate);
      });
  };

  #handleNewIceCandidateEvent = ({ candidate }) => {
    console.log("sending ICE Candidiate");
    if (candidate) {
      const target = this.#peer;

      this.#socket.emit("ice-candidate", {
        target,
        candidate,
      });
    }
  };

  #handleNegotionNeededEvent = async () => {
    console.log("starting negotiation");
    const peerConnection = this.#peerConnection;

    const sdp = await peerConnection.createOffer();
    peerConnection.setLocalDescription(sdp);

    const target = this.#peer;

    this.#socket.emit("offer", { target, sdp });
  };

  #handleNewDataChannelEvent = (event) => {
    console.log("data channel", event);
  };

  #handleOfferMsg = async (offer) => {
    console.log("received offer");
    await this.#startConnection();

    const incomingSDP = new RTCSessionDescription(offer.sdp);

    await this.#peerConnection.setRemoteDescription(incomingSDP);

    const sdp = await this.#peerConnection.createAnswer();

    await this.#peerConnection.setLocalDescription(sdp);

    const target = this.#peer;
    this.#socket.emit("response", { target, sdp });
  };

  #handleResponseMsg = (response) => {
    console.log("received response");
    const sdp = new RTCSessionDescription(response.sdp);
    this.#peerConnection.setRemoteDescription(sdp);
  };

  #handleIceCandidateMsg = ({ candidate }) => {
    console.log("received ice candidate msg");

    let newIceCandidate;

    try {
      newIceCandidate = new RTCIceCandidate(candidate);
    } catch (error) {
      console.log(error.message);
      console.log(candidate);
    }

    if (this.#peerConnection)
      this.#peerConnection.addIceCandidate(newIceCandidate).catch((err) => {
        console.log("err", err.message);
        console.log(candidate);
      });
    else this.#pendingICECandidates.push(newIceCandidate);
  };
}
