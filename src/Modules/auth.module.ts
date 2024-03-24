import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Client } from '../Models/Client';
import {JwtStrategy} from "../Config/jwt.strategy";
import {AuthService} from "../Service/Auth/auth.service";
import {User} from "../Models/User.entity";
import {BusinessOwner} from "../Models/BusinessOwner";
import {BusinessOwnerAuthController} from "../Controller/Auth/BusinessOwnerAuth.controller";
import MondayEvents from "../Events/Monday.events";

@Module({
    imports: [
        TypeOrmModule.forFeature([Client,User,BusinessOwner]),
        JwtModule.register({
            global: true,
            secret: "iewa-test",
            signOptions: { expiresIn: '7d' },
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),


    ],
    controllers: [BusinessOwnerAuthController],
    providers: [AuthService,JwtStrategy],
})
export class AuthModule {}
