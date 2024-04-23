import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MondayService} from "../Service/monday.service";
import {RequestsController} from "../Controller/requests.controller";
import {RequestsService} from "../Service/requests.service";
import {AvailableJob} from "../Models/AvailableJob";
import {Candidate} from "../Models/Candidate.entity";
import {CandidateRequest} from "../Models/CandidateRequest.entity";

@Module({
    controllers: [RequestsController],
    providers: [RequestsService,MondayService],
    imports:[TypeOrmModule.forFeature([Candidate,CandidateRequest])],
    exports: []

})
export class RequestsModule {}
