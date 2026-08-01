import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Inmueble } from '@entities/inmueble.entity';
import { TipoInmueble } from '@entities/tipo-inmueble.entity';
import { Usuario } from '@entities/usuario.entity';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Usuario, Inmueble, TipoInmueble],
  migrations: [__dirname + '/../db/migrations/*{.ts,.js}'],
  synchronize: false,
});

export default AppDataSource;
