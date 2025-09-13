import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvValidationService {
  static validateEnvironment() {
    const requiredEnvVars = [
      'DB_HOST',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_DATABASE',
    ];
    const optionalEnvVars = [
      'PORT',
      'JWT_SECRET',
      'JWT_EXPIRES_IN',
      'NODE_ENV',
    ];

    // Check required variables
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}. ` +
        'Please check your .env file and ensure all required variables are set.'
      );
    }

    // Production safety: require JWT_SECRET in production
    const nodeEnv = process.env.NODE_ENV || 'development';
    if (nodeEnv === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'default_secret_change_in_production')) {
      throw new Error('JWT_SECRET is required and must be set to a strong value in production.');
    }

    // Validate database port
    const dbPort = parseInt(process.env.DB_PORT || '3306', 10);
    if (isNaN(dbPort) || dbPort < 1 || dbPort > 65535) {
      throw new Error('DB_PORT must be a valid port number between 1 and 65535');
    }

    // Validate server port
    const serverPort = parseInt(process.env.PORT || '5000', 10);
    if (isNaN(serverPort) || serverPort < 1 || serverPort > 65535) {
      throw new Error('PORT must be a valid port number between 1 and 65535');
    }

    // Warn about missing optional variables
    const missingOptional = optionalEnvVars.filter(varName => !process.env[varName]);
    if (missingOptional.length > 0) {
      console.warn(
        `Warning: Missing optional environment variables: ${missingOptional.join(', ')}. Using defaults where applicable.`
      );
    }

    return {
      database: {
        host: process.env.DB_HOST,
        port: dbPort,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      },
      server: {
        port: serverPort,
      },
      jwt: {
        secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      },
      environment: nodeEnv,
    };
  }
} 