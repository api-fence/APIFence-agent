# @apifence/agent

Express.js SDK for **APIFence** — automatic request and error monitoring with security detection.

## Features

- Capture all requests & responses
- Capture all errors
- Queue and batch events to APIFence Cloud
- Mask sensitive fields (passwords, tokens)
- Non-blocking, easy integration
- Minimal boilerplate

## Installation

```bash
npm install apifence-agent

import express from "express";
import { APIFenceAgent, apifenceMiddleware, apifenceErrorHandler } from "apifence-agent";

const app = express();

APIFenceAgent.init({
  apiKey: "MY_PUBLIC_KEY",
  serviceName: "my-express-service",
  maskFields: ["password", "token"]
});

app.use(express.json());
app.use(apifenceMiddleware());

app.get("/hello", (req, res) => res.json({ msg: "Hello World" }));

app.use(apifenceErrorHandler());

app.listen(3000, () => console.log("Server running on 3000"));
```# APIFence-agent
