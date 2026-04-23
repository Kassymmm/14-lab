"use client";

import { useMemo } from "react";
import { DelegateForm } from "@/components/DelegateForm";
import { GiveRightForm } from "@/components/GiveRightForm";
import { VoteForm } from "@/components/VoteForm";
import { useBallot } from "@/hooks/useBallot";
import { useWallet } from "@/hooks/useWallet";

export default function HomePage() {
  const { wallet, shortAddress, isLoading: walletLoading, error: walletError, connect } = useWallet();

  const {
    configured,
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
    giveRightToVote,
    delegateVote,
    vote
  } = useBallot(wallet.account);

  const actionDisabled = !wallet.isConnected || !configured || txPending;

  const networkLabel = useMemo(() => {
    if (!wallet.chainId) return "Unknown";
    if (Number(wallet.chainId) === 97) return "BNB Testnet";
    return `Chain ${wallet.chainId}`;
  }, [wallet.chainId]);

  return (
    <main className="pl-shell">
      <div className="pl-bg-grid" />
      <div className="pl-noise" />

      <div className="pl-wrap">
        <header className="pl-topbar">
          <div>
            <p className="pl-kicker">Private governance workspace</p>
            <h1>PulseLedger Control Hub</h1>
            <p className="pl-subtitle">
              Premium on-chain voting workspace with MetaMask access and proposal management.
            </p>
          </div>

          <div className="pl-topbar-right">
            <div className="pl-chip">
              <span>Network</span>
              <strong>{networkLabel}</strong>
            </div>
            <div className={`pl-chip ${configured ? "online" : "offline"}`}>
              <span>Contract</span>
              <strong>{configured ? "Online" : "Offline"}</strong>
            </div>
          </div>
        </header>

        <section className="pl-layout">
          <aside className="pl-panel pl-side">
            <div className="pl-panel-head">
              <span>Wallet node</span>
              <h2>Access</h2>
            </div>

            <div className="pl-stat-list">
              <div className="pl-stat">
                <span>Status</span>
                <strong>{wallet.isConnected ? "Connected" : "Disconnected"}</strong>
              </div>

              <div className="pl-stat">
                <span>Address</span>
                <strong>{shortAddress || "—"}</strong>
              </div>

              <div className="pl-stat">
                <span>Balance</span>
                <strong>{wallet.balance || "0"} BNB</strong>
              </div>

              <div className="pl-stat">
                <span>Chairperson</span>
                <strong>
                  {chairperson ? `${chairperson.slice(0, 6)}...${chairperson.slice(-4)}` : "—"}
                </strong>
              </div>
            </div>

            <button className="pl-connect-btn" onClick={connect} disabled={walletLoading}>
              {wallet.isConnected ? "Reconnect MetaMask" : "Connect MetaMask"}
            </button>

            <div className="pl-note-box">
              <span>Profile</span>
              <p>{isChairperson ? "Chairperson access confirmed." : "Participant access confirmed."}</p>
            </div>

            {walletError ? <p className="pl-error">{walletError}</p> : null}
          </aside>

          <section className="pl-panel pl-main">
            <div className="pl-panel-head">
              <span>Proposal stream</span>
              <h2>Voting board</h2>
            </div>

            <div className="pl-proposals">
              {proposals.length ? (
                proposals.map((proposal, index) => {
                  const votes =
                    typeof proposal.voteCount === "bigint"
                      ? proposal.voteCount.toString()
                      : String(proposal.voteCount ?? "0");

                  const isLeader = winnerIndex !== null && Number(winnerIndex) === index;

                  return (
                    <div key={index} className={`pl-proposal-row ${isLeader ? "leader" : ""}`}>
                      <div className="pl-proposal-index">#{index}</div>

                      <div className="pl-proposal-body">
                        <div className="pl-proposal-title-row">
                          <strong>{proposal.name}</strong>
                          {isLeader ? <em className="pl-badge">Current leader</em> : null}
                        </div>
                        <span>{isLeader ? "Leading proposal" : "Active option"}</span>
                      </div>

                      <div className="pl-proposal-votes">{votes} votes</div>
                    </div>
                  );
                })
              ) : (
                <div className="pl-empty-box">
                  <strong>No proposal data available</strong>
                  <p>Connect a deployed contract to view governance activity.</p>
                </div>
              )}
            </div>

            <div className="pl-winner-bar">
              <span>Winner snapshot</span>
              <strong>{winnerName || "No winner yet"}</strong>
            </div>
          </section>

          <aside className="pl-panel pl-actions">
            <div className="pl-panel-head">
              <span>Execution layer</span>
              <h2>Actions</h2>
            </div>

            <div className="pl-action-stack">
              {isChairperson ? (
                <div className="pl-block">
                  <h3>Grant voting right</h3>
                  <GiveRightForm disabled={actionDisabled} onSubmit={giveRightToVote} />
                </div>
              ) : (
                <div className="pl-block muted">
                  <h3>Grant voting right</h3>
                  <p>Only the deployer account can assign voting rights.</p>
                </div>
              )}

              <div className="pl-block">
                <h3>Delegate</h3>
                <DelegateForm disabled={actionDisabled} onSubmit={delegateVote} />
              </div>

              <div className="pl-block">
                <h3>Cast vote</h3>
                <VoteForm proposals={proposals} disabled={actionDisabled} onSubmit={vote} />
              </div>
            </div>
          </aside>
        </section>

        <section className="pl-terminal">
          <div className="pl-terminal-head">
            <span>System log</span>
          </div>

          <div className="pl-terminal-body">
            <div className="pl-log-row">
              <span>Role</span>
              <strong>{isChairperson ? "chairperson" : "participant"}</strong>
            </div>

            <div className="pl-log-row">
              <span>Weight</span>
              <strong>{voter ? String(voter.weight ?? 0) : "0"}</strong>
            </div>

            <div className="pl-log-row">
              <span>Voted</span>
              <strong>{voter?.voted ? "yes" : "no"}</strong>
            </div>

            <div className="pl-log-row">
              <span>Delegate</span>
              <strong>{(voter as any)?.delegate ?? "—"}</strong>
            </div>

            <div className="pl-log-row">
              <span>Pending</span>
              <strong>{txPending ? "transaction pending" : "idle"}</strong>
            </div>

            <div className="pl-log-row">
              <span>Status</span>
              <strong>{isLoading ? "syncing" : "ready"}</strong>
            </div>
          </div>

          {success ? <p className="pl-success">{success}</p> : null}
          {error ? <p className="pl-error">{error}</p> : null}
        </section>
      </div>
    </main>
  );
}