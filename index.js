import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";

import { thirdwebClient } from "./thirdwebClient.mjs";
import environment from "./environment.mjs";

// server config
const app = express();
const port = process.env.PORT || 3001;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: `${environment.NODE_ENV === "development" ? "http" : "https"}://${
      environment.CLIENT_DOMAIN
    }`,
    credentials: true,
  })
);

// auth
const thirdwebAuth = createAuth({
  domain: environment.CLIENT_DOMAIN,
  client: thirdwebClient,
  adminAccount: privateKeyToAccount({
    client: thirdwebClient,
    privateKey: environment.ADMIN_PRIVATE_KEY,
  }),
});

// routes
app.get("/", (req, res) => {
  res.json({ data: "Hello, World!" });
});

app.get("/login", async (req, res) => {
  const address = req.query.address;
  const chainId = req.query.chainId;

  if (typeof address !== "string") {
    return res.status(400).send("Address is required");
  }

  return res.send(
    await thirdwebAuth.generatePayload({
      address,
      chainId: chainId ? parseInt(chainId) : undefined,
    })
  );
});

app.post("/login", async (req, res) => {
  const payload = req.body;
  console.log(payload);

  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);

  if (verifiedPayload.valid) {
    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
    });
    res.cookie("jwt", jwt);
    return res.status(200).send({ token: jwt });
  }

  res.status(400).send("Failed to login");
});

app.get("/isLoggedIn", async (req, res) => {
  const jwt = req.cookies?.jwt;

  if (!jwt) {
    return res.send(false);
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt });
  if (!authResult.valid) {
    return res.send(false);
  }

  return res.send(true);
});

app.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  return res.send(true);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
