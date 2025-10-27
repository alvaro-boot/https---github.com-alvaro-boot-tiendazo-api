import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => {
  const configService = new ConfigService();
  return {
    type: 'mysql',
    host: configService.get('DB_HOST') || 'localhost',
    port: +configService.get('DB_PORT') || 3306,
    username: configService.get('DB_USER') || 'root',
    password: configService.get('DB_PASS') || 'sqbwHgwkZcIthkLRLsJxJqZkfIysJMkv',
    database: configService.get('DB_NAME') || 'tiendazo_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get('NODE_ENV') === 'development',
    logging: configService.get('NODE_ENV') === 'development',
    autoLoadEntities: true,
  };
};
