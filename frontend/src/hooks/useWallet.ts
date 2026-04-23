"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserProvider, formatEther } from "ethers";

type WalletState = {
  account: string;
  chainId: bigint | null;
  balance: string;
  isConnected: boolean;
  isMetaMaskInstalled: boolean;
};

const initialState: WalletState = {
  account: "",
  chainId: null,
  balance: "0",
  isConnected: false,
  isMetaMaskInstalled: false
};

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const refreshWallet = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setWallet(initialState);
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_accounts", []);
    const network = await provider.getNetwork();

    if (accounts.length === 0) {
      setWallet({
        account: "",
        chainId: network.chainId,
        balance: "0",
        isConnected: false,
        isMetaMaskInstalled: true
      });
      return;
    }

    const balance = await provider.getBalance(accounts[0]);

    setWallet({
      account: accounts[0],
      chainId: network.chainId,
      balance: Number(formatEther(balance)).toFixed(4),
      isConnected: true,
      isMetaMaskInstalled: true
    });
  }, []);

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError("MetaMask не установлен");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      await refreshWallet();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось подключить кошелек");
    } finally {
      setIsLoading(false);
    }
  }, [refreshWallet]);

  useEffect(() => {
    refreshWallet().catch(() => undefined);

    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = () => refreshWallet().catch(() => undefined);
    const handleChainChanged = () => window.location.reload();

    window.ethereum.on?.("accountsChanged", handleAccountsChanged);
    window.ethereum.on?.("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [refreshWallet]);

  const shortAddress = useMemo(() => {
    if (!wallet.account) return "";
    return `${wallet.account.slice(0, 6)}...${wallet.account.slice(-4)}`;
  }, [wallet.account]);

  return {
    wallet,
    shortAddress,
    isLoading,
    error,
    connect,
    refreshWallet
  };
}
