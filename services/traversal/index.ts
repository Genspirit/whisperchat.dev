import { getAccessToken as getTwilioAccessToken } from "./twilio";
import TokenController from "./controller";

const controller = new TokenController(getTwilioAccessToken);

export const getCurrentToken = async () => controller.getCurrentToken();
