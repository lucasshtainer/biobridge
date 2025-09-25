# BioBridge Deployment Guide

## Render.com Deployment

### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub
- Connect your GitHub repository

### 2. Deploy Full-Stack Application
- **Service Type:** Web Service
- **Name:** `biobridge`
- **Environment:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `node server.js`
- **Plan:** Free

### 3. Environment Variables
Set these in Render dashboard:
```
NODE_ENV=production
PORT=10000
OPENAI_API_KEY=your_openai_api_key_here
ADMIN_PASSWORD=1234
```

### 6. Update Vite Config
Make sure `vite.config.ts` has:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
```

### 7. Update Server.js for Production
Add this to your server.js:
```javascript
// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}
```

## Important Notes

### Security
- ✅ API key is in environment variables
- ✅ User data is stored in JSON file (not in git)
- ✅ Admin password is configurable

### Database
- Currently using JSON file storage
- For production, consider PostgreSQL
- Add database connection in server.js

### Custom Domain
- Add custom domain in Render dashboard
- Update CORS settings for production

### Monitoring
- Check Render logs for errors
- Monitor API usage
- Set up health checks
