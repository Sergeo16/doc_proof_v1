// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
 * @title DocProof
 * @dev Blockchain document certification - stores document hashes immutably
 * @notice Upgradeable contract for DOC PROOF platform
 */
contract DocProof is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    struct DocumentCertification {
        bytes32 documentHash;
        address issuer;
        uint256 timestamp;
        bool revoked;
        string metadata;
    }

    mapping(bytes32 => DocumentCertification) public certifications;
    mapping(bytes32 => bool) private _registeredHashes;
    bytes32[] private _allHashes;

    event DocumentCertified(
        bytes32 indexed documentHash,
        address indexed issuer,
        uint256 timestamp,
        string metadata
    );

    event DocumentRevoked(
        bytes32 indexed documentHash,
        address indexed revoker,
        uint256 timestamp,
        string reason
    );

    event ContractUpgraded(address indexed newImplementation);

    error HashAlreadyRegistered(bytes32 documentHash);
    error HashNotRegistered(bytes32 documentHash);
    error OnlyIssuerCanRevoke(address caller, address issuer);
    error DocumentAlreadyRevoked(bytes32 documentHash);
    error InvalidHash();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
    }

    /**
     * @dev Register a document hash on the blockchain
     * @param documentHash SHA-256 hash of the document
     * @param metadata Optional metadata (IPFS CID, etc.)
     */
    function certifyDocument(bytes32 documentHash, string calldata metadata) external {
        if (documentHash == bytes32(0)) revert InvalidHash();
        if (_registeredHashes[documentHash]) revert HashAlreadyRegistered(documentHash);

        certifications[documentHash] = DocumentCertification({
            documentHash: documentHash,
            issuer: msg.sender,
            timestamp: block.timestamp,
            revoked: false,
            metadata: metadata
        });

        _registeredHashes[documentHash] = true;
        _allHashes.push(documentHash);

        emit DocumentCertified(documentHash, msg.sender, block.timestamp, metadata);
    }

    /**
     * @dev Verify if a document hash is certified and valid
     * @param documentHash The hash to verify
     * @return isValid True if certified and not revoked
     */
    function verifyDocument(bytes32 documentHash) external view returns (bool isValid) {
        if (!_registeredHashes[documentHash]) return false;
        DocumentCertification memory cert = certifications[documentHash];
        return !cert.revoked;
    }

    /**
     * @dev Get full certification details
     */
    function getCertification(bytes32 documentHash)
        external
        view
        returns (DocumentCertification memory)
    {
        if (!_registeredHashes[documentHash]) revert HashNotRegistered(documentHash);
        return certifications[documentHash];
    }

    /**
     * @dev Revoke a document certification - only issuer can revoke
     */
    function revokeDocument(bytes32 documentHash, string calldata reason) external {
        if (!_registeredHashes[documentHash]) revert HashNotRegistered(documentHash);

        DocumentCertification storage cert = certifications[documentHash];
        if (cert.issuer != msg.sender) revert OnlyIssuerCanRevoke(msg.sender, cert.issuer);
        if (cert.revoked) revert DocumentAlreadyRevoked(documentHash);

        cert.revoked = true;

        emit DocumentRevoked(documentHash, msg.sender, block.timestamp, reason);
    }

    /**
     * @dev Check if hash is registered (for duplicate prevention)
     */
    function isHashRegistered(bytes32 documentHash) external view returns (bool) {
        return _registeredHashes[documentHash];
    }

    /**
     * @dev Get total number of certified documents
     */
    function getTotalCertifications() external view returns (uint256) {
        return _allHashes.length;
    }

    /**
     * @dev UUPS Upgrade authorization - only owner
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {
        emit ContractUpgraded(newImplementation);
    }
}
