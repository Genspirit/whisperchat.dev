import { useRouter } from "next/router";
import ChatRoom from "~/components/chatRoom";

export default function ChatRoomPage() {
  const router = useRouter();
  const { roomId } = router.query;

  return <ChatRoom roomId={roomId as string} />;
}
