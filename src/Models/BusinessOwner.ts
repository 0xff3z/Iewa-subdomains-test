import {Column, Entity, OneToMany} from "typeorm";
import {User} from "./User.entity";
import {Interview} from "./Interview.entity";
import {Invoice} from "./Invoice";
import {CandidateRequest} from "./CandidateRequest.entity";
import {List} from "./List.entity";


@Entity()
export class BusinessOwner extends User {
    @Column({ nullable: true })
    company_name: string;
    @Column({ nullable: true })
    last_list_update: Date;
    @OneToMany(type => Interview, interview => interview.businessOwner)
    interview: Interview[];
    @OneToMany(type => Invoice, invoices => invoices.businessOwner)
    invoices: Invoice[];
    @OneToMany(type => CandidateRequest, candidateRequests => candidateRequests.businessOwner)
    candidateRequests: CandidateRequest[];
    @OneToMany(type => List, list => list.businessOwner)
    list: List[];

}