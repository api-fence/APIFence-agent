# apifence-agent

**Express.js SDK for APIFence** — automatic request and error monitoring with security and threat detection.

With `apifence-agent`, you can track all requests, errors, and security events in your Express apps and send them securely to **APIFence Cloud**.

---

## Features

- Capture all HTTP requests & responses
- Capture all errors and exceptions
- Queue and batch events to APIFence Cloud
- Mask sensitive fields (passwords, tokens, etc.)
- Non-blocking, minimal boilerplate
- Easy integration with any Express.js app

---

## Getting Started

### 1. Sign up on APIFence Cloud

Visit [https://apifence.cloud](https://apifence.cloud) and create an account.  
After login, navigate to your **Dashboard → API Keys** and generate a key for your application.

---

### 2. Install Package

```bash
npm install apifence-agent express
```

### Basic Usage

```Bash
import express from "express";
import { APIFenceAgent, apifenceMiddleware, apifenceErrorHandler } from "apifence-agent";

const app = express();

// Initialize APIFence Agent
APIFenceAgent.init({
  apiKey: "YOUR_API_KEY_FROM_APIFENCE",  // Get this from https://apifence.cloud
  serviceName: "my-express-service",
  maskFields: ["password", "token"]      // Optional fields to mask
});

// Middleware to capture requests
app.use(express.json());
app.use(apifenceMiddleware());

// Example route
app.get("/hello", (req, res) => res.json({ msg: "Hello World" }));

// Middleware to capture errors
app.use(apifenceErrorHandler());

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
```

### Advanced Configuration
- maskFields: Array of sensitive fields to exclude from logs (e.g., passwords, tokens)
- endpoint: Optional — override default APIFence Cloud endpoint
- serviceName: Unique identifier for your application

### Developer Example

```Bash
// example.ts
import express from "express";
import { APIFenceAgent, apifenceMiddleware, apifenceErrorHandler } from "apifence-agent";

const app = express();

APIFenceAgent.init({
  apiKey: "YOUR_API_KEY",
  serviceName: "example-service",
  maskFields: ["password"]
});

app.use(express.json());
app.use(apifenceMiddleware());

app.get("/", (req, res) => res.send("Hello APIFence!"));

app.use(apifenceErrorHandler());

app.listen(3000, () => console.log("Example server running on port 3000"));
```

### License
MIT
