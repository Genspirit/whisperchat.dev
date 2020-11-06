import { getCurrentToken } from "~/services/traversal/";

export default async function getAccessToken(req, res) {
  if (req.method !== "GET") {
    res.status = 400;
    res.end();
    return;
  } else {
    const currentToken = await getCurrentToken();

    res.status = 200;
    res.send(currentToken);
    res.end();
  }
}
