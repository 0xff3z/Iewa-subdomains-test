import {Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Trainee {
    @PrimaryColumn()
    mondayId: string;
    @Column()
    aboutMe: string;
    @Column()
    areYouPassedIewaCamp: string;
    @Column()
    careerPath: string;
    @Column()
    college: string;
    @Column()
    email: string;
    @Column()
    englishLevel: string;
    @Column()
    favoriteOfWorkplace: string;

    @Column()
    howToWork: string;
    @Column()
    name: string;
    @Column()
    major: string;
    @Column()
    phoneNumber: string;
    @Column()
    PlaceOfResidence: string;
    @Column()
    salary: string;
    @Column()
    searchingFor: string;
    @Column()
    cv: string;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;

}