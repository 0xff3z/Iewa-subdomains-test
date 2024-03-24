import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { Candidate } from "./Candidate.entity";
import { User } from "./User.entity";
import {BusinessOwner} from "./BusinessOwner";


enum Status {
    "بانتظار تاكيد المرشح" = "بانتظار تاكيد المرشح",
    "مقابلة مؤكدة" = "مقابلة مؤكدة",
    "لم تتم المقابلة" = "لم تتم المقابلة",
    "تمت المقابلة" = "تمت المقابلة"

}

export enum AcceptionStatus {
    "مقبول" = "مقبول",
    "مرفوض" = "مرفوض",
    "قيد المراجعة" = "قيد المراجعة"
}
@Entity()

export class Interview {
    @PrimaryGeneratedColumn()
    id: number
    @Column({nullable:true})
    mondayId: string

    @ManyToOne(type => Candidate, candidate => candidate.interview)
    candidate: Candidate

    @ManyToOne(type => BusinessOwner, user => user.interview)
    businessOwner: BusinessOwner
    @Column()
    candidateId: string
    @Column()
    date: string
    @Column()
    time: string
    @Column({nullable:true})
    job: string
    @Column({ type: "enum", enum: Status,default:"بانتظار تاكيد المرشح" })
    status: string
    @Column({type: "enum", enum: AcceptionStatus,default:"قيد المراجعة" })
    acceptionStatus: string

}