<<<<<<< HEAD
import { network_config } from "./00_network_config";
import * as constants from "./01_constants";

export { constants };
export { network_config };
=======
const express = require("express");

const app = express();
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `);
});

app.get("/", (req: any, res: any) => {
  res.send("Hey this is my API running 🥳");
});

// Export the Express API
module.exports = app;
>>>>>>> 5745cd1942e49889c11c6d38bf11e98a53bf084e
