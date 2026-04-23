"use client";

import { FormEvent, useState } from "react";

type Props = {
  disabled?: boolean;
  onSubmit: (address: string) => Promise<void>;
};

export function GiveRightForm({ disabled, onSubmit }: Props) {
  const [address, setAddress] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(address);
    setAddress("");
  };

  return (
    <form className="glass-card form-card" onSubmit={handleSubmit}>
      <p className="eyebrow">Chairperson action</p>
      <h3>Выдать право голоса</h3>
      <input
        className="text-input"
        placeholder="0x..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        disabled={disabled}
      />
      <button className="primary-btn" type="submit" disabled={disabled || !address}>
        Выдать право
      </button>
    </form>
  );
}
