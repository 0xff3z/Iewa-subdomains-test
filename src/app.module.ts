import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ScheduleModule} from "@nestjs/schedule";
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import {EventEmitterModule} from "@nestjs/event-emitter";
import {AuthModule} from "./Modules/auth.module";
import {MarketplaceModule} from "./Modules/marketplace.module";
import {InvoiceModule} from "./Modules/invoice.module";
import {CdnModule} from "./Modules/cdn.module";
import {RequestsModule} from "./Modules/requests.module";
import * as process from "process";
import {ConfigModule} from "@nestjs/config";
import {TraineeModule} from "./Modules/trainee.module";
import {CampModule} from "./Modules/camp.module";
import {ListsModule} from "./Modules/lists.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
      TypeOrmModule.forRoot({
    type: 'postgres',
    host: "db",
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
    InvoiceModule,
    CdnModule,
      RequestsModule,
    TraineeModule,
    CampModule,
      ListsModule
    ],

})
export class AppModule {}
