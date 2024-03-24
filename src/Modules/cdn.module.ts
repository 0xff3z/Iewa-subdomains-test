import {Module} from "@nestjs/common";
import {InvoiceController} from "../Controller/Invoice.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Invoice} from "../Models/Invoice";
import {InvoiceService} from "../Service/invoice.service";
import {CdnService} from "../Service/cdn.service";
import {CdnController} from "../Controller/cdn.controller";
import {MondayService} from "../Service/monday.service";

@Module({
    controllers: [CdnController],
    providers: [CdnService,MondayService],
    exports: []

})
export class CdnModule {}
