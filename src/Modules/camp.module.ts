import {Module} from "@nestjs/common";
import {CampService} from "../Service/camp.service";
import {CampController} from "../Controller/camp.controller";


@Module({
    controllers: [CampController],
    providers: [CampService],
    imports:[],
    exports: []

})
export class CampModule {}
