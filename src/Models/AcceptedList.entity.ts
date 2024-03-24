import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./User.entity";
import {Candidate} from "./Candidate.entity";
import {BusinessOwner} from "./BusinessOwner";
import {ApiProperty} from "@nestjs/swagger";
export enum PresentBy {
    me="مرشح بواسطتي",
    iewa="مرشح بواسطة ايوا",
}
@Entity()
export class AcceptedList {

    @PrimaryColumn({unique:true})
    mondayId: number;
    @ManyToOne(type => BusinessOwner, user => user.acceptedList)
    businessOwner: BusinessOwner;
    @ManyToOne(type => Candidate, candidate => candidate.myList)
    candidate: Candidate;
    @Column({ nullable: true , type: 'enum', enum: PresentBy})
    @ApiProperty()
    presentBy: string;

}