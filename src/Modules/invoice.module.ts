import {Module} from "@nestjs/common";
import {InvoiceController} from "../Controller/Invoice.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Invoice} from "../Models/Invoice";
import {InvoiceService} from "../Service/invoice.service";

@Module({
    imports: [TypeOrmModule.forFeature([Invoice])],
    controllers: [InvoiceController],
    providers: [InvoiceService],
    exports: []

})
export class InvoiceModule {}
