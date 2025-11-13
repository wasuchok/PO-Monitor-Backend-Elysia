import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_DATABASE!,
    process.env.DB_USERNAME!,
    process.env.DB_PASSWORD!,
    {
        host: process.env.DB_SERVER!,
        port: parseInt(process.env.DB_PORT!),
        dialect: 'mssql',
        dialectOptions: {
            options: { encrypt: true }
        }
    }
);