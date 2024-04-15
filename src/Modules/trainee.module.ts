import {Module} from "@nestjs/common";
import {TraineeController} from "../Controller/Trainee.controller";
import {TraineeService} from "../Service/trainee.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Trainee} from "../Models/Trainee";


@Module({
    controllers: [TraineeController],
    providers: [TraineeService],
    imports:[TypeOrmModule.forFeature([Trainee])],
    exports: []

})
export class TraineeModule {}
