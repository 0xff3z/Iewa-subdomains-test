import {Module} from "@nestjs/common";
import {MarketplaceController} from "../Controller/marketplace.controller";
import {MarketplaceService} from "../Service/marketplace.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Candidate} from "../Models/Candidate.entity";
import MondayEvents from "../Events/Monday.events";
import {MondayService} from "../Service/monday.service";
import {BusinessOwner} from "../Models/BusinessOwner";
import {MyList} from "../Models/MyList.entity";
import {MyListsService} from "../Service/myLists.service";
import {BusinessOwnerController} from "../Controller/BusinessOwner.controller";
import {ShortList} from "../Models/ShortList.entity";
import {RejectedList} from "../Models/RejectedList.entity";
import {AcceptedList} from "../Models/AcceptedList.entity";
import {Interview} from "../Models/Interview.entity";
import {Invoice} from "../Models/Invoice";
import {IewaList} from "../Models/IewaList.entity";
import {TasksService} from "../Service/tasks.service";

@Module({
    imports: [TypeOrmModule.forFeature([Candidate, BusinessOwner, MyList, ShortList, RejectedList, AcceptedList, Interview, Invoice,IewaList])],
    controllers: [BusinessOwnerController],
    providers: [MyListsService,TasksService],
    exports: []

})
export class MyListsModule {}

