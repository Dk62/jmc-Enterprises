@echo off
REM Payment Gateway Setup Script for Windows

echo.
echo ========================================
echo JMC Enterprises - Payment Gateway Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo [OK] Node.js is installed: 
node --version
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install razorpay stripe
echo [OK] Backend dependencies installed
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd ..\frontend
call npm install @stripe/react-stripe-js @stripe/js razorpay
echo [OK] Frontend dependencies installed
echo.

echo.
echo ========================================
echo Configuration Steps:
echo ========================================
echo.
echo 1. Get Razorpay API Keys:
echo    - Go to https://dashboard.razorpay.com
echo    - Navigate to Settings ^> API Keys
echo    - Copy Key ID and Key Secret
echo.
echo 2. Get Stripe API Keys:
echo    - Go to https://dashboard.stripe.com
echo    - Navigate to Developers ^> API Keys
echo    - Copy Publishable Key and Secret Key
echo.
echo 3. Update .env files:
echo    - backend\.env (from .env.example)
echo    - frontend\.env (from .env.example)
echo.
echo [OK] Setup complete! Ready to integrate payments.
echo.
echo Next steps:
echo 1. Update environment variables with API keys
echo 2. Start backend: npm run dev
echo 3. Start frontend: npm run dev
echo 4. Visit http://localhost:5174 and test checkout
echo.
echo For detailed setup, see: PAYMENT_INTEGRATION_GUIDE.md
echo.
pause
