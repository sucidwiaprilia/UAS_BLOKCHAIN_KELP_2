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
        uint256 id;
        string nim;
        string semester;
        uint256 amount;
        string proofHash;
        address student;
        Status status;
    }

    mapping(uint256 => Payment) public payments;

    // =========================
    // EVENTS
    // =========================

    event PaymentSubmitted(
        uint256 indexed paymentId,
        string nim,
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

    function submitPayment(
        string memory _nim,
        string memory _semester,
        uint256 _amount,
        string memory _proofHash
    ) public {

        require(bytes(_nim).length > 0, "NIM is required");
        require(bytes(_semester).length > 0, "Semester is required");
        require(_amount > 0, "Amount must be greater than zero");
        require(bytes(_proofHash).length > 0, "Proof hash is required");

        paymentCount++;

        payments[paymentCount] = Payment({
            id: paymentCount,
            nim: _nim,
            semester: _semester,
            amount: _amount,
            proofHash: _proofHash,
            student: msg.sender,
            status: Status.Pending
        });

        emit PaymentSubmitted(
            paymentCount,
            _nim,
            _amount,
            msg.sender
        );
    }

    // =========================
    // ADMIN
    // =========================

    function verifyPayment(uint256 _id)
        public
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

    function rejectPayment(uint256 _id)
        public
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

    function checkStatus(uint256 _id)
        public
        view
        returns (Status)
    {
        require(_id > 0 && _id <= paymentCount, "Payment not found");

        return payments[_id].status;
    }

    function getPayment(uint256 _id)
        public
        view
        returns (
            string memory nim,
            string memory semester,
            uint256 amount,
            string memory proofHash,
            address student,
            Status status
        )
    {
        require(_id > 0 && _id <= paymentCount, "Payment not found");

        Payment memory p = payments[_id];

        return (
            p.nim,
            p.semester,
            p.amount,
            p.proofHash,
            p.student,
            p.status
        );
    }
}