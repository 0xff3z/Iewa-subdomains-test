import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Candidate} from "./Candidate.entity";
import {BusinessOwner} from "./BusinessOwner";
import {ApiProperty} from "@nestjs/swagger";
export enum PresentBy {
    me="مرشح بواسطتي",
    iewa="مرشح بواسطة ايوا",
}
@Entity()

export class RejectedList {

    @PrimaryColumn({unique:true})
    mondayId: number;
    @ManyToOne(type => BusinessOwner, user => user.rejectedList)
    businessOwner: BusinessOwner;
    @ManyToOne(type => Candidate, candidate => candidate.rejectedList)
    candidate: Candidate;
    @Column({ nullable: true , type: 'enum', enum: PresentBy})
    @ApiProperty()
    presentBy: string;

}