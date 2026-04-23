"use client";

import { Proposal } from "@/lib/contract";

type Props = {
  proposals: Proposal[];
  winnerIndex: number | null;
};

export function ProposalsList({ proposals, winnerIndex }: Props) {
  return (
    <section className="glass-card">
      <p className="eyebrow">Voting slate</p>
      <h3>Список предложений</h3>
      <div className="proposal-list">
        {proposals.length === 0 ? (
          <p className="muted">Пока нет данных. Сначала подключи кошелек и укажи адрес контракта.</p>
        ) : (
          proposals.map((proposal, index) => (
            <article
              key={`${proposal.name}-${index}`}
              className={`proposal-card ${winnerIndex === index ? "winner" : ""}`}
            >
              <div>
                <p className="proposal-index">#{index}</p>
                <h4>{proposal.name}</h4>
              </div>
              <div className="proposal-votes">{proposal.voteCount.toString()} голос(ов)</div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
