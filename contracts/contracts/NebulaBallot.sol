// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract NebulaBallot {
    struct Voter {
        uint256 weight;
        bool voted;
        address delegate;
        uint256 vote;
    }

    struct Proposal {
        string name;
        uint256 voteCount;
    }

    address public immutable chairperson;
    mapping(address => Voter) public voters;
    Proposal[] private proposals;

    event RightGranted(address indexed voter, uint256 weight);
    event VoteDelegated(address indexed from, address indexed to);
    event Voted(address indexed voter, uint256 indexed proposal, uint256 weight);

    error OnlyChairperson();
    error AlreadyVoted();
    error AlreadyHasRight();
    error InvalidVoter();
    error SelfDelegation();
    error DelegationLoop();
    error NoVotingRight();
    error InvalidProposal();

    modifier onlyChairperson() {
        if (msg.sender != chairperson) revert OnlyChairperson();
        _;
    }

    constructor(string[] memory proposalNames) {
        require(proposalNames.length > 0, "At least one proposal required");

        chairperson = msg.sender;
        voters[msg.sender].weight = 1;

        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function giveRightToVote(address voter) external onlyChairperson {
        if (voter == address(0)) revert InvalidVoter();
        if (voters[voter].voted) revert AlreadyVoted();
        if (voters[voter].weight != 0) revert AlreadyHasRight();

        voters[voter].weight = 1;
        emit RightGranted(voter, 1);
    }

    function delegate(address to) external {
        Voter storage sender = voters[msg.sender];
        if (sender.weight == 0) revert NoVotingRight();
        if (sender.voted) revert AlreadyVoted();
        if (to == msg.sender) revert SelfDelegation();

        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;
            if (to == msg.sender) revert DelegationLoop();
        }

        sender.voted = true;
        sender.delegate = to;

        Voter storage delegate_ = voters[to];
        if (delegate_.voted) {
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            delegate_.weight += sender.weight;
        }

        emit VoteDelegated(msg.sender, to);
    }

    function vote(uint256 proposal) external {
        Voter storage sender = voters[msg.sender];
        if (sender.weight == 0) revert NoVotingRight();
        if (sender.voted) revert AlreadyVoted();
        if (proposal >= proposals.length) revert InvalidProposal();

        sender.voted = true;
        sender.vote = proposal;
        proposals[proposal].voteCount += sender.weight;

        emit Voted(msg.sender, proposal, sender.weight);
    }

    function getProposals() external view returns (Proposal[] memory) {
        return proposals;
    }

    function getProposal(uint256 index) external view returns (string memory name, uint256 voteCount) {
        if (index >= proposals.length) revert InvalidProposal();
        Proposal memory proposal = proposals[index];
        return (proposal.name, proposal.voteCount);
    }

    function proposalsCount() external view returns (uint256) {
        return proposals.length;
    }

    function getVoter(address account)
        external
        view
        returns (uint256 weight, bool voted, address delegateAddr, uint256 votedProposal)
    {
        Voter memory voter = voters[account];
        return (voter.weight, voter.voted, voter.delegate, voter.vote);
    }

    function winnerProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for (uint256 p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (string memory winnerName_) {
        winnerName_ = proposals[winnerProposal()].name;
    }
}
