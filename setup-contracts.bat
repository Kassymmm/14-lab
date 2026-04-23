@echo off
cd /d "%~dp0contracts"
echo [1/3] Installing contract dependencies...
call npm install
if errorlevel 1 exit /b 1
echo [2/3] Compiling contracts...
call npx hardhat compile
if errorlevel 1 exit /b 1
echo [3/3] Done.
echo Now fill contracts\.env and run: npx hardhat run scripts/deploy.ts --network bscTestnet
