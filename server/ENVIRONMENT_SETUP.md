# Environment Setup Guide

This guide will help you set up the environment variables for the Fahla Article Backend application.

## Quick Setup

1. **Run the setup script:**
   ```bash
   npm run setup:env
   ```

2. **Update the `.env` file** with your actual database credentials.

3. **Start the application:**
   ```bash
   npm run start:dev
   ```

## Manual Setup

If you prefer to set up manually:

1. **Create a `.env` file** in the root directory with the following content:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_DATABASE=palestine_donationshop

# Server Configuration
PORT=5000

# JWT Configuration (for authentication)
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Environment
NODE_ENV=development
```

## Required Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | MySQL database host | - | ✅ |
| `DB_PORT` | MySQL database port | 3306 | ❌ |
| `DB_USERNAME` | MySQL username | - | ✅ |
| `DB_PASSWORD` | MySQL password | - | ✅ |
| `DB_DATABASE` | MySQL database name | - | ✅ |
| `PORT` | Application port | 5000 | ❌ |
| `JWT_SECRET` | JWT secret key | default_secret | ❌ |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h | ❌ |
| `NODE_ENV` | Environment mode | development | ❌ |

## Database Setup

1. **Install MySQL** if you haven't already.

2. **Create the database:**
   ```sql
   CREATE DATABASE fahla_article_db;
   ```

3. **Create a user** (optional but recommended):
   ```sql
   CREATE USER 'fahla_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON fahla_article_db.* TO 'fahla_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

## Troubleshooting

### Common Issues

1. **"Missing required environment variables"**
   - Make sure your `.env` file exists in the root directory
   - Check that all required variables are set

2. **"Connection refused"**
   - Ensure MySQL is running
   - Verify the database credentials
   - Check if the database exists

3. **"Access denied"**
   - Verify the MySQL username and password
   - Ensure the user has proper permissions

### Validation

The application includes environment validation that will:
- Check for required variables
- Validate port numbers
- Provide helpful error messages

## Security Notes

- **Never commit your `.env` file** to version control
- **Use strong passwords** for your database
- **Change the JWT secret** in production
- **Use environment-specific configurations** for different environments

## Production Setup

For production deployment:

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Configure proper database credentials
4. Set up proper CORS origins
5. Use environment-specific database configurations 