// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EduPayChain {

    address public admin;
    uint256 public paymentCount;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    enum Status {
        Pending,
        Verified,
        Rejected
    }

    struct Payment {
        // [FIX #1] NIM di-hash (keccak256) untuk menjaga privasi mahasiswa (UU PDP)
        bytes32 nimHash;
        string semester;
        uint256 amount;
        string proofHash;
        address student;
        Status status;
    }

    mapping(uint256 => Payment) public payments;

    // Index pembayaran per mahasiswa agar front-end bisa query by wallet
    mapping(address => uint256[]) public studentPayments;

    // =========================
    // EVENTS
    // =========================

    event PaymentSubmitted(
        uint256 indexed paymentId,
        bytes32 indexed nimHash, // hash NIM, bukan plaintext
        uint256 amount,
        address indexed student
    );

    event PaymentVerified(
        uint256 indexed paymentId
    );

    event PaymentRejected(
        uint256 indexed paymentId
    );

    // =========================
    // STUDENT
    // =========================

    // [FIX #2] external + calldata: lebih hemat gas dari public + memory
    function submitPayment(
        string calldata _nim,
        string calldata _semester,
        uint256 _amount,
        string calldata _proofHash
    ) external {

        require(bytes(_nim).length > 0, "NIM is required");
        require(bytes(_semester).length > 0, "Semester is required");
        require(_amount > 0, "Amount must be greater than zero");
        // [FIX #3] Validasi panjang CID IPFS minimum (CIDv0 = 46 karakter, CIDv1 >= 59)
        require(bytes(_proofHash).length >= 46, "Invalid IPFS CID: too short");

        // [FIX #1] Hash NIM sebelum disimpan on-chain
        bytes32 nimHash = keccak256(abi.encodePacked(_nim));

        paymentCount++;

        payments[paymentCount] = Payment({
            nimHash: nimHash,
            semester: _semester,
            amount: _amount,
            proofHash: _proofHash,
            student: msg.sender,
            status: Status.Pending
        });

        // Simpan ID transaksi ke index mahasiswa
        studentPayments[msg.sender].push(paymentCount);

        emit PaymentSubmitted(
            paymentCount,
            nimHash,
            _amount,
            msg.sender
        );
    }

    // =========================
    // ADMIN
    // =========================

    // [FIX #2] public -> external
    function verifyPayment(uint256 _id)
        external
        onlyAdmin
    {
        require(_id > 0 && _id <= paymentCount, "Payment not found");

        require(
            payments[_id].status == Status.Pending,
            "Payment already processed"
        );

        payments[_id].status = Status.Verified;

        emit PaymentVerified(_id);
    }

    // [FIX #2] public -> external
    function rejectPayment(uint256 _id)
        external
        onlyAdmin
    {
        require(_id > 0 && _id <= paymentCount, "Payment not found");

        require(
            payments[_id].status == Status.Pending,
            "Payment already processed"
        );

        payments[_id].status = Status.Rejected;

        emit PaymentRejected(_id);
    }

    // =========================
    // READ
    // =========================

    // [FIX #2] public -> external
    function checkStatus(uint256 _id)
        external
        view
        returns (Status)
    {
        require(_id > 0 && _id <= paymentCount, "Payment not found");

        return payments[_id].status;
    }

    // [FIX #2] public -> external; storage pointer lebih efisien dari memory copy
    function getPayment(uint256 _id)
        external
        view
        returns (
            bytes32 nimHash, // [FIX #1] return hash, bukan NIM asli
            string memory semester,
            uint256 amount,
            string memory proofHash,
            address student,
            Status status
        )
    {
        require(_id > 0 && _id <= paymentCount, "Payment not found");

        Payment storage p = payments[_id]; // storage pointer, tidak copy ke memory

        return (
            p.nimHash,
            p.semester,
            p.amount,
            p.proofHash,
            p.student,
            p.status
        );
    }

    // Fungsi tambahan: ambil semua Payment ID milik satu mahasiswa (untuk front-end)
    function getStudentPayments(address _student)
        external
        view
        returns (uint256[] memory)
    {
        return studentPayments[_student];
    }
}