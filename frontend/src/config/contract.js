import { formatRecentDateTime } from '../utils/formatters';

// EduPayChain Smart Contract Configuration
// Mengutamakan variabel lingkungan (.env) sesuai prinsip Clean Architecture,
// dengan fallback ke alamat kontrak default jika .env belum dikonfigurasi.
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x83CE915430fE4B1114f766B769B47b4dF1dA8C67";

// Alamat wallet resmi Pihak Sekolah / Admin Kontrak (Deployer Account #0 pada Hardhat/Anvil/Sepolia)
export const DEFAULT_SCHOOL_ADMIN = import.meta.env.VITE_SCHOOL_ADMIN_ADDRESS || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

export const SEPOLIA_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID) || 11155111; // 0xaa36a7

export const CONTRACT_ABI = [
  "constructor()",
  "function admin() external view returns (address)",
  "function paymentCount() external view returns (uint256)",
  "function submitPayment(string _nim, string _semester, uint256 _amount, string _proofHash) external",
  "function verifyPayment(uint256 _id) external",
  "function rejectPayment(uint256 _id) external",
  "function checkStatus(uint256 _id) external view returns (uint8)",
  "function getPayment(uint256 _id) external view returns (bytes32 nimHash, string semester, uint256 amount, string proofHash, address student, uint8 status)",
  "function getStudentPayments(address _student) external view returns (uint256[])",
  "event PaymentSubmitted(uint256 indexed paymentId, bytes32 indexed nimHash, uint256 amount, address indexed student)",
  "event PaymentVerified(uint256 indexed paymentId)",
  "event PaymentRejected(uint256 indexed paymentId)"
];

// Default mock initial data so the app looks vibrant and realistic right out of the box (matching PNG mockups!)
export const INITIAL_MOCK_PAYMENTS = [
  {
    id: 1,
    nim: "21040120",
    nimHash: "0x8f72a9c31b8e4f5a112233445566778899aabbccddeeff001122334455667788",
    semester: "Semester 7",
    amountEth: "0.45",
    amountIdr: "Rp 12.500.000",
    proofHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme", // IPFS welcome readme (single file)
    student: "0x71C8a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d64f92",
    status: 0, // Pending
    timestamp: formatRecentDateTime(0, "14:30")
  },
  {
    id: 2,
    nim: "21040115",
    nimHash: "0x4d12e8b91a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d00",
    semester: "Semester 3",
    amountEth: "0.31",
    amountIdr: "Rp 8.750.000",
    proofHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/about", // IPFS about doc (single file)
    student: "0x93B2c1a4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0",
    status: 1, // Verified
    timestamp: formatRecentDateTime(1, "10:15")
  },
  {
    id: 3,
    nim: "21040089",
    nimHash: "0x9b22c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
    semester: "Semester 5",
    amountEth: "0.36",
    amountIdr: "Rp 10.200.000",
    proofHash: "QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB", // IPFS dist welcome (single file, terverifikasi)
    student: "0x41E5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3",
    status: 2, // Rejected
    timestamp: formatRecentDateTime(2, "16:45")
  },
  {
    id: 4,
    nim: "21040199",
    nimHash: "0x1a78f2e3d4c5b6a7988776655443322110099887766554433221100998877600",
    semester: "Semester 1",
    amountEth: "0.54",
    amountIdr: "Rp 15.000.000",
    proofHash: "QmWATWQ7fVPP2EFGu71UkfnqhYXDYH566qy47CnJDgvs8u", // "Hello World" (single file paling stabil di IPFS)
    student: "0x52F6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4",
    status: 1, // Verified
    timestamp: formatRecentDateTime(3, "11:20")
  }
];
