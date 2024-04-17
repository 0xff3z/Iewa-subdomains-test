import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {MyList} from "./MyList.entity";
import {ShortList} from "./ShortList.entity";
import {RejectedList} from "./RejectedList.entity";
import {Interview} from "./Interview.entity";
import {IewaList} from "./IewaList.entity";

export enum CandidateType {
  marketPlace = 'marketPlace',
    iewa = 'iewa',
}

@Entity()
export class Candidate {
  @PrimaryColumn({unique: true})
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty()
  firstName: string;

  @Column({ nullable: true })
  @ApiProperty()
  job: string;

  @Column({ type: 'text', nullable: true})
  @ApiProperty()
  bio: string;

  @Column({  nullable: true})
  @ApiProperty()
  yearsOfExperience: string;
  @Column({  nullable: true})
  @ApiProperty()
  yearsOfExperienceTwo: string;
  @Column({  nullable: true})
  @ApiProperty()
  yearsOfExperienceThree: string;
  @Column({  nullable: true})
  @ApiProperty()
  yearsOfExperienceFour: string;

  // @Column({ nullable: true })
  // @ApiProperty()
  // jobType: string;

  // @Column({ nullable: true })
  // @ApiProperty()
  // englishLevel: string;
  @Column({  nullable: true})
    @ApiProperty()
  currency: string;
  @Column({  nullable: true})
    @ApiProperty()
  education: string;

  @Column({  nullable: true})
  @ApiProperty()
  expectedSalary: string;

  @Column({ nullable: true })
  @ApiProperty()
  nationality: string;

  @Column({ nullable: true })
    @ApiProperty()
  courses: string;

  @Column({ nullable: true })
  @ApiProperty()
  np: string;

  // @Column({ nullable: true })
  // @ApiProperty()
  // gender: string;

  // @Column({ nullable: true })
  // @ApiProperty()
  // senority: string;
  //
  // @Column('simple-array', { nullable: true })
  // @ApiProperty()
  // languages: string[];
  //
  // @Column('simple-array', { nullable: true })
  // @ApiProperty()
  // libraries: string[];
  //
  // @Column('simple-array', { nullable: true })
  // @ApiProperty()
  // tools: string[];
  //
  // @Column('simple-array', { nullable: true })
  // @ApiProperty()
  // storage: string[];
  //
  // @Column('simple-array', { nullable: true })
  // @ApiProperty()
  // frameworks: string[];
  //
  // @Column('simple-array', { nullable: true })
  // @ApiProperty()
  // paradigms: string[];
  //
  // @Column('simple-array', { nullable: true })
  // @ApiProperty()
  // platforms: string[];

  @Column( { nullable: true })
  @ApiProperty()
  skills: string;

  @Column({ nullable: true })
  @ApiProperty()
  project: string;
  @Column({ nullable: true })
  @ApiProperty()
  projectTwo: string;
  @Column({ nullable: true })
  @ApiProperty()
  projectThree: string;

  @OneToMany(type => MyList, myList => myList.candidate)
    myList: MyList[];
  @OneToMany(type => ShortList, shortList => shortList.candidate)
    shortList: ShortList[];
  @OneToMany(type => RejectedList, rejectedList => rejectedList.candidate)
    rejectedList: RejectedList[];
  @OneToMany(type => Interview, interview => interview.candidate)
    interview: Interview[];
  @OneToMany(type => IewaList, iewaList => iewaList.candidate)
    iewaList: IewaList[];
  @Column({ nullable: true, type: 'enum', enum: CandidateType, default: CandidateType.marketPlace })
    @ApiProperty()
  type: string;




  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;
  @UpdateDateColumn()
  @ApiProperty()
  updated_at: Date;





}

