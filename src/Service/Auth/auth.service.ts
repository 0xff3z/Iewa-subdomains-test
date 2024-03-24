import {Injectable, UnauthorizedException, UsePipes, ValidationPipe} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MondayService } from 'src/Service/monday.service';
import { User } from '../../Models/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from 'src/DTO/register.dto';
import {Client} from "../../Models/Client";
import {BusinessOwner} from "../../Models/BusinessOwner";
import {EventEmitter2} from "@nestjs/event-emitter";
import {LoginDto} from "../../DTO/Login.dto";

@Injectable()

export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(BusinessOwner) private readonly businessOwnerRepository: Repository<BusinessOwner>,
        private readonly jwtService: JwtService,
        private eventEmitter: EventEmitter2
    ) { }



    // async register(body: any, res) {
    //     try {
    //         const client_exist = await this.clientRepository.findOne({ where: { email: body.email } });
    //         if (client_exist) {
    //             console.log(`Email already exist`);
    //             return res.status(400).send({ message: `Email already exist` });
    //         }
    //         const token = await this.jwtService.signAsync(body);
    //         const hash = await bcrypt.hash(body.password, 10);
    //
    //
    //
    //
    //
    //
    //
    //
    //         const monday = await this.mondayService.createItemForLogin(body.company, body.text, body.email, body.phone);
    //         console.log(monday)
    //         if (monday) {
    //             const client = this.clientRepository.create({
    //                 token: token,
    //                 name: body.text,
    //                 company_name: body.company,
    //                 phone: body.phone,
    //                 email: body.email,
    //                 mondayId: monday.toString(),
    //                 password: hash
    //             });
    //
    //
    //
    //             await this.clientRepository.save(client);
    //
    //
    //             return res.status(200).send({ token, monday });
    //         }
    //
    //
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).send({ error: "Internal Server Error" });
    //     }
    // }
    //
    //
    //
    // async login(body: any, res) {
    //     try {
    //         const client = await this.clientRepository.findOne({ where: { email: body.email } });
    //         console.log(client)
    //         if (!client) {
    //             console.log(`Email not found`);
    //             return res.status(400).send({ message: `Email not found` });
    //         }
    //         const isMatch = await bcrypt.compare(body.password, client.password);
    //         if (!isMatch) {
    //             console.log(`Password incorrect`);
    //             return res.status(400).send({ message: `Password incorrect` });
    //         }
    //         const token = await this.jwtService.signAsync({ sub: client.mondayId.toString() });
    //         client.token = token;
    //         await this.clientRepository.save(client);
    //         return res.send({
    //             token: token,
    //             name: client.name
    //         });
    //     }
    //     catch (error) {
    //         console.log(error);
    //         return res.status(500).send({ error: "Internal Server Error" });
    //     }
    // }
    //
    //
    // async findClient(token: string) {
    //     return await this.clientRepository.findOne({ where: { token } });
    // }



    async validateBusinessOwner(payload: any): Promise<User | UnauthorizedException> {
        const user = await this.businessOwnerRepository.findOne({ where: { id: payload.id } });
        if (user) {
            return user;
        }
        return new UnauthorizedException()
    }

    async registerBusinessOwner(registerDto: RegisterDto,res) {
        try {
            const businessOwner = await this.businessOwnerRepository.findOne({ where: { email: registerDto.email } });


            if (businessOwner) {
                return res.status(400).json({ message: 'Business Owner already exists' });
            }
            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            const newBusinessOwner = await this.businessOwnerRepository.create({
                fullName: registerDto.fullName,
                phoneNumber: registerDto.phoneNumber,
                password: hashedPassword,
                email: registerDto.email,
                company_name: registerDto.company,

            });








            const token = await this.jwtService.signAsync({ phoneNumber: registerDto.phoneNumber,role: 'businessOwner',id:newBusinessOwner.id });
            const refreshToken = await this.jwtService.signAsync({ phoneNumber: registerDto.phoneNumber,role: 'businessOwner',id:newBusinessOwner.id }, { expiresIn: '7d' });
            newBusinessOwner.refreshToken = refreshToken;
            newBusinessOwner.token = token;
            await this.businessOwnerRepository.save(newBusinessOwner);
            const mondayEvent = this.eventEmitter.emit("monday-create-item-register",{
                boardId: "1399424616",
                groupId: "topics",
                itemName: registerDto.company,
                form: {
                    "text": registerDto.fullName,
                    "phone": registerDto.phoneNumber,
                    "email": {
                        "text": registerDto.email,
                        "email": registerDto.email
                    },
                    "company": registerDto.company
                },
                userId: newBusinessOwner.id

            });
            return res.status(201).json({
                message: 'Registration successful ',
                data: {
                    token: token,
                    refreshToken: refreshToken,
                    name: newBusinessOwner.fullName,
                    email: newBusinessOwner.email,
                    phoneNumber: newBusinessOwner.phoneNumber,
                    company: newBusinessOwner.company_name,

                }
            });

        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async loginBusinessOwner(loginDto: LoginDto,res) {
        try {
            const businessOwner = await this.businessOwnerRepository.findOne({ where: { email: loginDto.email } });
            if (!businessOwner) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            const isMatch = await bcrypt.compare(loginDto.password, businessOwner.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            const token = await this.jwtService.signAsync({ phoneNumber: businessOwner.phoneNumber,role: 'businessOwner',id:businessOwner.id });
            const refreshToken = await this.jwtService.signAsync({ phoneNumber: businessOwner.phoneNumber,role: 'businessOwner',id:businessOwner.id }, { expiresIn: '7d' });
            businessOwner.refreshToken = refreshToken;
            businessOwner.token = token;
            await this.businessOwnerRepository.save(businessOwner);
            return res.status(200).json({ message: 'Login successful', data:{
                    token: token,
                    refreshToken: refreshToken,
                    name: businessOwner.fullName,
                    email: businessOwner.email,
                    phoneNumber: businessOwner.phoneNumber,
                    company: businessOwner.company_name,


                } });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async logoutBusinessOwner(token: string) {
        try {
            const businessOwner = await this.businessOwnerRepository.findOne({ where: { token } });
            if (!businessOwner) {
                return { message: 'Business Owner not found' };
            }
            businessOwner.token = null;
            await this.businessOwnerRepository.save(businessOwner);
            return { message: 'Logout successful' };
        }
        catch (error) {
            console.log(error);
            return { message: 'Internal server error' };
        }
    }

    async refreshToken(token: string) {
        try {
            const businessOwner = await this.businessOwnerRepository.findOne({ where: { token } });
            if (!businessOwner) {
                return { message: 'Business Owner not found' };
            }
            const newToken = await this.jwtService.signAsync({ phoneNumber: businessOwner.phoneNumber,role: 'businessOwner',id:businessOwner.id });
            businessOwner.token = newToken;
            await this.businessOwnerRepository.save(businessOwner);
            return { message: 'Token refreshed', token: newToken };
        }
        catch (error) {
            console.log(error);
            return { message: 'Internal server error' };
        }
    }


    async checkAuth(res: any,user) {
        try {
            console.log(user);
        }
        catch (error) {
            console.log(error);
            return { message: 'Internal server error' };
        }
    }
}
