import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as fs from 'fs';
import { WalletModule } from './wallet/wallet.module';
import { TokenModule } from './token/token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { Account } from './entities/Account';
import { ScheduleModule } from '@nestjs/schedule';
import { Token } from './entities/Token';
import { OutTransaction } from './entities/OutTransaction';
import { CronModule } from './cron/cron.module';
import { ClearingHouseModule } from './clearing-house/clearing-house.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('db.host'),
        ssl: {
          ca: fs.readFileSync('./rds-ca-2019-root.pem', 'utf8').toString(),
        },
        port: configService.get<number>('db.port', 3306),
        connectTimeout: 60 * 60 * 1000,
        username: configService.get<string>('db.username'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.database'),
        autoLoadEntities: true,
        entities: [Account, Token, OutTransaction],
        synchronize: false,
      }),
    }),
    WalletModule,
    TokenModule,
    CronModule,
    ClearingHouseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
