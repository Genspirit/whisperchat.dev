import { SID, TOKEN, URL } from "~/.secrets/twilio.json";
import fetch from "node-fetch";

const Authorization = `Basic ${Buffer.from(`${SID}:${TOKEN}`).toString(
  "base64"
)}`;

const OPTIONS = {
  method: "POST",
  headers: { Authorization },
};

export const getAccessToken = async () =>
  fetch(URL, OPTIONS).then((res) => res.json());
