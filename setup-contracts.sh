#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/contracts"
echo "[1/3] Installing contract dependencies..."
npm install
echo "[2/3] Compiling contracts..."
npx hardhat compile
echo "[3/3] Done."
echo "Now fill contracts/.env and run: npx hardhat run scripts/deploy.ts --network bscTestnet"
