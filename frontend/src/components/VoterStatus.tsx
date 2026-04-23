"use client";

import { VoterSnapshot } from "@/lib/contract";

type Props = {
  voter: VoterSnapshot | null;
  chairperson: string;
  isChairperson: boolean;
};

export function VoterStatus({ voter, chairperson, isChairperson }: Props) {
  return (
    <section className="glass-card">
      <p className="eyebrow">On-chain profile</p>
      <h3>Статус из смарт-контракта</h3>

      <div className="status-grid">
        <div className="metric">
          <span>Chairperson</span>
          <strong>{chairperson ? `${chairperson.slice(0, 6)}...${chairperson.slice(-4)}` : "—"}</strong>
        </div>
        <div className="metric">
          <span>Роль</span>
          <strong>{isChairperson ? "Администратор голосования" : "Участник"}</strong>
        </div>
        <div className="metric">
          <span>Вес</span>
          <strong>{voter ? voter.weight.toString() : "0"}</strong>
        </div>
        <div className="metric">
          <span>Голосовал</span>
          <strong>{voter?.voted ? "Да" : "Нет"}</strong>
        </div>
        <div className="metric">
          <span>Делегат</span>
          <strong>
            {voter?.delegateAddr && voter.delegateAddr !== "0x0000000000000000000000000000000000000000"
              ? `${voter.delegateAddr.slice(0, 6)}...${voter.delegateAddr.slice(-4)}`
              : "—"}
          </strong>
        </div>
        <div className="metric">
          <span>Индекс выбора</span>
          <strong>{voter ? voter.votedProposal.toString() : "—"}</strong>
        </div>
      </div>
    </section>
  );
}
