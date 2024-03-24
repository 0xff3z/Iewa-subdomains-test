import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm";
import {BusinessOwner} from "./BusinessOwner";




@Entity()
export class Invoice {
    @PrimaryColumn()
    invoiceId: number;
    @Column()
    invoiceType: string;
    @Column()
    invoiceTotal: number;
    @Column()
    invoiceDate: string;
    @Column()
    invoiceStatus: string;
    @Column()
    invoiceAssetUrl: string;
    @ManyToOne(() => BusinessOwner, businessOwner => businessOwner.invoices)
    businessOwner: BusinessOwner;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;

}