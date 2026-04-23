"use client";

import { FormEvent, useState } from "react";

type Props = {
  disabled?: boolean;
  onSubmit: (address: string) => Promise<void>;
};

export function DelegateForm({ disabled, onSubmit }: Props) {
  const [address, setAddress] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(address);
    setAddress("");
  };

  return (
    <form className="glass-card form-card" onSubmit={handleSubmit}>
      <p className="eyebrow">Delegation flow</p>
      <h3>Делегировать голос</h3>
      <input
        className="text-input"
        placeholder="Адрес получателя делегирования"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        disabled={disabled}
      />
      <button className="secondary-btn" type="submit" disabled={disabled || !address}>
        Делегировать
      </button>
    </form>
  );
}
