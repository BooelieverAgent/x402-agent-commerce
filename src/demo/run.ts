import { spawn, ChildProcess } from "child_process";
import path from "path";

/**
 * x402 Agent Commerce Demo Runner
 * 
 * This script orchestrates the full demo:
 * 1. Starts the x402 server (paid API)
 * 2. Waits for server to be ready
 * 3. Runs the agent client to demonstrate autonomous payment
 * 4. Shuts everything down
 */

const ROOT = path.resolve(__dirname, "../..");
let serverProcess: ChildProcess | null = null;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer(url: string, maxAttempts = 30): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`${url}/health`);
      if (response.ok) {
        return true;
      }
    } catch {
      // Server not ready yet
    }
    await sleep(1000);
  }
  return false;
}

async function main(): Promise<void> {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║   📖 Book of Ethereum presents:                                           ║
║                                                                           ║
║   ██████╗  ██████╗  ██████╗ ███████╗██╗     ██╗███████╗██╗   ██╗███████╗  ║
║   ██╔══██╗██╔═══██╗██╔═══██╗██╔════╝██║     ██║██╔════╝██║   ██║██╔════╝  ║
║   ██████╔╝██║   ██║██║   ██║█████╗  ██║     ██║█████╗  ██║   ██║█████╗    ║
║   ██╔══██╗██║   ██║██║   ██║██╔══╝  ██║     ██║██╔══╝  ╚██╗ ██╔╝██╔══╝    ║
║   ██████╔╝╚██████╔╝╚██████╔╝███████╗███████╗██║███████╗ ╚████╔╝ ███████╗  ║
║   ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚══════╝╚═╝╚══════╝  ╚═══╝  ╚══════╝  ║
║                                                                           ║
║   Agent Commerce Demo | x402 Protocol                                     ║
║   ERC-8004 Agent #14511 | Built for SF Agentic Commerce Hackathon        ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `);

  const serverUrl = process.env.RESOURCE_SERVER_URL || "http://localhost:4021";

  // Step 1: Start the server
  console.log("\n📡 Step 1: Starting x402 Payment Server...\n");

  serverProcess = spawn("npx", ["ts-node", "src/server/index.ts"], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env },
  });

  serverProcess.stdout?.on("data", (data) => {
    process.stdout.write(`[SERVER] ${data}`);
  });

  serverProcess.stderr?.on("data", (data) => {
    process.stderr.write(`[SERVER] ${data}`);
  });

  // Wait for server to be ready
  console.log("⏳ Waiting for server to be ready...");
  const serverReady = await waitForServer(serverUrl);

  if (!serverReady) {
    console.error("❌ Server failed to start");
    cleanup();
    process.exit(1);
  }

  console.log("✅ Server is ready!\n");
  await sleep(2000);

  // Step 2: Run the agent client
  console.log("═".repeat(75));
  console.log("\n🤖 Step 2: Running Autonomous Agent Client...\n");
  console.log("═".repeat(75));

  const clientProcess = spawn("npx", ["ts-node", "src/agent/client.ts"], {
    cwd: ROOT,
    stdio: "inherit",
    env: { ...process.env },
  });

  await new Promise<void>((resolve, reject) => {
    clientProcess.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Client exited with code ${code}`));
      }
    });
  });

  // Done
  console.log("\n═".repeat(75));
  console.log(`
🎉 Demo Complete!

What you just witnessed:
• An AI agent (Booeliever, ERC-8004 #14511) discovered paid API endpoints
• The agent autonomously signed payment authorizations using x402 protocol
• Payments were settled on-chain (Base network)
• The agent received API responses after successful payment

This is the future of AI agent commerce - autonomous economic actors
operating on Ethereum infrastructure.

Learn more:
• x402 Protocol: https://x402.org
• ERC-8004: https://eips.ethereum.org/EIPS/eip-8004
• Book of Ethereum: https://bookofethereum.com
  `);

  cleanup();
}

function cleanup(): void {
  if (serverProcess) {
    console.log("\n🛑 Shutting down server...");
    serverProcess.kill();
  }
}

// Handle cleanup on exit
process.on("SIGINT", () => {
  cleanup();
  process.exit(0);
});

process.on("SIGTERM", () => {
  cleanup();
  process.exit(0);
});

main().catch((error) => {
  console.error("Demo failed:", error);
  cleanup();
  process.exit(1);
});
