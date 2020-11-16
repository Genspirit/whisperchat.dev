import { useRouter } from "next/router";
// import ChatRoom from "~/components/chatRoom";

export default function VideoRoomPage() {
  const router = useRouter();
  const { roomId } = router.query;

  return <h1>{roomId}</h1>;
}
