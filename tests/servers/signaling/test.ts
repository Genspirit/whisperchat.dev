import SignalingServer from "~/servers/signaling";

import { Manager } from "socket.io-client";
import { response } from "~/servers/signaling/events";

describe("Servers/Signaling", () => {
  let TestSignalingServer: SignalingServer;

  const SERVER_PORT = 8080;
  const TEST_ROOM = "TESTROOMID";

  beforeEach(() => {
    if (TestSignalingServer) TestSignalingServer.shutDown();

    TestSignalingServer = new SignalingServer(SERVER_PORT);
  });

  afterAll(() => {
    if (TestSignalingServer) TestSignalingServer.shutDown();
  });

  test("clients can connect", (done) => {
    const manager = new Manager("ws://localhost:8080");
    const socket = manager.socket("/");

    socket.on("connect", () => {
      done();
    });
  });

  test("clients can join rooms", (done) => {
    const record = {
      userJoined: false,
      otherUser: false,
      roomFull: false,
    };

    const createEventRecorder = (eventName) => () => {
      record[eventName] = true;
      if (record.userJoined && record.otherUser && record.roomFull) done();
    };

    for (let i = 0; i < 3; i++) {
      const manager = new Manager("ws://localhost:8080");
      const socket = manager.socket("/");

      socket.on("other user", createEventRecorder("otherUser"));
      socket.on("user joined", createEventRecorder("userJoined"));
      socket.on("room full", createEventRecorder("roomFull"));

      socket.emit("join room", TEST_ROOM);
    }
  });

  test("clients can send offers, responses and ice candidates", (done) => {
    const firstSocket = new Manager("ws://localhost:8080").socket("/");
    const secondSocket = new Manager("ws://localhost:8080").socket("/");

    secondSocket.on("other user", (otherUser) => {
      const offer = { target: otherUser, test: true };
      secondSocket.emit("offer", offer);
    });
    secondSocket.on("response", (response) => {
      const iceCandidate = { target: response.from, test: true };
      secondSocket.emit("ice-candidate", iceCandidate);
    });

    firstSocket.on("offer", (offer) => {
      const response = { target: offer.from, test: true };
      firstSocket.emit("response", response);
    });
    firstSocket.on("ice-candidate", () => {
      done();
    });

    firstSocket.emit("join room", TEST_ROOM);
    secondSocket.emit("join room", TEST_ROOM);
  });
});
