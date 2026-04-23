"use client";

type WalletPanelProps = {
  account: string;
  shortAddress: string;
  chainId: bigint | null;
  balance: string;
  isConnected: boolean;
  isMetaMaskInstalled: boolean;
  isLoading: boolean;
  error?: string;
  onConnect: () => void;
};

export function WalletPanel({
  account,
  shortAddress,
  chainId,
  balance,
  isConnected,
  isMetaMaskInstalled,
  isLoading,
  error,
  onConnect
}: WalletPanelProps) {
  return (
    <section className="glass-card wallet-panel">
      <div>
        <p className="eyebrow">Wallet access point</p>
        <h2>Подключение MetaMask</h2>
        <p className="muted">
          Подключи кошелек, чтобы выдать право голоса, делегировать голос или проголосовать.
        </p>
      </div>

      <div className="wallet-grid">
        <div className="metric">
          <span>Статус</span>
          <strong>{isConnected ? "Подключен" : "Не подключен"}</strong>
        </div>
        <div className="metric">
          <span>Адрес</span>
          <strong>{isConnected ? shortAddress : "—"}</strong>
        </div>
        <div className="metric">
          <span>Сеть</span>
          <strong>{chainId ? `Chain ID: ${chainId.toString()}` : "—"}</strong>
        </div>
        <div className="metric">
          <span>Баланс</span>
          <strong>{isConnected ? `${balance} BNB` : "—"}</strong>
        </div>
      </div>

      {!isMetaMaskInstalled ? (
        <p className="warning">MetaMask не найден. Установи расширение и обнови страницу.</p>
      ) : (
        <button className="primary-btn" onClick={onConnect} disabled={isLoading}>
          {isLoading ? "Подключение..." : isConnected ? "Переподключить" : "Подключить MetaMask"}
        </button>
      )}

      {account && <p className="tiny">Полный адрес: {account}</p>}
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
