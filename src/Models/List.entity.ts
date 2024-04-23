import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {BusinessOwner} from "./BusinessOwner";
import {Candidate} from "./Candidate.entity";

export enum PresentBy {
    me="مرشح بواسطتي",
    iewa="مرشح بواسطة ايوا",
}


export enum ListType {
    myList="قائمتي",
    iewaList="قائمة ايوا",
    shortList="القائمة القصيرة",
    rejectedList="القائمة المرفوضة",
    interviewList="قائمة المقابلة",
    acceptedList="قائمة المقبولين",


}
@Entity()
export class List {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;
    @Column()
    @ApiProperty()
    mondayId: number;
    @ManyToOne(() => BusinessOwner, businessOwner => businessOwner.list)
    businessOwner: BusinessOwner;
    @Column({ nullable: true , type: 'enum', enum: PresentBy})
    @ApiProperty()
    presentBy: string;

    @Column({default: false})
    @ApiProperty()
    isRequestedCandidateInfo: boolean;

    @Column({enum: ListType})
    @ApiProperty()
    type: string;

    @ManyToOne(type => Candidate, candidate => candidate.list)
    candidate: Candidate;












    @CreateDateColumn()
    @ApiProperty()
    created_at: Date;
    @UpdateDateColumn()
    @ApiProperty()
    updated_at: Date;

}