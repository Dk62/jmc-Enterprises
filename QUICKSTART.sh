#!/bin/bash
# Quick Start Script for MERN Stack - JMC Enterprises

echo "================================"
echo "JMC Enterprises - MERN Stack"
echo "================================"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Installing Backend Dependencies${NC}"
cd backend
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

echo ""
echo -e "${BLUE}Step 2: Installing Frontend Dependencies${NC}"
cd ../frontend
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

echo ""
echo -e "${BLUE}Step 3: Project Setup Complete!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Configure MongoDB"
echo "   - Option A: Local MongoDB (start mongod service)"
echo "   - Option B: MongoDB Atlas (get connection URI)"
echo ""
echo "2. Set up Environment Variables"
echo "   cd backend"
echo "   cp .env.example .env"
echo "   # Edit .env and add your MongoDB URI and JWT secret"
echo ""
echo "3. Start Development Servers"
echo "   # Terminal 1 - Backend"
echo "   cd backend && npm run dev"
echo ""
echo "   # Terminal 2 - Frontend"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
