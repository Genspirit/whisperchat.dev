import { ServerStyleSheets } from "@material-ui/styles";

import React from "react";

import Document from "next/document";
import type { DocumentContext } from "next/document";

export async function ssrMaterialUICSS(ctx: DocumentContext) {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  };
}
