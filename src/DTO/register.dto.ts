import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RegisterDto {
    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    @IsNotEmpty()

    fullName: string;
    @IsString()
    @ApiProperty()
    @IsNotEmpty()

    company: string;
    @IsString()
    @ApiProperty()
    @IsNotEmpty()

    phoneNumber: string;
    @IsString()
    @ApiProperty()
    @IsNotEmpty()

    password: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
