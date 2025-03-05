import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { dbConfigForDataSource } from './config/db.config';
import { join } from 'path';
dotenv.config();

const isDocker = process.env.NODE_ENV === 'docker';

export const AppDataSource = new DataSource(dbConfigForDataSource());