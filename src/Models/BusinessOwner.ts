import {Column, Entity, OneToMany} from "typeorm";
import {User} from "./User.entity";
import {Candidate} from "./Candidate.entity";
import {MyList} from "./MyList.entity";
import {ShortList} from "./ShortList.entity";
import {RejectedList} from "./RejectedList.entity";
import {AcceptedList} from "./AcceptedList.entity";
import {Interview} from "./Interview.entity";
import {Invoice} from "./Invoice";
import {CandidateRequest} from "./CandidateRequest.entity";
import {IewaList} from "./IewaList.entity";


@Entity()
export class BusinessOwner extends User {
    @Column({ nullable: true })
    company_name: string;

    @OneToMany(type => MyList, myList => myList.businessOwner)
    myList: MyList[];
    @OneToMany(type => ShortList, shortList => shortList.businessOwner)
    shortList: ShortList[];
    @OneToMany(type => RejectedList, rejectedList => rejectedList.businessOwner)
    rejectedList: RejectedList[];
    @OneToMany(type => AcceptedList, acceptedList => acceptedList.businessOwner)
    acceptedList: AcceptedList[];
    @OneToMany(type => Interview, interview => interview.businessOwner)
    interview: Interview[];
    @OneToMany(type => Invoice, invoices => invoices.businessOwner)
    invoices: Invoice[];
    @OneToMany(type => CandidateRequest, candidateRequests => candidateRequests.businessOwner)
    candidateRequests: CandidateRequest[];
    @OneToMany(type => IewaList, iewaList => iewaList.businessOwner)
    iewaList: IewaList[];

}