import {Module} from "@nestjs/common";
import {MarketplaceController} from "../Controller/marketplace.controller";
import {MarketplaceService} from "../Service/marketplace.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Candidate} from "../Models/Candidate.entity";
import MondayEvents from "../Events/Monday.events";
import {MondayService} from "../Service/monday.service";
import {BusinessOwner} from "../Models/BusinessOwner";
import {Interview} from "../Models/Interview.entity";
import {Invoice} from "../Models/Invoice";
import {InvoiceService} from "../Service/invoice.service";
import {RequestsService} from "../Service/requests.service";
import {CandidateRequest} from "../Models/CandidateRequest.entity";
import {TraineeService} from "../Service/trainee.service";
import {Trainee} from "../Models/Trainee";
import {List} from "../Models/List.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Candidate, BusinessOwner,Interview,Invoice,CandidateRequest,Trainee,List])],
    controllers: [MarketplaceController],
    providers: [MarketplaceService,MondayEvents,MondayService,InvoiceService,RequestsService,TraineeService],
    exports: []

})
export class MarketplaceModule {}

