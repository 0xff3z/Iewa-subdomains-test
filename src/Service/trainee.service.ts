import {Injectable} from "@nestjs/common";
import {EventEmitter2} from "@nestjs/event-emitter";
import {RegisterTraineeDTO} from "../DTO/RegisterTraineeDTO";

@Injectable()
export class TraineeService {
  constructor(
      private eventEmitter: EventEmitter2,
  ) {}



    async registerTrainee(res, body:any,file){
        try {
            this.eventEmitter.emit("monday-create-item",{
                boardId: 1392728485,
                groupId: "topics",
                itemName: body.firstName + " " + body.lastName,
                form :{
                    "status6": body.sex,
                    "phone": body.phoneNumber,
                    "email":{
                        "email": body.email,
                        "text": body.email
                    },
                    "long_text": body.aboutMe,
                    "status5": body.searchingFor,
                    "numbers": body.salary,
                    "status": body.areYouPassedIewaCamp,
                    "color": body.PlaceOfResidence,
                    "status8": body.major,
                    "status35": body.favoriteOfWorkplace,
                    "status4": body.careerPath,
                    "status98": body.englishLevel,
                    "status9": body.howToWork,
                    "status3": body.college,
                }
            });

            this.eventEmitter.once("monday-created-item", (data) => {
                console.log(data);
                console.log(file);
                this.eventEmitter.emit("monday-upload-file",{
                    boardId: 1392728485,
                    itemId: data,
                    file: file,
                    columnId: "file"
                });
                res.status(201).json({
                    message: "Trainee registered successfully"
                });
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

}