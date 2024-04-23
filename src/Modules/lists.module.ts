import {Module} from "@nestjs/common";
import {ListController} from "../Controller/List.controller";
import {ListService} from "../Service/List.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {List} from "../Models/List.entity";
import {BusinessOwner} from "../Models/BusinessOwner";
import {Candidate} from "../Models/Candidate.entity";
import {BusinessOwnerController} from "../Controller/BusinessOwner.controller";
import {MyListsService} from "../Service/myLists.service";
import {Interview} from "../Models/Interview.entity";
import {TasksService} from "../Service/tasks.service";


@Module({
    controllers: [ListController,BusinessOwnerController],
    providers: [ListService,MyListsService,TasksService],
    imports:[TypeOrmModule.forFeature([List,BusinessOwner, Candidate,Interview])],
    exports: []

})
export class ListsModule {}
