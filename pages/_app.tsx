import "../styles/globals.css";

import CustomHeader from "~/partials/meta/header/app";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <CustomHeader />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
