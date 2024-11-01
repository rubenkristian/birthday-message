import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql', // or your database type
  host: 'localhost',
  port: 3306,
  username: 'ruben',
  password: 'ruben',
  database: 'messages',
  entities: ['dist/src/**/*.entity.js'], // Ensure this points to the compiled JS files
  migrations: ['dist/src/migrations/*.js'], // Ensure this points to the compiled JS files
  synchronize: false,
});
