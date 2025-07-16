import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/auth/entity/user.entity';
import { Transaction } from './src/transaction/entity/transaction.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  migrations: ['migrations/*.ts'],
  entities: [User, Transaction],
});