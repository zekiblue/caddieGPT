// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import { IOracle } from "./interfaces/IOracle.sol";
import "./CaddieGPT.sol";
import "./CaddieGPT.sol";

// @title ChatGpt
// @notice This contract handles chat interactions and integrates with teeML oracle for LLM and knowledge base queries.
contract CaddieGPT {
    address private owner;
    address public oracleAddress;

    // @notice CID of the knowledge base
    string public knowledgeBase;
    string public instruction;
    uint256 private proposalCount;

    struct CandidateProposal {
        address owner;
        uint256 id;
        string title;
        string body;
        string summarizedBody;
        string improvedTitle;
        string improvedBody;
        uint8 iteration;
        uint8 possibleOutcome;
        uint8 messagesCount;
    }

    struct MessageContent {
        string contentType;
        string value;
    }

    struct Message {
        string role;
        MessageContent content;
    }

    mapping(uint256 => CandidateProposal) public proposals;
    mapping(uint256 => mapping(uint256 => Message)) public messages;

    // @notice Event emitted when a new chat is created
    event ChatCreated(address indexed owner, uint256 indexed chatId);
    event ProposalSubmitted(uint256);
    event OracleAddressUpdated(address indexed newOracleAddress);
    event KnowledgeBaseUpdated(string newKnowledgeBase);
    event InstructionUpdated(string newInstruction);

    // @param initialOracleAddress Initial address of the oracle contract
    // @param knowledgeBaseCID CID of the initial knowledge base
    constructor(address initialOracleAddress, string memory knowledgeBaseCID, string memory instructionString) {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
        knowledgeBase = knowledgeBaseCID;
        instruction = instructionString;
    }

    // @notice Ensures the caller is the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner");
        _;
    }

    // @notice Ensures the caller is the oracle contract
    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Not oracle");
        _;
    }

    // @notice Sets a new oracle address
    // @param newOracleAddress The new oracle address
    function setOracleAddress(address newOracleAddress) public onlyOwner {
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    function setKnowledgeBase(string memory newKnowledgeBase) public onlyOwner {
        knowledgeBase = newKnowledgeBase;
        emit KnowledgeBaseUpdated(newKnowledgeBase);
    }

    function setInstruction(string memory newInstruction) public onlyOwner {
        instruction = newInstruction;
        emit InstructionUpdated(newInstruction);
    }

    // @notice Starts a new chat
    // @param message The initial message to start the chat with
    // @return The ID of the newly created chat
    function checkProposal(string memory proposalTitle, string memory proposalBody) public returns (uint256) {
        CandidateProposal memory _proposal = CandidateProposal({
            owner: msg.sender,
            id: proposalCount,
            title: proposalTitle,
            body: proposalBody,
            summarizedBody: "",
            improvedTitle: "",
            improvedBody: "",
            iteration: 0,
            possibleOutcome: 0,
            messagesCount: 0
        });
        uint256 currentProposalId = proposalCount;
        proposalCount++;
        proposals[currentProposalId] = _proposal;

        string memory message = concatenateProposal(proposalTitle, proposalBody);
        Message memory newMessage = createTextMessage("user", message);
        messages[currentProposalId][0] = newMessage;
        _proposal.messagesCount++;
        // If there is a knowledge base, create a knowledge base query
        if (bytes(knowledgeBase).length > 0) {
            IOracle(oracleAddress).createKnowledgeBaseQuery(currentProposalId, knowledgeBase, message, 3);
        } else {
            // Otherwise, create an LLM call
            IOracle(oracleAddress).createLlmCall(currentProposalId);
        }

        emit ProposalSubmitted(currentProposalId);
        return currentProposalId;
    }

    // @notice Handles the response from the oracle for an LLM call
    // @param runId The ID of the chat run
    // @param response The response from the oracle
    // @dev Called by teeML oracle
    function onOracleLlmResponse(
        uint256 runId,
        string memory response,
        string memory /*errorMessage*/
    )
        public
        onlyOracle
    {
        CandidateProposal storage proposal = proposals[runId];
        Message storage lastMessage = messages[runId][proposal.messagesCount - 1];
        require(
            keccak256(abi.encodePacked(lastMessage.role)) == keccak256(abi.encodePacked("user")),
            "No message to respond to"
        );

        Message memory newMessage = createTextMessage("assistant", response);
        messages[runId][proposal.messagesCount] = newMessage;
        proposal.messagesCount++;
    }

    // @notice Handles the response from the oracle for a knowledge base query
    // @param runId The ID of the chat run
    // @param documents The array of retrieved documents
    // @dev Called by teeML oracle
    function onOracleKnowledgeBaseQueryResponse(
        uint256 runId,
        string[] memory documents,
        string memory /*errorMessage*/
    )
        public
        onlyOracle
    {
        CandidateProposal storage proposal = proposals[runId];
        Message storage lastMessage = messages[runId][proposal.messagesCount - 1];
        require(
            keccak256(abi.encodePacked(lastMessage.role)) == keccak256(abi.encodePacked("user")),
            "No message to add context to"
        );

        // Start with the original message content
        string memory newContent = lastMessage.content.value;

        // Append "Relevant context:\n" only if there are documents
        if (documents.length > 0) {
            newContent = string(abi.encodePacked(newContent, "\n\nRelevant context:\n"));
        }

        // Iterate through the documents and append each to the newContent
        for (uint256 i = 0; i < documents.length; i++) {
            newContent = string(abi.encodePacked(newContent, documents[i], "\n"));
        }

        // Finally, set the lastMessage content to the newly constructed string
        lastMessage.content.value = newContent;

        // Call LLM
        IOracle(oracleAddress).createLlmCall(runId);
    }

    // @notice Creates a text message with the given role and content
    // @param role The role of the message
    // @param content The content of the message
    // @return The created message
    function createTextMessage(string memory role, string memory content) private pure returns (Message memory) {
        MessageContent memory newContent = MessageContent({ contentType: "text", value: content });
        Message memory newMessage = Message({ role: role, content: newContent });
        return newMessage;
    }

    function concatenateProposal(string memory _title, string memory _body) internal pure returns (string memory) {
        return string(abi.encodePacked("Title: ", _title, "\nBody: ", _body));
    }

    // @notice Retrieves the message history contents of a proposal
    // @param proposalID The ID of the proposal
    // @return An array of message contents
    // @dev Called by teeML oracle
    function getMessageHistoryContents(uint256 proposalId) public view returns (string[] memory) {
        uint256 messagesLength = proposals[proposalId].messagesCount;
        string[] memory previousMessages = new string[](messagesLength);
        for (uint256 i = 0; i < messagesLength; i++) {
            previousMessages[i] = messages[proposalId][i].content.value;
        }
        return previousMessages;
    }

    // @notice Retrieves the roles of the messages in a proposal
    // @param chatId The ID of the proposal
    // @return An array of message roles
    // @dev Called by teeML oracle
    function getMessageHistoryRoles(uint256 proposalId) public view returns (string[] memory) {
        uint256 messagesLength = proposals[proposalId].messagesCount;
        string[] memory roles = new string[](messagesLength);
        for (uint256 i = 0; i < messagesLength; i++) {
            roles[i] = messages[proposalId][i].role;
        }
        return roles;
    }
}
