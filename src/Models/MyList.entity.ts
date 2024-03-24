import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./User.entity";
import {Candidate} from "./Candidate.entity";
import {BusinessOwner} from "./BusinessOwner";
import {ApiProperty} from "@nestjs/swagger";
export enum PresentBy {
    "مرشح بواسطتي"="مرشح بواسطتي",
    "مرشح بواسطة ايوا"="مرشح بواسطة ايوا",
}
@Entity()
export class MyList {

    @PrimaryColumn({unique:true})
    mondayId: number;
    @ManyToOne(type => BusinessOwner, user => user.myList)
    businessOwner: BusinessOwner;
    @ManyToOne(type => Candidate, candidate => candidate.myList)
    candidate: Candidate;
    @Column({ nullable: true , type: 'enum', enum: PresentBy})
    @ApiProperty()
    presentBy: string;

}