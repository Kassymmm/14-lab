"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { isAddress } from "ethers";
import {
  CONTRACT_ADDRESS,
  Proposal,
  VoterSnapshot,
  getBallotContract,
  isContractConfigured
} from "@/lib/contract";

export function useBallot(account?: string) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [winnerName, setWinnerName] = useState<string>("");
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [chairperson, setChairperson] = useState<string>("");
  const [voter, setVoter] = useState<VoterSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [txPending, setTxPending] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const loadData = useCallback(async () => {
    if (!isContractConfigured()) return;

    setIsLoading(true);
    clearMessages();

    try {
      const contract = await getBallotContract(false);
      const [loadedProposals, loadedWinnerName, loadedWinnerIndex, loadedChairperson] = await Promise.all([
        contract.getProposals(),
        contract.winnerName(),
        contract.winnerProposal(),
        contract.chairperson()
      ]);

      setProposals(loadedProposals);
      setWinnerName(loadedWinnerName);
      setWinnerIndex(Number(loadedWinnerIndex));
      setChairperson(loadedChairperson);

      if (account && isAddress(account)) {
        const voterSnapshot = await contract.getVoter(account);
        setVoter({
          weight: voterSnapshot[0],
          voted: voterSnapshot[1],
          delegateAddr: voterSnapshot[2],
          votedProposal: voterSnapshot[3]
        });
      } else {
        setVoter(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить данные контракта");
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  useEffect(() => {
    loadData().catch(() => undefined);
  }, [loadData]);

  const runTransaction = useCallback(async (runner: () => Promise<any>, successText: string) => {
    setTxPending(true);
    clearMessages();

    try {
      const tx = await runner();
      await tx.wait();
      setSuccess(successText);
      await loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Транзакция не выполнена";
      setError(message);
    } finally {
      setTxPending(false);
    }
  }, [loadData]);

  const giveRightToVote = useCallback(async (targetAddress: string) => {
    if (!isAddress(targetAddress)) throw new Error("Неверный адрес кошелька");
    const contract = await getBallotContract(true);
    await runTransaction(
      () => contract.giveRightToVote(targetAddress),
      `Право голоса выдано адресу ${targetAddress}`
    );
  }, [runTransaction]);

  const delegateVote = useCallback(async (targetAddress: string) => {
    if (!isAddress(targetAddress)) throw new Error("Неверный адрес кошелька");
    const contract = await getBallotContract(true);
    await runTransaction(
      () => contract.delegate(targetAddress),
      `Голос делегирован адресу ${targetAddress}`
    );
  }, [runTransaction]);

  const vote = useCallback(async (proposalIndex: number) => {
    const contract = await getBallotContract(true);
    await runTransaction(
      () => contract.vote(proposalIndex),
      `Голос успешно отправлен за вариант #${proposalIndex}`
    );
  }, [runTransaction]);

  const isChairperson = useMemo(() => {
    if (!account || !chairperson) return false;
    return account.toLowerCase() === chairperson.toLowerCase();
  }, [account, chairperson]);

  return {
    configured: CONTRACT_ADDRESS.length > 0,
    proposals,
    winnerName,
    winnerIndex,
    chairperson,
    voter,
    isChairperson,
    isLoading,
    txPending,
    error,
    success,
    loadData,
    giveRightToVote,
    delegateVote,
    vote
  };
}
