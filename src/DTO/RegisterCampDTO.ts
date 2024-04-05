import {IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RegisterCampDTO {
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
    city: string;

    @ApiProperty()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    university: string;

    @ApiProperty()
    @IsNotEmpty()
    age: number;

    @ApiProperty()
    @IsNotEmpty()
    Q1: string;

    @ApiProperty()
    @IsNotEmpty()
    Q2: string;

    @ApiProperty()
    @IsNotEmpty()
    Q3: string;

    @ApiProperty()
    @IsNotEmpty()
    Q4: string;

    @ApiProperty()
    @IsNotEmpty()
    Q5: string;

    @ApiProperty()
    @IsNotEmpty()
    Q6: string;

    @ApiProperty()
    @IsNotEmpty()
    Q7: string;

    @ApiProperty()
    @IsNotEmpty()
    Q8: string;

    @ApiProperty()
    @IsNotEmpty()
    Q9: string;

    @ApiProperty()
    @IsNotEmpty()
    Q10: string;
    @ApiProperty()
    @IsNotEmpty()
    Q11: string;


}