import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { env } from "~/env";

export class SolanaService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(env.SOLANA_RPC_URL, "confirmed");
  }

  // Get connection for client-side use
  getConnection(): Connection {
    return this.connection;
  }

  // Convert SOL to lamports
  solToLamports(sol: number): number {
    return sol * LAMPORTS_PER_SOL;
  }

  // Convert lamports to SOL
  lamportsToSol(lamports: number): number {
    return lamports / LAMPORTS_PER_SOL;
  }

  // Get wallet balance
  async getBalance(walletAddress: string): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(publicKey);
      return this.lamportsToSol(balance);
    } catch (error) {
      console.error("Error getting balance:", error);
      throw new Error("Failed to get wallet balance");
    }
  }

  // Create a payment transaction
  async createPaymentTransaction(
    fromAddress: string,
    toAddress: string,
    amount: number
  ): Promise<Transaction> {
    try {
      const fromPublicKey = new PublicKey(fromAddress);
      const toPublicKey = new PublicKey(toAddress);
      const lamports = this.solToLamports(amount);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: toPublicKey,
          lamports,
        })
      );

      return transaction;
    } catch (error) {
      console.error("Error creating payment transaction:", error);
      throw new Error("Failed to create payment transaction");
    }
  }

  // Validate wallet address
  isValidWalletAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  // Get transaction details
  async getTransaction(signature: string) {
    try {
      return await this.connection.getTransaction(signature, {
        commitment: "confirmed",
      });
    } catch (error) {
      console.error("Error getting transaction:", error);
      throw new Error("Failed to get transaction details");
    }
  }
}

// Export singleton instance
export const solanaService = new SolanaService();
