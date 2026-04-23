"use client";

import { FormEvent, useState } from "react";
import { Proposal } from "@/lib/contract";

type Props = {
  proposals: Proposal[];
  disabled?: boolean;
  onSubmit: (proposalIndex: number) => Promise<void>;
};

export function VoteForm({ proposals, disabled, onSubmit }: Props) {
  const [selected, setSelected] = useState(0);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(selected);
  };

  return (
    <form className="glass-card form-card" onSubmit={handleSubmit}>
      <p className="eyebrow">Vote execution</p>
      <h3>Проголосовать</h3>
      <select
        className="text-input"
        value={selected}
        onChange={(e) => setSelected(Number(e.target.value))}
        disabled={disabled || proposals.length === 0}
      >
        {proposals.map((proposal, index) => (
          <option key={`${proposal.name}-${index}`} value={index}>
            #{index} — {proposal.name}
          </option>
        ))}
      </select>
      <button className="primary-btn" type="submit" disabled={disabled || proposals.length === 0}>
        Отправить голос
      </button>
    </form>
  );
}
