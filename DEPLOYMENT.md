# Deployment Guide for Vercel

## Overview
This guide covers deploying the Brainly application on Vercel. The frontend will be hosted on Vercel, while the backend needs to be deployed separately (recommended: Railway, Render, or Fly.io).

## Prerequisites
1. A GitHub account (or GitLab/Bitbucket)
2. A Vercel account (sign up at https://vercel.com)
3. A MongoDB Atlas account (or your MongoDB connection string)
4. Node.js installed locally

---

## Part 1: Backend Deployment (Railway - Recommended)

### Option A: Railway (Easiest)

1. **Sign up for Railway**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository
   - Select the `Brainly-Backend` folder/root

3. **Configure Environment Variables**
   - Go to your project → Variables tab
   - Add these variables:
     ```
     JWT_SECRET=your_super_secret_jwt_key_here
     MONGODBURL=your_mongodb_connection_string
     PORT=3000 (Railway will auto-assign this, but add for consistency)
     ```
   - Update `Brainly-Backend/src/config.ts` to use environment variables:
     ```typescript
     export const JWT_SECRET = process.env.JWT_SECRET || "Your_JWT_SECRET";
     export const MONGODBURL = process.env.MONGODBURL || "your_mongodb_url";
     ```

4. **Update Backend for Production**
   - Update `src/index.ts` to use environment variable for port:
     ```typescript
     const PORT = process.env.PORT || 3000;
     app.listen(PORT, () => {
       console.log(`Server is listening on PORT ${PORT}`);
     });
     ```

5. **Deploy**
   - Railway will automatically detect your Node.js app
   - It will run `npm install` and `npm start`
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. **Sign up for Render**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `Brainly-Backend` directory

3. **Configure Settings**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment: `Node`

4. **Add Environment Variables**
   - Same as Railway (JWT_SECRET, MONGODBURL, PORT)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Copy your backend URL

---

## Part 2: Frontend Deployment on Vercel

### Step 1: Prepare Frontend Code

1. **Update Environment Variables**
   - Your `config.ts` already uses `VITE_BACKEND_URL`
   - This will be set in Vercel dashboard

2. **Push Code to GitHub**
   ```bash
   cd Brainly-Frontend
   git init  # if not already a git repo
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Deploy to Vercel

#### Method A: Via Vercel Dashboard (Recommended for beginners)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the `Brainly-Frontend` folder (or configure Root Directory if needed)

3. **Configure Project Settings**
   - Framework Preset: **Vite**
   - Root Directory: `Brainly-Frontend` (if your repo contains both frontend and backend)
   - Build Command: `npm run build` (should auto-detect)
   - Output Directory: `dist` (should auto-detect)
   - Install Command: `npm install`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     Variable Name: VITE_BACKEND_URL
     Value: https://your-backend-url.railway.app (or your Render URL)
     ```
   - Select all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 1-2 minutes)
   - Your app will be live at `https://your-app.vercel.app`

#### Method B: Via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd Brainly-Frontend
   vercel
   ```
   - Follow the prompts
   - Set environment variables when asked:
     ```
     VITE_BACKEND_URL=https://your-backend-url.railway.app
     ```

4. **For Production Deployment**
   ```bash
   vercel --prod
   ```

---

## Part 3: Update Backend CORS Settings

Update your backend to allow requests from your Vercel domain:

1. **Update `Brainly-Backend/src/index.ts`**
   ```typescript
   import cors from "cors";
   
   const corsOptions = {
     origin: [
       "http://localhost:5173",
       "https://your-app.vercel.app",
       /\.vercel\.app$/, // Allow all Vercel preview deployments
     ],
     credentials: true,
   };
   
   app.use(cors(corsOptions));
   ```

2. **Redeploy your backend** after making this change

---

## Part 4: Test Your Deployment

1. **Frontend URL**: `https://your-app.vercel.app`
2. **Backend URL**: `https://your-backend.railway.app` (or Render)

### Test Checklist:
- [ ] Sign up works
- [ ] Sign in works
- [ ] Dashboard loads content
- [ ] Share Brain functionality works
- [ ] Shared links are accessible
- [ ] Add content works
- [ ] Delete content works

---

## Part 5: Custom Domain (Optional)

### For Frontend:
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### For Backend:
- Railway: Add custom domain in project settings
- Render: Add custom domain in service settings

---

## Troubleshooting

### Frontend Issues:
- **Build fails**: Check build logs in Vercel dashboard
- **Environment variables not working**: Ensure they start with `VITE_` and restart deployment
- **Routes not working**: Check `vercel.json` rewrites configuration

### Backend Issues:
- **CORS errors**: Update CORS settings to include your Vercel domain
- **Connection refused**: Check if backend is deployed and URL is correct
- **MongoDB connection failed**: Verify MONGODBURL environment variable

### Common Errors:
- **404 on routes**: Make sure `vercel.json` has the rewrite rules
- **API calls failing**: Check `VITE_BACKEND_URL` environment variable
- **Authentication not working**: Verify JWT_SECRET is set correctly

---

## Quick Reference

### Environment Variables Needed:

**Frontend (Vercel):**
- `VITE_BACKEND_URL` - Your backend URL

**Backend (Railway/Render):**
- `JWT_SECRET` - Secret key for JWT tokens
- `MONGODBURL` - MongoDB connection string
- `PORT` - Server port (usually auto-assigned)

### Important URLs:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.railway.app`

---

## Support

If you encounter issues:
1. Check deployment logs in Vercel/Railway dashboard
2. Verify all environment variables are set
3. Test backend API directly using Postman/curl
4. Check browser console for frontend errors
