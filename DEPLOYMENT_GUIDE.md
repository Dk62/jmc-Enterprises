# Production Deployment Guide

## Before Deployment

### 1. Security Checklist
- [ ] Change JWT_SECRET to a secure random string
- [ ] Update admin password immediately after first login
- [ ] Enable HTTPS/SSL on production domain
- [ ] Set NODE_ENV=production
- [ ] Configure environment-specific .env files
- [ ] Add rate limiting middleware
- [ ] Implement request validation
- [ ] Add helmet.js for security headers

### 2. Performance Optimization
- [ ] Enable database indexing in MongoDB
- [ ] Implement caching (Redis)
- [ ] Compress assets (gzip)
- [ ] Optimize images
- [ ] Minimize CSS/JS bundles
- [ ] Use CDN for static assets

### 3. Monitoring & Logging
- [ ] Set up error tracking (Sentry)
- [ ] Implement logging system
- [ ] Monitor API performance
- [ ] Set up uptime monitoring
- [ ] Configure email alerts

---

## Backend Deployment (Heroku Example)

### Step 1: Prepare Your Application

```bash
# Install Heroku CLI
# Windows: Download from https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create new Heroku app
heroku create jmc-api

# Set environment variables
heroku config:set \
  NODE_ENV=production \
  JWT_SECRET=your_very_secure_secret_key \
  MONGODB_URI=your_mongodb_atlas_uri \
  CORS_ORIGIN=https://your-frontend-domain.com
```

### Step 2: Create Procfile

Create `backend/Procfile`:
```
web: node src/index.js
```

### Step 3: Deploy to Heroku

```bash
cd backend

# Initialize git if not already done
git init

# Add Heroku remote
heroku git:remote -a jmc-api

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and cluster
3. Create database user
4. Get connection string
5. Update MONGODB_URI in Heroku config

---

## Frontend Deployment (Vercel Example)

### Step 1: Build Frontend

```bash
cd frontend
npm run build
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set production environment
vercel --prod
```

**Option B: Connect GitHub Repository**
1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables
6. Deploy

### Configure API Endpoint

Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend-domain.com
```

Update `frontend/src/services/api.js`:
```javascript
const API_BASE = process.env.VITE_API_URL || '/api';
```

---

## Alternative Hosting Options

### Backend Hosting

**AWS EC2:**
1. Launch EC2 instance (Node.js AMI)
2. SSH into instance
3. Clone repository
4. Install dependencies
5. Set up PM2 for process management
6. Configure nginx as reverse proxy
7. Set up SSL with Let's Encrypt

**Google Cloud Run:**
1. Containerize with Docker
2. Push to Container Registry
3. Deploy from Container Registry
4. Automatic scaling enabled

**DigitalOcean:**
1. Create Droplet (Node.js preset)
2. SSH and clone repo
3. Install dependencies
4. Use PM2 and Supervisor
5. Set up Caddy for HTTPS

### Frontend Hosting

**Netlify:**
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

**AWS S3 + CloudFront:**
1. Build frontend: `npm run build`
2. Upload `dist/` to S3
3. Set up CloudFront distribution
4. Integrate with Certificate Manager for SSL

**Firebase Hosting:**
1. Install Firebase CLI: `npm i -g firebase-tools`
2. Initialize Firebase
3. Deploy: `firebase deploy`

---

## Docker Deployment

### Backend Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "src/index.js"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: jmc_enterprises

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://mongodb:27017/jmc_enterprises
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGIN: http://localhost:3000
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

Deploy with:
```bash
docker-compose up -d
```

---

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install and build backend
        run: |
          cd backend
          npm install
          npm run test

      - name: Install and build frontend
        run: |
          cd frontend
          npm install
          npm run build

      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "jmc-api"
          heroku_email: ${{ secrets.HEROKU_EMAIL }}

      - name: Deploy to Vercel
        run: |
          npm i -g vercel
          vercel --token ${{ secrets.VERCEL_TOKEN }} --prod
```

---

## Database Backups

### MongoDB Atlas Automatic Backups
1. Already enabled by default
2. Retention: 35 days
3. Point-in-time restore available

### Manual Backup

```bash
# Export database
mongodump --uri "mongodb+srv://username:password@cluster.mongodb.net/jmc_enterprises" --out ./backup

# Import database
mongorestore --uri "mongodb+srv://username:password@cluster.mongodb.net/jmc_enterprises" ./backup
```

---

## SSL/HTTPS Setup

### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d your-domain.com

# Auto-renew (runs automatically)
sudo systemctl enable certbot.timer
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Performance Monitoring

### New Relic Integration

```bash
# Install New Relic APM
npm install newrelic

# Add to top of index.js
require('newrelic');
```

Configure `newrelic.js` with your license key.

### Datadog Integration

```bash
npm install dd-trace
```

Add to `index.js`:
```javascript
const tracer = require('dd-trace').init();
```

---

## Scaling Strategies

### Horizontal Scaling
- Load balancing (nginx, HAProxy)
- Multiple backend instances
- Database replication

### Vertical Scaling
- Increase server resources
- Database optimization
- Caching layer (Redis)

### Read Replicas
```javascript
// MongoDB connection string with read preference
mongodb://user:pass@primary.mongodb.net,secondary1,secondary2/db?replicaSet=atlas-xxxxx
```

---

## Post-Deployment Checklist

- [ ] Test all pages and features
- [ ] Verify database connectivity
- [ ] Test authentication flows
- [ ] Check payment integration
- [ ] Monitor server logs
- [ ] Set up uptime monitoring
- [ ] Configure email notifications
- [ ] Test error handling
- [ ] Verify analytics tracking
- [ ] Perform load testing
- [ ] Set up automated backups
- [ ] Document deployment process

---

## Rollback Plan

```bash
# Revert to previous deployment
heroku releases
heroku rollback v<number>

# Or redeploy previous commit
git revert <commit-hash>
git push heroku main
```

---

## Support & Resources

- Heroku Documentation: https://devcenter.heroku.com/
- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Node.js Best Practices: https://nodejs.org/en/docs/guides/
- React Production Build: https://react.dev/learn/deployment

Good luck with your production deployment!
