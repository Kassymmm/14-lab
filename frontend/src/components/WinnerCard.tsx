"use client";

type Props = {
  winnerName: string;
  winnerIndex: number | null;
};

export function WinnerCard({ winnerName, winnerIndex }: Props) {
  return (
    <section className="glass-card winner-card">
      <p className="eyebrow">Election pulse</p>
      <h3>Текущий победитель</h3>
      <div className="winner-core">
        <strong>{winnerName || "Пока нет лидера"}</strong>
        <span>{winnerIndex !== null ? `Индекс предложения: #${winnerIndex}` : "Ожидание данных"}</span>
      </div>
    </section>
  );
}
