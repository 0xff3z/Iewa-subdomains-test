import {IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RegisterTraineeDTO {
    @ApiProperty()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    email: string;


    @ApiProperty()
    @IsNotEmpty()
    sex: string;

    @ApiProperty()
    @IsNotEmpty()
    placeOfResidence: string;

    @ApiProperty()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    major: string;


    @ApiProperty()
    @IsNotEmpty()
    aboutMe: string;

    @ApiProperty()
    @IsNotEmpty()
    searchingFor: string;

    @ApiProperty()
    @IsNotEmpty()
    salary: string;

    @ApiProperty()
    @IsNotEmpty()
    areYouPassedIewaCamp: string;



}