@echo off
REM Quick Start Script for MERN Stack - JMC Enterprises (Windows)

echo ================================
echo JMC Enterprises - MERN Stack
echo ================================
echo.

echo Step 1: Installing Backend Dependencies
cd backend
call npm install
echo Backend dependencies installed!
echo.

echo Step 2: Installing Frontend Dependencies
cd ..\frontend
call npm install
echo Frontend dependencies installed!
echo.

echo Step 3: Project Setup Complete!
echo.
echo Next Steps:
echo 1. Configure MongoDB
echo    - Option A: Local MongoDB (start mongod service)
echo    - Option B: MongoDB Atlas (get connection URI)
echo.
echo 2. Set up Environment Variables
echo    cd backend
echo    copy .env.example .env
echo    REM Edit .env and add your MongoDB URI
echo.
echo 3. Start Development Servers
echo    Terminal 1 - Backend:  cd backend ^&^& npm run dev
echo    Terminal 2 - Frontend: cd frontend ^&^& npm run dev
echo.
echo 4. Open http://localhost:5173 in your browser
echo.
echo Happy coding! ^_^/
pause
