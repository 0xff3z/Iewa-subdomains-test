import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class AddToListDTO {
    @ApiProperty()
    @IsNotEmpty()
    id: string;

    @ApiProperty()
    @IsNotEmpty()
    presentBy: string;
}