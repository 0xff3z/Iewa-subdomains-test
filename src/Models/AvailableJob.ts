import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class AvailableJob {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
}