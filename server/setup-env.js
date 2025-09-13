#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up environment for Fahla Article Backend...\n');

const envContent = `# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password_here
DB_DATABASE=fahla_article_db

# Server Configuration
PORT=5000

# JWT Configuration (for authentication)
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Environment
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Skipping creation.');
} else {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please update the .env file with your actual database credentials.');
}

console.log('\n📋 Next steps:');
console.log('1. Update the .env file with your MySQL credentials');
console.log('2. Make sure MySQL is running');
console.log('3. Create the database: CREATE DATABASE fahla_article_db;');
console.log('4. Run: npm run start:dev'); 