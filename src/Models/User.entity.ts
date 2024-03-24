import { PrimaryGeneratedColumn, Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @PrimaryColumn()
    phoneNumber: string;

    @Column({ nullable: true })
    name: string;
    @Column({ nullable: true })
    fullName: string;


    @Column({ unique: true, nullable: true})
    mondayId: string; 
    @Column({ unique: true })
    email: string; 

    @Column()
    token: string;
    @Column()
    refreshToken: string;
    @Column()
    password: string;

  

   
}