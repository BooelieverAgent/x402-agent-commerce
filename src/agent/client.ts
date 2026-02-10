import { config } from "dotenv";
import { x402Client, wrapAxiosWithPayment, x402HTTPClient } from "@x402/axios";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";
import axios from "axios";

config();

/**
 * Booeliever Agent Client
 * 
 * An AI agent that autonomously pays for API services using x402 protocol.
 * Identity: ERC-8004 #14511 on Base
 */

const evmPrivateKey = process.env.AGENT_PRIVATE_KEY as `0x${string}`;
const baseURL = process.env.RESOURCE_SERVER_URL || "http://localhost:4021";

if (!evmPrivateKey) {
  console.error("❌ AGENT_PRIVATE_KEY environment variable is required");
  console.log("\nSet your agent wallet private key in .env file");
  process.exit(1);
}

async function main(): Promise<void> {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║         🤖 Booeliever Agent Client                            ║
║         ERC-8004 #14511 | Autonomous Commerce                 ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  // Initialize signer from private key
  const evmSigner = privateKeyToAccount(evmPrivateKey);
  console.log(`🔐 Agent wallet: ${evmSigner.address}`);
  console.log(`🌐 Target server: ${baseURL}`);
  console.log("");

  // Create x402 client
  const client = new x402Client();
  registerExactEvmScheme(client, { signer: evmSigner });

  // Wrap axios with payment handling
  const api = wrapAxiosWithPayment(axios.create(), client);

  // Step 1: Check server health (free)
  console.log("📡 Checking server health...");
  try {
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log(`✅ Server healthy:`, healthResponse.data);
    console.log("");
  } catch (error: any) {
    console.error(`❌ Server not reachable: ${error.message}`);
    process.exit(1);
  }

  // Step 2: Try to access paid weather endpoint
  console.log("🌤️  Requesting weather data (paid endpoint: $0.001)...");
  console.log("   → Agent will automatically sign and pay via x402 protocol");
  console.log("");

  try {
    const response = await api.get(`${baseURL}/weather`);
    const body = response.data;

    console.log("✅ Weather data received!");
    console.log("─".repeat(50));
    console.log(JSON.stringify(body, null, 2));
    console.log("─".repeat(50));

    // Check payment response
    if (response.status < 400) {
      const paymentResponse = new x402HTTPClient(client).getPaymentSettleResponse(
        name => response.headers[name.toLowerCase()],
      );
      if (paymentResponse) {
        console.log("\n💰 Payment settled on-chain:");
        console.log(`   Transaction: ${paymentResponse.transaction || 'pending'}`);
        console.log(`   Network: ${paymentResponse.network || 'Base (eip155:8453)'}`);
      }
    }
  } catch (error: any) {
    if (error.response?.status === 402) {
      console.log("⚠️  Payment required but couldn't be fulfilled");
      console.log("   Check your wallet balance and USDC approval");
    } else {
      console.error(`❌ Request failed: ${error.message}`);
    }
    throw error;
  }

  console.log("\n");
  
  // Step 3: Access premium data endpoint
  console.log("📊 Requesting premium market data (paid endpoint: $0.01)...");
  console.log("");

  try {
    const response = await api.get(`${baseURL}/premium-data`);
    const body = response.data;

    console.log("✅ Premium data received!");
    console.log("─".repeat(50));
    console.log(JSON.stringify(body, null, 2));
    console.log("─".repeat(50));

    if (response.status < 400) {
      const paymentResponse = new x402HTTPClient(client).getPaymentSettleResponse(
        name => response.headers[name.toLowerCase()],
      );
      if (paymentResponse) {
        console.log("\n💰 Payment settled on-chain:");
        console.log(`   Transaction: ${paymentResponse.transaction || 'pending'}`);
        console.log(`   Network: ${paymentResponse.network || 'Base (eip155:8453)'}`);
      }
    }
  } catch (error: any) {
    if (error.response?.status === 402) {
      console.log("⚠️  Payment required but couldn't be fulfilled");
    } else {
      console.error(`❌ Request failed: ${error.message}`);
    }
    throw error;
  }

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  ✅ Demo Complete                                             ║
║                                                               ║
║  Booeliever (ERC-8004 #14511) successfully:                   ║
║  • Discovered paid API endpoints                              ║
║  • Signed payment authorizations autonomously                 ║
║  • Received API responses after payment settlement            ║
║                                                               ║
║  This demonstrates AI agents as autonomous economic actors    ║
║  on the Ethereum network using x402 protocol.                 ║
╚═══════════════════════════════════════════════════════════════╝
  `);
}

main().catch(error => {
  console.error(error?.response?.data?.error ?? error.message ?? error);
  process.exit(1);
});
