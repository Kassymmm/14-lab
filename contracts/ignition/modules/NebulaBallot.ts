import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("NebulaBallotModule", (m) => {
  const names = m.getParameter("proposalNames", ["Solidity", "React", "Next.js", "Web3"]);
  const ballot = m.contract("NebulaBallot", [names]);
  return { ballot };
});
