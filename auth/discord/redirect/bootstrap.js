import Client from "./utils/Client.js";

import { CLIENT_ID, CLIENT_SECRET, CLIENT_TOKEN } from "./config.js";

export const client = new Client(CLIENT_ID, CLIENT_SECRET);