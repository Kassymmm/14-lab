import { expect } from "chai";
import { ethers } from "hardhat";

describe("NebulaBallot", function () {
  it("allows the chairperson to grant rights and another voter to vote", async function () {
    const [owner, voter] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("NebulaBallot");
    const ballot = (await factory.deploy(["Alpha", "Beta"])) as any;
    await ballot.waitForDeployment();

    await ballot.giveRightToVote(voter.address);
    await ballot.connect(voter).vote(1);

    const result = await ballot.getProposal(1);
    expect(result[1]).to.equal(1n);
  });
});
