import express from "express";
import { paymentMiddleware } from "@x402/express";
import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
import { registerExactEvmScheme } from "@x402/evm/exact/server";
import dotenv from "dotenv";

dotenv.config();

/**
 * x402 Agent Commerce Demo Server
 * 
 * A simple paid weather API that demonstrates the x402 payment protocol.
 * AI agents can autonomously pay to access this API.
 */

const PORT = process.env.PORT || "4021";
const NETWORK = "eip155:8453"; // Base mainnet
const PAYEE_ADDRESS = process.env.PAYEE_ADDRESS as `0x${string}` || "0x3e3cb10859cCBbb7c9aB0780b1F90Ae8e0456737"; // Booeliever agent wallet
const FACILITATOR_URL = process.env.FACILITATOR_URL || "https://x402.org/facilitator";

// Initialize Express app
const app = express();
app.use(express.json());

// Create HTTP facilitator client
const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });

// Create x402 resource server
const server = new x402ResourceServer(facilitatorClient);

// Register EVM scheme for Base
registerExactEvmScheme(server);

console.log(`🤖 Booeliever Agent Commerce Server`);
console.log(`💰 Payee: ${PAYEE_ADDRESS}`);
console.log(`🌐 Network: ${NETWORK}`);

/**
 * Configure x402 payment middleware
 * 
 * Our weather endpoint costs $0.001 USDC per request
 */
app.use(
  paymentMiddleware(
    {
      "GET /weather": {
        accepts: {
          payTo: PAYEE_ADDRESS,
          scheme: "exact",
          price: "$0.001", // 0.1 cent per request
          network: NETWORK,
        },
        description: "Get current weather data - powered by Booeliever AI Agent",
      },
      "GET /premium-data": {
        accepts: {
          payTo: PAYEE_ADDRESS,
          scheme: "exact",
          price: "$0.01", // 1 cent for premium data
          network: NETWORK,
        },
        description: "Get premium market data analysis",
      },
    },
    server,
  ),
);

/**
 * Weather endpoint - requires $0.001 USDC payment
 */
app.get("/weather", (req, res) => {
  // Simulated weather data
  const weather = {
    location: "San Francisco, CA",
    temperature: 65,
    unit: "fahrenheit",
    conditions: "Partly Cloudy",
    humidity: 72,
    wind: "12 mph NW",
    timestamp: new Date().toISOString(),
    provider: "Booeliever Weather Service",
    agentId: "ERC-8004 #14511",
  };

  console.log(`✅ Weather request served | Payment received`);
  res.json(weather);
});

/**
 * Premium data endpoint - requires $0.01 USDC payment
 */
app.get("/premium-data", (req, res) => {
  const data = {
    market: "Ethereum Ecosystem",
    sentiment: "Bullish",
    trending: ["x402 Protocol", "ERC-8004", "Agent Commerce"],
    insight: "AI agents are becoming economic actors on-chain",
    timestamp: new Date().toISOString(),
    provider: "Booeliever Market Intelligence",
    agentId: "ERC-8004 #14511",
  };

  console.log(`✅ Premium data request served | Payment received`);
  res.json(data);
});

/**
 * Health check endpoint - free
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    agent: "Booeliever",
    identity: "ERC-8004 #14511",
    network: NETWORK,
    payee: PAYEE_ADDRESS,
    version: "1.0.0",
  });
});

/**
 * Agent info endpoint - free
 */
app.get("/", (req, res) => {
  res.json({
    name: "Booeliever Agent Commerce Gateway",
    description: "AI agent providing paid API services via x402 protocol",
    identity: {
      type: "ERC-8004",
      tokenId: "#14511",
      chain: "Base",
      registry: "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
    },
    endpoints: [
      { path: "/weather", price: "$0.001", description: "Weather data" },
      { path: "/premium-data", price: "$0.01", description: "Market intelligence" },
      { path: "/health", price: "free", description: "Health check" },
    ],
    payment: {
      protocol: "x402",
      network: NETWORK,
      asset: "USDC",
    },
  });
});

// Start the server
app.listen(parseInt(PORT), () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║         🤖 Booeliever Agent Commerce Gateway                  ║
╠═══════════════════════════════════════════════════════════════╣
║  Server:     http://localhost:${PORT}                             ║
║  Network:    Base (eip155:8453)                               ║
║  Identity:   ERC-8004 #14511                                  ║
║                                                               ║
║  Paid Endpoints:                                              ║
║  • GET /weather       $0.001 USDC                            ║
║  • GET /premium-data  $0.01  USDC                            ║
║                                                               ║
║  Free Endpoints:                                              ║
║  • GET /              Agent info                              ║
║  • GET /health        Health check                            ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});
