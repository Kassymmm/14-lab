# 14-lab

Новый проект для лабораторной работы: Hardhat + Solidity + Next.js + React + ethers.

Внутри:
- `contracts/` — смарт-контракт, деплой и верификация
- `frontend/` — уникальный интерфейс **PulseLedger Governance**

## 1. Смарт-контракт

```bash
cd contracts
cp .env.example .env
npm install
npx hardhat compile
```

Заполни `contracts/.env` своими данными:

```env
PRIVATE_KEY=твой_новый_приватный_ключ
BSC_TESTNET_RPC_URL=https://bsc-testnet-dataseed.bnbchain.org
ETHERSCAN_API_KEY=твой_api_key
PROPOSALS=Solidity,React,Next.js,Web3
```

### Деплой

```bash
npx hardhat run scripts/deploy.ts --network bscTestnet
```

### Верификация

```bash
npx hardhat verify --network bscTestnet --constructor-args verify-args.js АДРЕС_КОНТРАКТА
```

## 2. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Заполни `frontend/.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xАдрес_твоего_задеплоенного_контракта
NEXT_PUBLIC_CHAIN_ID=97
```

## Важно

- Приватный ключ в архив не включен.
- `package-lock.json` для `contracts` удален, чтобы не тянуть чужой registry.
- Контракт можно спокойно компилировать и деплоить с другим MetaMask-кошельком.
