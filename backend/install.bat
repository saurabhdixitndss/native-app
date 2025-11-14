@echo off
echo ========================================
echo Crypto Miner Backend - Installation
echo ========================================
echo.

echo [1/3] Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Checking environment file...
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
) else (
    echo .env file already exists
)

echo.
echo [3/3] Installation complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Make sure MongoDB is running
echo 2. Update .env if needed
echo 3. Run: npm run dev
echo.
echo For detailed instructions, see QUICK_START.md
echo ========================================
pause
