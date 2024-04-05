import {Module} from "@nestjs/common";
import {TraineeController} from "../Controller/Trainee.controller";
import {TraineeService} from "../Service/trainee.service";


@Module({
    controllers: [TraineeController],
    providers: [TraineeService],
    imports:[],
    exports: []

})
export class TraineeModule {}
