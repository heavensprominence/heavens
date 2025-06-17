# Heavenslive Database Setup Guide

## 🎯 Quick Setup (Recommended)

### Step 1: Get Your Database
1. **Visit [Neon.tech](https://neon.tech)** (Free PostgreSQL database)
2. **Create account** and new project
3. **Copy connection string** (starts with `postgresql://`)

### Step 2: Configure Environment
Add to your environment variables:
\`\`\`bash
DATABASE_URL=your_connection_string_here
\`\`\`

### Step 3: Run Setup Scripts
Execute these scripts in order:
1. `scripts/001-initial-schema.sql` - Core platform tables
2. `scripts/002-admin-actions.sql` - Admin functionality
3. `scripts/003-financial-assistance.sql` - Financial services
4. `scripts/004-marketplace.sql` - Marketplace system
5. `scripts/005-auction-system.sql` - Auction functionality
6. `scripts/006-order-management.sql` - Order processing

### Step 4: Verify Setup
- Visit `/admin` and check database status
- Green badges = successful setup
- Create your first admin account

## 🔧 Alternative Database Providers

### Supabase (PostgreSQL + Auth)
- Free tier available
- Built-in authentication
- Real-time features

### Railway (PostgreSQL)
- Simple deployment
- Automatic backups
- Good for development

### PlanetScale (MySQL - requires schema changes)
- Serverless MySQL
- Branching workflows
- Enterprise features

## 🛡️ Security Checklist

- [ ] Use strong database passwords
- [ ] Enable SSL connections
- [ ] Set up regular backups
- [ ] Configure connection pooling
- [ ] Monitor database performance

## 📊 Post-Setup Verification

After setup, you should see:
- ✅ Database connection successful
- ✅ All tables created
- ✅ Demo data populated
- ✅ Admin panel functional
- ✅ User registration working

## 🚀 Going Live

Once database is set up:
1. **Create admin account** via signup
2. **Configure system settings** in admin panel
3. **Set up payment processing** (CRED wallets)
4. **Enable user registration**
5. **Launch marketplace**

## 🆘 Troubleshooting

### Connection Issues
- Verify DATABASE_URL format
- Check firewall settings
- Confirm database is running

### Permission Errors
- Ensure database user has CREATE privileges
- Check schema permissions
- Verify table creation rights

### Performance Issues
- Add database indexes
- Configure connection pooling
- Monitor query performance

## 📞 Support

Need help? The platform includes:
- Built-in database status monitoring
- Automatic error detection
- Setup verification tools
- Health check endpoints
\`\`\`

Now let's create an enhanced database setup component:
