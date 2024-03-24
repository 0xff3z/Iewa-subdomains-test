import {Module} from "@nestjs/common";
import {InvoiceController} from "../Controller/Invoice.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Invoice} from "../Models/Invoice";
import {InvoiceService} from "../Service/invoice.service";
import {CdnService} from "../Service/cdn.service";
import {CdnController} from "../Controller/cdn.controller";
import {MondayService} from "../Service/monday.service";
import {RequestsController} from "../Controller/requests.controller";
import {RequestsService} from "../Service/requests.service";
import {AvailableJobController} from "../Controller/available-job.controller";
import {AvailableJobService} from "../Service/available-job.service";
import {AvailableJob} from "../Models/AvailableJob";
import {Candidate} from "../Models/Candidate.entity";
import {CandidateRequest} from "../Models/CandidateRequest.entity";

@Module({
    controllers: [RequestsController,AvailableJobController],
    providers: [RequestsService,MondayService,AvailableJobService],
    imports:[TypeOrmModule.forFeature([AvailableJob,Candidate,CandidateRequest])],
    exports: []

})
export class RequestsModule {}
