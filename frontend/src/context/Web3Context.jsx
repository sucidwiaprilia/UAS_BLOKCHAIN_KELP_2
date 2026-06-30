/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_MOCK_PAYMENTS } from '../config/contract';
import { BlockchainService } from '../services/blockchainService';
import { generateMockCid, generateNimHash, formatCurrentDateTime, formatEthToIdr } from '../utils/formatters';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  // Default null so UI clearly shows "not connected" state
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [payments, setPayments] = useState(() => {
    try {
      const saved = localStorage.getItem('edupaychain_payments_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Gagal membaca storage lokal:', e);
    }
    return INITIAL_MOCK_PAYMENTS;
  });
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  // Track the on-chain transaction status for the UI
  const [txStatus, setTxStatus] = useState(null); // null | 'pending' | 'success' | 'error'
  const [txMessage, setTxMessage] = useState('');

  // Persist payments state to browser storage automatically whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('edupaychain_payments_v1', JSON.stringify(payments));
    } catch (e) {
      console.warn('Gagal menyimpan ke storage lokal:', e);
    }
  }, [payments]);

  // Listen for MetaMask account/chain changes reactively
  useEffect(() => {
    const cleanup = BlockchainService.listenForAccountChanges(
      (newAccount) => {
        if (newAccount) {
          setAccount(newAccount);
        } else {
          // User disconnected in MetaMask
          setAccount(null);
          setIsDemoMode(true);
          setNetworkError(false);
        }
      },
      (newChainId) => {
        const valid = newChainId === 11155111 || newChainId === 31337;
        setNetworkError(!valid);
        // Force page reload on chain change — standard pattern for DApps
        window.location.reload();
      }
    );
    return cleanup;
  }, []);

  const connectWallet = useCallback(async () => {
    if (!BlockchainService.hasEthereumProvider()) {
      // No MetaMask — stay in demo mode with clear user feedback
      setTxStatus('error');
      setTxMessage('MetaMask tidak ditemukan. Aplikasi berjalan dalam mode Demo interaktif.');
      return;
    }

    try {
      setLoading(true);
      setTxStatus('pending');
      setTxMessage('Menghubungkan ke MetaMask...');

      const { account: connectedAcc, isValidChain } = await BlockchainService.connectBrowserProvider();

      setAccount(connectedAcc);
      setIsDemoMode(false);
      setNetworkError(!isValidChain);

      if (!isValidChain) {
        setTxStatus('error');
        setTxMessage('Jaringan tidak sesuai! Harap ganti ke Sepolia Testnet (Chain ID: 11155111) atau Localhost 8545.');
      } else {
        setTxStatus('success');
        setTxMessage(`Wallet berhasil terhubung: ${connectedAcc.substring(0, 6)}...${connectedAcc.slice(-4)}`);
      }
    } catch (err) {
      console.error('MetaMask connection failed:', err);
      // User rejected or other MetaMask error — stay in demo mode
      setIsDemoMode(true);
      setTxStatus('error');
      setTxMessage(err.code === 4001 ? 'Koneksi ditolak oleh pengguna.' : `Gagal terhubung: ${err.message}`);
    } finally {
      setLoading(false);
      // Clear status badge after 4 seconds
      setTimeout(() => setTxStatus(null), 4000);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setIsDemoMode(true);
    setNetworkError(false);
  }, []);

  const toggleRole = useCallback(() => {
    setIsAdmin(prev => !prev);
  }, []);

  const submitNewPayment = useCallback(async ({ nim, semester, amountEth, amountIdrDirect, fileDataUrl }) => {
    setLoading(true);
    setTxStatus('pending');
    setTxMessage('Memproses pembayaran...');

    try {
      const mockCid = generateMockCid();
      const localNimHash = generateNimHash();

      const newPay = {
        id: payments.length + 1,
        nim,
        nimHash: localNimHash,
        semester,
        amountEth: String(amountEth),
        amountIdr: amountIdrDirect || formatEthToIdr(amountEth),
        proofHash: mockCid,
        fileDataUrl: fileDataUrl || null,
        student: account || '0xDemoMode',
        status: 0,
        timestamp: formatCurrentDateTime(),
        isRealTx: true
      };

      if (!isDemoMode && account) {
        // Live on-chain transaction
        setTxMessage('Menunggu konfirmasi MetaMask...');
        try {
          const receipt = await BlockchainService.submitPaymentOnChain(nim, semester, amountEth, mockCid);
          if (receipt) {
            // Update nimHash from on-chain event if possible
            setTxStatus('success');
            setTxMessage('Transaksi berhasil dikonfirmasi di blockchain!');
          }
        } catch (e) {
          if (e.code === 4001) {
            setTxStatus('error');
            setTxMessage('Transaksi ditolak oleh pengguna di MetaMask.');
            return null;
          }
          // Contract error or RPC error — fall back to local state so UI still works
          console.warn('On-chain submit failed, fallback to local state:', e.message);
          setTxStatus('error');
          setTxMessage(`On-chain gagal: ${e.reason || e.message}. Data disimpan lokal.`);
        }
      } else {
        setTxStatus('success');
        setTxMessage('Pembayaran berhasil disubmit (Demo Mode).');
      }

      // Always update local state so UI reflects the new payment
      setPayments(prev => [newPay, ...prev]);
      return newPay;
    } finally {
      setLoading(false);
      setTimeout(() => setTxStatus(null), 5000);
    }
  }, [isDemoMode, account, payments]);

  const verifyPaymentRecord = useCallback(async (id) => {
    setLoading(true);
    setTxStatus('pending');
    setTxMessage('Memverifikasi pembayaran di blockchain...');

    try {
      if (!isDemoMode && account) {
        try {
          setTxMessage('Menunggu konfirmasi MetaMask...');
          await BlockchainService.verifyPaymentOnChain(id);
          setTxStatus('success');
          setTxMessage('Pembayaran berhasil diverifikasi on-chain!');
        } catch (e) {
          if (e.code === 4001) {
            setTxStatus('error');
            setTxMessage('Verifikasi dibatalkan oleh pengguna.');
            return;
          }
          console.warn('On-chain verify fallback:', e.message);
          setTxStatus('error');
          setTxMessage(`On-chain gagal: ${e.reason || e.message}. Status diupdate lokal.`);
        }
      } else {
        setTxStatus('success');
        setTxMessage('Pembayaran diverifikasi (Demo Mode).');
      }

      // Always update local UI state
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 1 } : p));
    } finally {
      setLoading(false);
      setTimeout(() => setTxStatus(null), 4000);
    }
  }, [isDemoMode, account]);

  const rejectPaymentRecord = useCallback(async (id) => {
    setLoading(true);
    setTxStatus('pending');
    setTxMessage('Menolak pembayaran...');

    try {
      if (!isDemoMode && account) {
        try {
          setTxMessage('Menunggu konfirmasi MetaMask...');
          await BlockchainService.rejectPaymentOnChain(id);
          setTxStatus('success');
          setTxMessage('Pembayaran berhasil ditolak on-chain!');
        } catch (e) {
          if (e.code === 4001) {
            setTxStatus('error');
            setTxMessage('Penolakan dibatalkan oleh pengguna.');
            return;
          }
          console.warn('On-chain reject fallback:', e.message);
          setTxStatus('error');
          setTxMessage(`On-chain gagal: ${e.reason || e.message}. Status diupdate lokal.`);
        }
      } else {
        setTxStatus('success');
        setTxMessage('Pembayaran ditolak (Demo Mode).');
      }

      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 2 } : p));
    } finally {
      setLoading(false);
      setTimeout(() => setTxStatus(null), 4000);
    }
  }, [isDemoMode, account]);

  return (
    <Web3Context.Provider
      value={{
        account,
        isAdmin,
        isDemoMode,
        payments,
        loading,
        networkError,
        txStatus,
        txMessage,
        connectWallet,
        disconnectWallet,
        toggleRole,
        submitNewPayment,
        verifyPaymentRecord,
        rejectPaymentRecord,
        setIsAdmin,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) throw new Error('useWeb3 must be used inside Web3Provider');
  return context;
}
