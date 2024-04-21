import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {BusinessOwner} from "./BusinessOwner";

@Entity()
export class CandidateRequest {
    @PrimaryColumn()
    mondayId: number;
    @Column()
    jobTitle: string;
    @Column('simple-array', { nullable: true })
    skills: string[];
    @Column()
    experienceLevel: string;
    @Column()
    numberOfEmployees: number;
    @Column()
    jobResponsibilities: string;
    @Column()
    employmentType: string;
    @Column()
    englishLevel: string;
    @Column()
    workingDays: string;
    @Column()
    whenToStart: string;
    @Column()
    salaryCap: string;
    @Column()
    additionalNotes: string;
    @Column()
    technicalSkills: string;
    @Column()
    jobRequirementsExperiences: string;
    @Column({nullable: true})
    contractType: string;
    @Column({nullable: true})
    status: string;
    @ManyToOne(() => BusinessOwner, businessOwner => businessOwner.candidateRequests)
    businessOwner: BusinessOwner;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;





}