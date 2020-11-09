import Head from "next/head";
import styles from "../styles/Home.module.css";

import CreateRoom from "~/components/createRoom";

export default function CreateChatRoom() {
  return (
    <div className={styles.container}>
      <Head>
        <title>WhisperChat.dev</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="/">WhisperChat.dev!</a>
        </h1>
        <CreateRoom />
      </main>
    </div>
  );
}
