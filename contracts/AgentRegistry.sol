// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentRegistry {
    address public owner;
    mapping(address => bool) public isUpdater;

    struct AgentProfile {
        address owner;
        string name;
        string serviceType;
        string metadataURI;
        uint256 reputationScore;
        uint256 totalTxCount;
        uint256 totalEarned;
        bool isActive;
        uint256 registeredAt;
    }

    mapping(address => AgentProfile) public agents;
    address[] public agentList;
    mapping(string => address[]) private agentsByType;

    event AgentRegistered(address indexed agentAddress, string name, string serviceType);
    event ReputationUpdated(address indexed agentAddress, uint256 newScore, uint256 txCount);
    event AgentDeactivated(address indexed agentAddress);
    event UpdaterSet(address indexed updater, bool allowed);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }

    modifier onlyUpdater() {
        require(isUpdater[msg.sender], "ONLY_UPDATER");
        _;
    }

    modifier onlyRegistered() {
        require(agents[msg.sender].isActive, "Not registered or inactive");
        _;
    }

    constructor() {
        owner = msg.sender;
        isUpdater[msg.sender] = true;
        emit OwnershipTransferred(address(0), msg.sender);
        emit UpdaterSet(msg.sender, true);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "ZERO_ADDRESS");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function setUpdater(address updater, bool allowed) external onlyOwner {
        require(updater != address(0), "ZERO_ADDRESS");
        isUpdater[updater] = allowed;
        emit UpdaterSet(updater, allowed);
    }

    function registerAgent(
        string calldata name,
        string calldata serviceType,
        string calldata metadataURI
    ) external {
        _registerAgent(msg.sender, name, serviceType, metadataURI);
    }

    /// @notice Admin registration for external agent addresses (useful for seeding).
    function registerAgentFor(
        address agentAddress,
        string calldata name,
        string calldata serviceType,
        string calldata metadataURI
    ) external onlyOwner {
        _registerAgent(agentAddress, name, serviceType, metadataURI);
    }

    function _registerAgent(
        address agentAddress,
        string calldata name,
        string calldata serviceType,
        string calldata metadataURI
    ) internal {
        require(agentAddress != address(0), "ZERO_ADDRESS");
        require(bytes(agents[agentAddress].name).length == 0, "Already registered");
        require(bytes(name).length > 0, "Name required");
        require(bytes(serviceType).length > 0, "Service type required");

        agents[agentAddress] = AgentProfile({
            owner: agentAddress,
            name: name,
            serviceType: serviceType,
            metadataURI: metadataURI,
            reputationScore: 0,
            totalTxCount: 0,
            totalEarned: 0,
            isActive: true,
            registeredAt: block.timestamp
        });

        agentList.push(agentAddress);
        agentsByType[serviceType].push(agentAddress);

        emit AgentRegistered(agentAddress, name, serviceType);
    }

    function recordSuccessfulTx(
        address agentAddress,
        uint256 amountUSDC
    ) external onlyUpdater {
        AgentProfile storage agent = agents[agentAddress];
        require(agent.isActive, "Agent not active");

        agent.totalTxCount += 1;
        agent.totalEarned += amountUSDC;

        uint256 delta;
        uint256 txCount = agent.totalTxCount;

        if (txCount == 1) {
            delta = 20;
        } else if (txCount <= 10) {
            delta = 5;
        } else if (txCount <= 50) {
            delta = 2;
        } else {
            delta = 1;
        }

        if (amountUSDC > 100000) {
            delta += 1;
        }

        uint256 newScore = agent.reputationScore + delta;
        if (newScore > 1000) {
            newScore = 1000;
        }
        agent.reputationScore = newScore;

        emit ReputationUpdated(agentAddress, newScore, agent.totalTxCount);
    }

    function getAgent(
        address agentAddress
    ) external view returns (AgentProfile memory) {
        return agents[agentAddress];
    }

    function getReputationScore(
        address agentAddress
    ) external view returns (uint256) {
        return agents[agentAddress].reputationScore;
    }

    function getTopAgents(
        string calldata serviceType,
        uint256 limit
    ) external view returns (address[] memory) {
        address[] storage all = agentsByType[serviceType];
        uint256 count = all.length < limit ? all.length : limit;

        address[] memory result = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = all[i];
        }
        return result;
    }

    function getAgentCount() external view returns (uint256) {
        return agentList.length;
    }

    function getAgentsByType(
        string calldata serviceType
    ) external view returns (address[] memory) {
        return agentsByType[serviceType];
    }

    function deactivateAgent() external onlyRegistered {
        agents[msg.sender].isActive = false;
        emit AgentDeactivated(msg.sender);
    }
}
