import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const raw = process.env.PROPOSALS || "Bitcoin,Ethereum,BNB,Solana";
  const proposalNames = raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (proposalNames.length === 0) {
    throw new Error("PROPOSALS cannot be empty");
  }

  const factory = await ethers.getContractFactory("NebulaBallot");
  const contract = await factory.deploy(proposalNames);
  await contract.waitForDeployment();

  console.log("NebulaBallot deployed to:", await contract.getAddress());
  console.log("Proposals:", proposalNames);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
