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
