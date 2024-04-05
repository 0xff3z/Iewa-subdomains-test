import {Injectable} from "@nestjs/common";
import {EventEmitter2} from "@nestjs/event-emitter";
import {RegisterTraineeDTO} from "../DTO/RegisterTraineeDTO";

@Injectable()
export class TraineeService {
  constructor(
      private eventEmitter: EventEmitter2,
  ) {}



    async registerTrainee(res, body:RegisterTraineeDTO,file){
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

                }
            })

          const response = this.eventEmitter.on("monday-created-item",(data) => {
              console.log(data)
              console.log(file)
              this.eventEmitter.emit("monday-upload-file",{
                  boardId: 1392728485,
                  itemId: data,
                  file: file,
                  columnId: "file"

              })
              return res.status(201).json({
                  message: "Trainee registered successfully"
              })
          })

      }
        catch (e) {

        }
    }
}