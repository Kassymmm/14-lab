import { BrowserProvider, Contract, JsonRpcSigner } from "ethers";

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

export const CONTRACT_ABI = [
  "function chairperson() view returns (address)",
  "function getProposals() view returns ((string name, uint256 voteCount)[])",
  "function getProposal(uint256 index) view returns (string name, uint256 voteCount)",
  "function proposalsCount() view returns (uint256)",
  "function getVoter(address account) view returns (uint256 weight, bool voted, address delegateAddr, uint256 votedProposal)",
  "function giveRightToVote(address voter)",
  "function delegate(address to)",
  "function vote(uint256 proposal)",
  "function winnerProposal() view returns (uint256)",
  "function winnerName() view returns (string)"
];

export type Proposal = {
  name: string;
  voteCount: bigint;
};

export type VoterSnapshot = {
  weight: bigint;
  voted: boolean;
  delegateAddr: string;
  votedProposal: bigint;
};

export const isContractConfigured = () => CONTRACT_ADDRESS.length > 0;

export const getBrowserProvider = () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask не найден");
  }

  return new BrowserProvider(window.ethereum);
};

export const getBallotContract = async (withSigner = false): Promise<Contract> => {
  if (!isContractConfigured()) {
    throw new Error("Не задан NEXT_PUBLIC_CONTRACT_ADDRESS");
  }

  const provider = getBrowserProvider();
  const signer: JsonRpcSigner = await provider.getSigner();
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, withSigner ? signer : provider);
};
