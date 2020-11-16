import { Manager } from "socket.io-client";
import type { Socket } from "socket.io-client/build/socket";

export default class ChatConnection {
  #handleNewMsg: (msg: string) => void;
  #updateStatus: (status: string) => void;
  #socket: Socket;
  #peer: string;
  #peerConnection: RTCPeerConnection;
  #chatChannel: RTCDataChannel;
  #pendingICECandidates: RTCIceCandidate[] = [];

  constructor({ handleNewMsg, roomId, updateStatus }) {
    this.#handleNewMsg = handleNewMsg;
    this.#updateStatus = updateStatus;

    this.#socket = new Manager(`ws://${location.hostname}:9050`).socket("/");
    const socket = this.#socket;

    console.log(`Joining room ${roomId}`);
    socket.emit("join room", roomId);
    socket.on('room full', () => this.#updateStatus('full'));

    socket.on("other user", this.#handleOtherUser);

    socket.on("user joined", (otherUser) => {
      console.log(`User joined ${otherUser}`);

      this.#updateStatus("connecting");

      this.#peer = otherUser;
    });

    socket.on("offer", this.#handleOfferMsg);
    socket.on("response", this.#handleResponseMsg);
    socket.on("ice-candidate", this.#handleIceCandidateMsg);
  }

  sendMsg = (msg) => {
    if (this.#chatChannel?.readyState === "open") {
      console.log("sending message");
      this.#chatChannel.send(JSON.stringify(msg));
    }
  };

  #handleOtherUser = async (otherUser) => {
    console.log(`Connecting to ${otherUser}`);
    this.#updateStatus("connecting");
    this.#peer = otherUser;
    await this.#startConnection();

    this.#chatChannel = this.#peerConnection.createDataChannel("chat");
    console.log("data channel", this.#chatChannel);

    this.#chatChannel.onopen = () => {
      console.log("Chat Channel Open");
      this.#updateStatus("connected");
    };

    this.#chatChannel.onmessage = (msgEvent) =>
      this.#handleNewMsg(JSON.parse(msgEvent.data));
  };

  #startConnection = async () => {
    const accessToken = await fetch("/api/getAccessToken").then((res) =>
      res.json()
    );

    const config: RTCConfiguration = {
      // iceServers: [
      //   {
      //     urls: "stun:stun.stunprotocol.org",
      //   },
      //   {
      //     urls: "turn:numb.viagenie.ca",
      //     credential: "muazkh",
      //     username: "webrtc@live.com",
      //   },
      // ],
      iceServers: accessToken.ice_servers.map(
        ({ urls, credential, username }) => ({ urls, credential, username })
      ),
    };

    console.log(config);

    this.#peerConnection = new RTCPeerConnection(config);

    this.#peerConnection.onicecandidate = this.#handleNewIceCandidateEvent;
    this.#peerConnection.ondatachannel = this.#handleNewDataChannelEvent;
    this.#peerConnection.onnegotiationneeded = this.#handleNegotionNeededEvent;

    this.#peerConnection.addEventListener("connectionstatechange", () => {
      switch (this.#peerConnection.connectionState) {
        case "disconnected":
          this.#updateStatus("waiting");
          break;
        case "failed":
          this.#updateStatus("failed");
          break;
        case "closed":
          this.#updateStatus("waiting");
          break;
      }
    });

    this.#peerConnection.addEventListener("icegatheringstatechange", (e) => {
      console.log("gathering state", (e.target as any).iceGatheringState);
      if ((e.target as any).iceGatheringState === "complete") {
        setTimeout(
          () =>
            this.#chatChannel?.readyState !== "open" &&
            this.#updateStatus("failed"),
          7000
        );
      }
    });

    console.log(this.#peerConnection.getConfiguration());

    for (const iceCandidate of this.#pendingICECandidates)
      this.#peerConnection.addIceCandidate(iceCandidate).catch((err) => {
        console.log("An ICE Candiditate failed to be added", err.message);
      });
  };

  #handleNewIceCandidateEvent = (event) => {
    const { candidate } = event;
    if (candidate) {
      const target = this.#peer;
      console.log(candidate);

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
    console.log("Received new data channel", event.channel);
    this.#chatChannel = event.channel;
    console.log("ChatConnection", this);

    this.#chatChannel.onopen = () => {
      console.log("Chat Channel Open");
      this.#updateStatus("connected");
    };

    this.#chatChannel.onmessage = (msgEvent) =>
      this.#handleNewMsg(JSON.parse(msgEvent.data));
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
