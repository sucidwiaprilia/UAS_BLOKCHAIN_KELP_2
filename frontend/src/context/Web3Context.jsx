/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_MOCK_PAYMENTS, DEFAULT_SCHOOL_ADMIN } from '../config/contract';
import { BlockchainService } from '../services/blockchainService';
import { generateMockCid, generateNimHash, formatCurrentDateTime, formatEthToIdr } from '../utils/formatters';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  // Default null so UI clearly shows "not connected" state
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [payments, setPayments] = useState(() => {
    try {
      const saved = localStorage.getItem('edupaychain_payments_v2');
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
  const txTimerRef = useRef(null);

  const showTxToast = useCallback((status, message, durationMs = 4000) => {
    if (txTimerRef.current) clearTimeout(txTimerRef.current);
    setTxStatus(status);
    setTxMessage(message);
    if (durationMs > 0 && status !== 'pending') {
      txTimerRef.current = setTimeout(() => {
        setTxStatus(null);
      }, durationMs);
    }
  }, []);

  // Persist payments state to browser storage automatically whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('edupaychain_payments_v2', JSON.stringify(payments));
    } catch (e) {
      console.warn('Gagal menyimpan ke storage lokal:', e);
    }
  }, [payments]);

  // Listen for MetaMask account/chain changes reactively
  useEffect(() => {
    const cleanup = BlockchainService.listenForAccountChanges(
      async (newAccount) => {
        if (newAccount) {
          setAccount(newAccount);
          const onChainAdmin = await BlockchainService.getContractAdmin();
          const adminAddress = onChainAdmin || DEFAULT_SCHOOL_ADMIN;
          const authorized = newAccount.toLowerCase() === adminAddress.toLowerCase() || newAccount.toLowerCase() === DEFAULT_SCHOOL_ADMIN.toLowerCase();
          setIsAuthorizedAdmin(authorized);
          setIsAdmin(authorized);
        } else {
          // User disconnected in MetaMask
          setAccount(null);
          setIsAuthorizedAdmin(false);
          setIsAdmin(false);
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
      showTxToast('error', 'MetaMask tidak ditemukan. Aplikasi berjalan dalam mode Demo interaktif.', 5000);
      return;
    }

    try {
      setLoading(true);
      showTxToast('pending', 'Menghubungkan ke MetaMask...', 0);

      const { account: connectedAcc, isValidChain } = await BlockchainService.connectBrowserProvider();

      setAccount(connectedAcc);
      setIsDemoMode(false);
      setNetworkError(!isValidChain);

      // Verifikasi on-chain apakah alamat wallet yang terhubung adalah Admin Sekolah resmi
      const onChainAdmin = await BlockchainService.getContractAdmin();
      const adminAddress = onChainAdmin || DEFAULT_SCHOOL_ADMIN;
      const authorized = connectedAcc.toLowerCase() === adminAddress.toLowerCase() || connectedAcc.toLowerCase() === DEFAULT_SCHOOL_ADMIN.toLowerCase();

      setIsAuthorizedAdmin(authorized);
      setIsAdmin(authorized);

      if (!isValidChain) {
        showTxToast('error', 'Jaringan tidak sesuai! Harap ganti ke Sepolia Testnet (Chain ID: 11155111) atau Localhost 8545.', 6000);
      } else if (authorized) {
        showTxToast('success', `Wallet Admin Sekolah Terverifikasi: ${connectedAcc.substring(0, 6)}...${connectedAcc.slice(-4)}`, 5000);
      } else {
        showTxToast('success', `Wallet Mahasiswa Terhubung: ${connectedAcc.substring(0, 6)}...${connectedAcc.slice(-4)}`, 4000);
      }
    } catch (err) {
      console.error('MetaMask connection failed:', err);
      setIsDemoMode(true);
      if (BlockchainService.isUserRejection(err)) {
        showTxToast('error', 'Koneksi ditolak oleh pengguna di MetaMask.', 4000);
      } else {
        showTxToast('error', `Gagal terhubung: ${err.message}`, 5000);
      }
    } finally {
      setLoading(false);
    }
  }, [showTxToast]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setIsAuthorizedAdmin(false);
    setIsAdmin(false);
    setIsDemoMode(true);
    setNetworkError(false);
  }, []);

  const toggleRole = useCallback(() => {
    if (!isDemoMode && account && !isAuthorizedAdmin) {
      showTxToast('error', 'Akses Ditolak: Wallet Anda tidak terotorisasi sebagai Admin Pihak Sekolah di Smart Contract.', 5000);
      return;
    }
    setIsAdmin(prev => !prev);
  }, [isDemoMode, account, isAuthorizedAdmin, showTxToast]);

  const submitNewPayment = useCallback(async ({ nim, semester, amountEth, amountIdrDirect, fileDataUrl }) => {
    setLoading(true);
    showTxToast('pending', 'Memproses pembayaran...', 0);

    try {
      const mockCid = generateMockCid();
      let localNimHash = generateNimHash();
      let assignedId = null;

      if (!isDemoMode && account) {
        showTxToast('pending', 'Menunggu konfirmasi MetaMask untuk transaksi on-chain...', 0);
        try {
          const { receipt, parsedEvent } = await BlockchainService.submitPaymentOnChain(nim, semester, amountEth, mockCid);
          if (receipt) {
            if (parsedEvent) {
              assignedId = parsedEvent.paymentId;
              localNimHash = parsedEvent.nimHash;
            }
            showTxToast('success', 'Transaksi berhasil dikonfirmasi di blockchain Ethereum!', 5000);
          }
        } catch (e) {
          if (BlockchainService.isUserRejection(e)) {
            showTxToast('error', 'Transaksi dibatalkan oleh pengguna di MetaMask.', 4000);
            return { status: 'error', errorType: 'user_rejected', message: 'Penolakan Konfirmasi MetaMask: Transaksi dibatalkan oleh pengguna di dalam dompet digital.' };
          }
          console.warn('On-chain submit failed, fallback to local state:', e.message);
          showTxToast('error', `On-chain gagal: ${e.reason || e.message}. Data disimpan di mode demo lokal.`, 5000);
        }
      } else {
        showTxToast('success', 'Pembayaran berhasil disubmit (Demo Mode).', 4000);
      }

      let createdPay = null;
      setPayments(prev => {
        const maxId = prev.length > 0 ? Math.max(...prev.map(p => Number(p.id) || 0)) : 0;
        const finalId = assignedId !== null ? assignedId : maxId + 1;

        createdPay = {
          id: finalId,
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
          isRealTx: !isDemoMode && Boolean(account)
        };

        return [createdPay, ...prev];
      });

      return { status: 'success', data: createdPay };
    } catch (err) {
      console.error('Error submitNewPayment:', err);
      showTxToast('error', `Terjadi kesalahan sistem: ${err.message}`, 5000);
      return { status: 'error', errorType: 'system_error', message: err.message || 'Gagal memproses pembayaran UKT.' };
    } finally {
      setLoading(false);
    }
  }, [isDemoMode, account, showTxToast]);

  const verifyPaymentRecord = useCallback(async (id) => {
    setLoading(true);
    showTxToast('pending', 'Memverifikasi pembayaran di blockchain...', 0);

    try {
      if (!isDemoMode && account) {
        try {
          showTxToast('pending', 'Menunggu konfirmasi MetaMask...', 0);
          await BlockchainService.verifyPaymentOnChain(id);
          showTxToast('success', 'Pembayaran berhasil diverifikasi on-chain!', 4000);
        } catch (e) {
          if (BlockchainService.isUserRejection(e)) {
            showTxToast('error', 'Verifikasi dibatalkan oleh pengguna di MetaMask.', 4000);
            return;
          }
          console.warn('On-chain verify fallback:', e.message);
          showTxToast('error', `On-chain gagal: ${e.reason || e.message}. Status diupdate lokal.`, 5000);
        }
      } else {
        showTxToast('success', 'Pembayaran diverifikasi (Demo Mode).', 4000);
      }

      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 1 } : p));
    } finally {
      setLoading(false);
    }
  }, [isDemoMode, account, showTxToast]);

  const rejectPaymentRecord = useCallback(async (id) => {
    setLoading(true);
    showTxToast('pending', 'Menolak pembayaran...', 0);

    try {
      if (!isDemoMode && account) {
        try {
          showTxToast('pending', 'Menunggu konfirmasi MetaMask...', 0);
          await BlockchainService.rejectPaymentOnChain(id);
          showTxToast('success', 'Pembayaran berhasil ditolak on-chain!', 4000);
        } catch (e) {
          if (BlockchainService.isUserRejection(e)) {
            showTxToast('error', 'Penolakan dibatalkan oleh pengguna di MetaMask.', 4000);
            return;
          }
          console.warn('On-chain reject fallback:', e.message);
          showTxToast('error', `On-chain gagal: ${e.reason || e.message}. Status diupdate lokal.`, 5000);
        }
      } else {
        showTxToast('success', 'Pembayaran ditolak (Demo Mode).', 4000);
      }

      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 2 } : p));
    } finally {
      setLoading(false);
    }
  }, [isDemoMode, account, showTxToast]);

  return (
    <Web3Context.Provider
      value={{
        account,
        isAdmin,
        isAuthorizedAdmin,
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
        showTxToast,
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
