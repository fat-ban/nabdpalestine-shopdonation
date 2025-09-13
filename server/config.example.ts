// Configuration example for the Fahla Article Backend
// Copy this file to .env in the root directory and update the values

export const config = {
  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'your_password_here',
    database: process.env.DB_DATABASE || 'fahla_article_db',
  },
  
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
  },
  
  // JWT Configuration (for future authentication)
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  // Environment
  environment: process.env.NODE_ENV || 'development',
};

// Required environment variables:
// DB_HOST=localhost
// DB_PORT=3306
// DB_USERNAME=root
// DB_PASSWORD=your_password_here
// DB_DATABASE=fahla_article_db
// PORT=5000
// JWT_SECRET=your_jwt_secret_key_here
// JWT_EXPIRES_IN=24h
// NODE_ENV=development 