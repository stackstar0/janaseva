# Vercel Deployment Guide for Jana Seva

## Quick Deploy to Vercel

### 1. Prerequisites
- Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub repository (already done ✅)
- MongoDB Atlas account for cloud database

### 2. Environment Variables Setup

In your Vercel dashboard, add these environment variables:

```bash
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/janaseva?retryWrites=true&w=majority
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
SESSION_SECRET=your_strong_random_session_secret_here
```

### 3. Google OAuth Configuration

Update your Google OAuth settings:
- **Authorized JavaScript origins**: `https://your-app-name.vercel.app`
- **Authorized redirect URIs**: `https://your-app-name.vercel.app/auth/google/callback`

### 4. Deploy Steps

#### Option 1: Deploy from GitHub (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository: `stackstar0/janaseva`
4. Configure project settings:
   - **Build Command**: Leave empty (uses package.json)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`
5. Add environment variables (from step 2)
6. Click "Deploy"

#### Option 2: Deploy using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd /path/to/janaseva
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: janaseva
# - In which directory is your code located? ./
```

### 5. Post-Deployment Configuration

1. **Set Environment Variables** (if not done during deployment):
   ```bash
   vercel env add MONGO_URI
   vercel env add GOOGLE_CLIENT_ID
   vercel env add GOOGLE_CLIENT_SECRET
   vercel env add SESSION_SECRET
   ```

2. **Redeploy** after adding environment variables:
   ```bash
   vercel --prod
   ```

### 6. Troubleshooting Common Issues

#### 404 NOT_FOUND Error
- ✅ **Fixed**: Added proper `vercel.json` configuration
- ✅ **Fixed**: Updated package.json with correct start script
- ✅ **Fixed**: Added fallback routes in server.js

#### Static Files Not Loading
- ✅ **Fixed**: Configured proper static file serving
- ✅ **Fixed**: Added route handling in vercel.json

#### Environment Variables
- Ensure all variables are set in Vercel dashboard
- Use Vercel CLI to verify: `vercel env ls`

#### MongoDB Connection
- Use MongoDB Atlas (cloud) instead of local MongoDB
- Whitelist Vercel's IP addresses (or use 0.0.0.0/0 for simplicity)

### 7. Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Domains" tab
3. Add your custom domain
4. Update DNS records as instructed
5. Update Google OAuth settings with new domain

### 8. Monitoring and Logs

- **View logs**: `vercel logs your-deployment-url`
- **Monitor functions**: Vercel dashboard > Functions tab
- **Analytics**: Vercel dashboard > Analytics tab

## Files Added for Vercel Deployment

- ✅ `vercel.json` - Vercel configuration
- ✅ `.vercelignore` - Files to exclude from deployment
- ✅ Updated `package.json` - Proper scripts and engine version
- ✅ Updated `server.js` - Better route handling and fallbacks

## Environment Variables Required

```bash
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
```

## Success Indicators

✅ Deployment completes without errors
✅ App loads at vercel.app URL
✅ Static files (CSS, JS) load correctly
✅ Database connection works
✅ Google OAuth login functions
✅ File uploads work (if applicable)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Ensure MongoDB Atlas allows connections
4. Check Google OAuth configuration

---

**Happy Deploying! 🚀**