import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import {ScheduleModule} from "@nestjs/schedule";
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import {EventEmitterModule} from "@nestjs/event-emitter";
import {AuthModule} from "./Modules/auth.module";
import {MarketplaceModule} from "./Modules/marketplace.module";
import {MyListsModule} from "./Modules/myLists.module";
import {InvoiceModule} from "./Modules/invoice.module";
import {CdnModule} from "./Modules/cdn.module";
import {RequestsModule} from "./Modules/requests.module";
import * as process from "process";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
      TypeOrmModule.forRoot({
    type: 'postgres',
    host: "localhost",
    port: 5432,
    username: "iewa-test",
    password: "iewa-test" ,
    database: "iewa-test",
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    
      
  }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    CacheModule.register({
      ttl: 10, 
      isGlobal: true,
    }),
      AuthModule,
      MarketplaceModule,
      MyListsModule,
    InvoiceModule,
    CdnModule,
      RequestsModule,
    ],

})
export class AppModule {}
