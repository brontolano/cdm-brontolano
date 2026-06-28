import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/consumer_data_manager',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
    konsumenSecret: process.env.JWT_KONSUMEN_SECRET || 'dev_konsumen_secret',
    konsumenExpires: process.env.JWT_KONSUMEN_EXPIRES || '30d',
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
