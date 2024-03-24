import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm";
import {BusinessOwner} from "./BusinessOwner";




@Entity()
export class Invoice {
    @PrimaryColumn()
    invoiceId: string;
    @Column({nullable: true})
    invoiceType: string;
    @Column({nullable: true})
    invoiceTotal: number;
    @Column({nullable: true})
    invoiceDate: string;
    @Column({nullable: true})
    invoiceStatus: string;
    @Column({nullable: true})
    invoiceAssetUrl: string;
    @ManyToOne(() => BusinessOwner, businessOwner => businessOwner.invoices)
    businessOwner: BusinessOwner;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;

}