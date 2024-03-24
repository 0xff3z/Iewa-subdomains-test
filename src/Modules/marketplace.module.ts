import {Module} from "@nestjs/common";
import {MarketplaceController} from "../Controller/marketplace.controller";
import {MarketplaceService} from "../Service/marketplace.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Candidate} from "../Models/Candidate.entity";
import MondayEvents from "../Events/Monday.events";
import {MondayService} from "../Service/monday.service";
import {BusinessOwner} from "../Models/BusinessOwner";
import {MyList} from "../Models/MyList.entity";
import {Interview} from "../Models/Interview.entity";
import {Invoice} from "../Models/Invoice";
import {InvoiceService} from "../Service/invoice.service";
import {RequestsService} from "../Service/requests.service";
import {CandidateRequest} from "../Models/CandidateRequest.entity";
import {IewaList} from "../Models/IewaList.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Candidate, BusinessOwner, MyList,Interview,Invoice,CandidateRequest,IewaList])],
    controllers: [MarketplaceController],
    providers: [MarketplaceService,MondayEvents,MondayService,InvoiceService,RequestsService],
    exports: []

})
export class MarketplaceModule {}

