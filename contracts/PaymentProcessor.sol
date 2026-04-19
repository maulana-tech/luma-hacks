// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/// @notice Simple payment processor that executes ERC20 transferFrom and emits a receipt event.
/// Designed for x402-style pay-per-request flows.
contract PaymentProcessor {
    address public owner;
    mapping(address => bool) public allowedToken;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event AllowedTokenSet(address indexed token, bool allowed);
    event PaymentRecorded(
        bytes32 indexed requestId,
        address indexed payer,
        address indexed recipient,
        address token,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }

    constructor(address initialToken) {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);

        if (initialToken != address(0)) {
            allowedToken[initialToken] = true;
            emit AllowedTokenSet(initialToken, true);
        }
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "ZERO_ADDRESS");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function setAllowedToken(address token, bool allowed) external onlyOwner {
        require(token != address(0), "ZERO_ADDRESS");
        allowedToken[token] = allowed;
        emit AllowedTokenSet(token, allowed);
    }

    function pay(
        bytes32 requestId,
        address token,
        address recipient,
        uint256 amount
    ) external {
        require(allowedToken[token], "TOKEN_NOT_ALLOWED");
        require(recipient != address(0), "ZERO_ADDRESS");
        require(amount > 0, "ZERO_AMOUNT");

        bool ok = IERC20(token).transferFrom(msg.sender, recipient, amount);
        require(ok, "TRANSFER_FAILED");

        emit PaymentRecorded(requestId, msg.sender, recipient, token, amount);
    }
}
