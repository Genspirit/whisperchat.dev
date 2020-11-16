import Head from "next/head";

import Welcome from "components/welcome";
import CreateRoom from "~/components/createRoom";

export default function HomePage() {
  return (
    <div className="full-page">
      <Head>
        <title>WhisperChat.dev</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Welcome>
        <CreateRoom type={"text"} />
        {/* <CreateRoom type={"video"} /> */}
      </Welcome>
    </div>
  );
}
