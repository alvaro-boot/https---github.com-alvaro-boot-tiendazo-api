import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => {
  const configService = new ConfigService();
  const nodeEnv = configService.get('NODE_ENV') || 'production';
  const isDevelopment = nodeEnv === 'development';
  
  // Asegurar que synchronize esté desactivado en producción
  const synchronize = isDevelopment && configService.get('ALLOW_SYNC') === 'true';
  
  return {
    type: 'mysql',
    host: configService.get('DB_HOST') || 'localhost',
    port: +configService.get('DB_PORT') || 3306,
    username: configService.get('DB_USER') || 'root',
    password: configService.get('DB_PASS') || 'sqbwHgwkZcIthkLRLsJxJqZkfIysJMkv',
    database: configService.get('DB_NAME') || 'tiendazo_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: synchronize, // Desactivado en producción por defecto
    logging: isDevelopment,
    autoLoadEntities: true,
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsRun: !isDevelopment, // Ejecutar migraciones en producción
  };
};
