import express from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `);
});

app.get("/", async (req, res) => {
  const blocks = await prisma.blocks.findMany();
  res.send(blocks);
});

// Export the Express API
module.exports = app;
