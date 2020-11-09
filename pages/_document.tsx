import Document, { Html, Main, NextScript } from "next/document";

import { ssrMaterialUICSS } from "~/services/styling/materialui";

import CustomHeader from "~/partials/meta/header";

export default class CustomDocument extends Document {
  static getInitialProps = ssrMaterialUICSS;

  render() {
    return (
      <Html lang="en">
        <CustomHeader />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
