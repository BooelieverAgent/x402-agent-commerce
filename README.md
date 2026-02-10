# Agent Commerce Gateway

> AI agents autonomously paying for services using x402 protocol and ERC-8004 identity

Built for the **San Francisco Agentic Commerce x402 Hackathon** (Feb 11-13, 2026)

## 🎯 What is this?

A demonstration of autonomous AI agent commerce where:
- AI agents have verifiable on-chain identity (ERC-8004)
- Agents pay for API services using x402 protocol
- No human intervention required for payments
- Full audit trail on-chain

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   AI Agent      │────▶│  x402 Gateway   │────▶│  Paid Service   │
│  (Booeliever)   │     │   (Verifier)    │     │   (Weather API) │
│  ERC-8004 #14511│◀────│                 │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  Agent Wallet   │     │  CDP Facilitator│
│  (Base/SKALE)   │     │  (Settlement)   │
└─────────────────┘     └─────────────────┘
```

## 🔑 Key Features

- **ERC-8004 Identity**: Verifiable agent identity on Base
- **x402 Payments**: HTTP-native micropayments
- **Autonomous**: Zero human intervention for transactions
- **Auditable**: Full on-chain transaction history
- **Gasless Option**: SKALE integration for free transactions

## 🛠️ Tech Stack

- **Identity**: ERC-8004 on Base (Agent #14511)
- **Payments**: x402 protocol (Coinbase)
- **Networks**: Base, SKALE
- **Backend**: Node.js + Express
- **Agent**: Clawdbot/Booeliever

## 📦 Installation

```bash
npm install
```

## 🚀 Quick Start

### 1. Start the paid API server
```bash
npm run server
```

### 2. Run the agent client
```bash
npm run agent
```

## 📁 Project Structure

```
├── server/           # x402 paywall server
│   └── index.ts      # Express server with x402 middleware
├── agent/            # AI agent client
│   └── client.ts     # Autonomous payment client
├── contracts/        # ERC-8004 verification
└── demo/             # Demo scripts
```

## 🎬 Demo

**Watch the demo:** [Video](./demo/final_demo.mp4)

**On-chain proof (Base Sepolia):** 
- [Agent Wallet Transactions](https://sepolia.basescan.org/address/0x3e3cb10859cCBbb7c9aB0780b1F90Ae8e0456737#tokentxns)
- Example tx: [0xe26db8a92b1184dff04d69320ba389b24a4a5b20b4b1ec1277deec974516c685](https://sepolia.basescan.org/tx/0xe26db8a92b1184dff04d69320ba389b24a4a5b20b4b1ec1277deec974516c685)

### What the demo shows:
1. Agent starts and connects to x402-enabled API server
2. Agent requests paid weather endpoint
3. Server returns HTTP 402 with payment requirements  
4. Agent autonomously signs USDC payment authorization
5. Payment settles on-chain via x402 facilitator
6. Agent receives the paid data
7. Repeat for premium data endpoint

## 👥 Team

- **Booeliever** - AI Agent (ERC-8004 #14511)
- **CryptoHustler** - Human Operator

## 📜 License

MIT

---

Built with 📖 by the Book of Ethereum ecosystem
