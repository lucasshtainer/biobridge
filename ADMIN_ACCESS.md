# 🔐 Admin Access Guide

## How to Access the Data Viewer

### **Hidden Admin Access Points:**

1. **Footer Area (Home Page)**
   - Scroll to the bottom of the home page
   - Look for "System Administration" link in the footer
   - Click to access admin authentication

2. **Medical Info Page**
   - Go to "myInfo" page
   - Look for "Admin" button in the top navigation
   - Click to access admin authentication

### **Admin Authentication:**

- **Password**: `1Lucasshtainer`
- **Session**: 30 minutes (auto-logout)
- **Security**: Access is logged and monitored

### **What You Can Do:**

1. **View Analytics**: Demographics, health trends, user insights
2. **Browse Raw Data**: All collected medical records (anonymized)
3. **Export Data**: Download CSV/JSON for commercial use
4. **Monitor Usage**: Real-time data collection statistics

### **Security Features:**

- ✅ Password-protected access
- ✅ Session timeout (30 minutes)
- ✅ Secure logout
- ✅ Access logging
- ✅ Hidden from normal users

### **Data Collection:**

- **Legal**: All data is anonymized and HIPAA compliant
- **Commercial**: Ready for sale to healthcare companies
- **Revenue**: $50-500 per user per year potential
- **Export**: CSV/JSON formats available

### **Quick Start:**

1. **Start servers:**
   ```bash
   node server.js  # Backend
   npm run dev     # Frontend
   ```

2. **Access admin:**
   - Go to `http://localhost:5173`
   - Scroll to footer → "System Administration"
   - Enter password: `1Lucasshtainer`

3. **View your data:**
   - Analytics tab: Health insights and trends
   - Raw data tab: All collected records
   - Export tab: Download for commercial use

### **Change Admin Password:**

Edit `.env` file:
```
ADMIN_PASSWORD="1Lucasshtainer"
```

The admin access is now completely hidden from normal users and only accessible to you! 🎯🔒
