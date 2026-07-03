import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, SEPOLIA_CHAIN_ID } from '../config/contract';

/**
 * Infrastructure Layer - Blockchain Service
 * Encapsulates all Ethers.js v6 and Smart Contract interactions.
 */
export class BlockchainService {
  static hasEthereumProvider() {
    return typeof window !== 'undefined' && Boolean(window.ethereum);
  }

  /**
   * Cek apakah error merupakan penolakan/pembatalan oleh pengguna di MetaMask (Ethers v6/v5 compatible)
   */
  static isUserRejection(err) {
    if (!err) return false;
    if (err.code === 'ACTION_REJECTED' || err.code === 4001) return true;
    if (err?.info?.error?.code === 4001) return true;
    const msg = (err.message || err.reason || '').toLowerCase();
    return msg.includes('rejected') || msg.includes('denied') || msg.includes('user cancelled');
  }

  static async connectBrowserProvider() {
    if (!this.hasEthereumProvider()) {
      throw new Error('MetaMask not found in browser');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);

    // Request account access from MetaMask
    const accounts = await provider.send('eth_requestAccounts', []);
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts returned from MetaMask');
    }

    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);
    const isValidChain = chainId === SEPOLIA_CHAIN_ID || chainId === 31337;

    return {
      account: accounts[0],
      chainId,
      isValidChain,
    };
  }

  static async getContractWithSigner() {
    if (!this.hasEthereumProvider()) return null;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }

  static async getContractAdmin() {
    if (!this.hasEthereumProvider()) return null;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      return await contract.admin();
    } catch (e) {
      console.warn('Gagal membaca admin dari smart contract:', e);
      return null;
    }
  }

  /**
   * Submit a payment record to the smart contract.
   */
  static async submitPaymentOnChain(nim, semester, amountEth, proofHash) {
    const contract = await this.getContractWithSigner();
    if (!contract) throw new Error('Failed to connect to contract');

    // Convert ETH string to Wei for on-chain storage
    const amountWei = ethers.parseEther(String(amountEth));

    const tx = await contract.submitPayment(nim, semester, amountWei, proofHash);
    const receipt = await tx.wait();

    // Coba parsing event log PaymentSubmitted dari receipt Ethers v6
    let parsedEvent = null;
    try {
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);
          if (parsed && parsed.name === 'PaymentSubmitted') {
            parsedEvent = {
              paymentId: Number(parsed.args.paymentId),
              nimHash: parsed.args.nimHash,
              amount: ethers.formatEther(parsed.args.amount),
              student: parsed.args.student
            };
            break;
          }
        } catch {
          // Abaikan log dari kontrak lain
        }
      }
    } catch (e) {
      console.warn('Gagal memparsing event log PaymentSubmitted:', e);
    }

    return { receipt, parsedEvent };
  }

  static async verifyPaymentOnChain(paymentId) {
    const contract = await this.getContractWithSigner();
    if (!contract) throw new Error('Failed to connect to contract');
    const tx = await contract.verifyPayment(paymentId);
    return await tx.wait();
  }

  static async rejectPaymentOnChain(paymentId) {
    const contract = await this.getContractWithSigner();
    if (!contract) throw new Error('Failed to connect to contract');
    const tx = await contract.rejectPayment(paymentId);
    return await tx.wait();
  }

  /**
   * Listens for MetaMask account and chain changes and calls the provided callback.
   */
  static listenForAccountChanges(onAccountChange, onChainChange) {
    if (!this.hasEthereumProvider()) return () => {};

    const handleAccountsChanged = (accounts) => {
      onAccountChange(accounts[0] || null);
    };
    const handleChainChanged = (chainId) => {
      onChainChange(Number(chainId));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }
}
