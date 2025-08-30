# Railway Deployment Checklist

## Pre-Deployment Checklist

### 1. Environment Variables Setup in Railway Dashboard
Set these environment variables in your Railway project:

```
DJANGO_SECRET_KEY=generate-a-very-secure-secret-key-here
DJANGO_DEBUG=False
ALLOWED_HOSTS=your-app.railway.app
```

**Optional (add when frontend is deployed):**
```
FRONTEND_URLS=https://your-frontend-domain.com
```

### 2. Database Setup
- ✅ Railway MySQL service should be connected
- ✅ Railway automatically provides MySQL environment variables
- ✅ Database connection timeout and pooling configured

### 3. Security Configuration
- ✅ DEBUG=False in production
- ✅ Secure secret key configured
- ✅ HTTPS redirect enabled for production
- ✅ Security headers configured
- ✅ CORS properly configured

### 4. Static Files
- ✅ WhiteNoise configured for static file serving
- ✅ STATIC_ROOT properly set
- ✅ Collectstatic runs during deployment

### 5. Performance Optimization
- ✅ Gunicorn with gevent workers configured
- ✅ Database connection pooling enabled
- ✅ Proper worker configuration for Railway

## Post-Deployment Verification

1. **Health Check**: Visit `https://your-app.railway.app/health/`
2. **API Root**: Visit `https://your-app.railway.app/`
3. **Admin Panel**: Visit `https://your-app.railway.app/admin/` (create superuser first)
4. **Database**: Verify migrations ran successfully
5. **CORS**: Test frontend can communicate with API

## Commands to Run After Deployment

```bash
# Create superuser (run in Railway console)
python manage.py createsuperuser

# Check deployment status
python manage.py check --deploy

# Verify database connection
python manage.py dbshell
```

## Troubleshooting

### Common Issues:
1. **500 Error**: Check Railway logs for detailed error messages
2. **Database Connection**: Verify MySQL service is connected and environment variables are set
3. **Static Files**: Ensure collectstatic completed successfully
4. **CORS Issues**: Update FRONTEND_URLS environment variable with your frontend domain

### Log Monitoring:
- Railway provides real-time logs in the dashboard
- Application logs are configured to show detailed information
- Database connection issues will be logged with WARNING level

## Scaling Recommendations

For production workloads:
- Monitor memory usage and scale vertically if needed
- Consider adding Redis for session storage and caching
- Monitor database performance and consider connection pooling adjustments
- Set up monitoring and alerting for your application

## Security Notes

- Never commit `.env` files or expose secret keys
- Regularly rotate your Django secret key
- Monitor for security updates in dependencies
- Consider setting up automated security scanning
