import {Injectable} from "@nestjs/common";
import {EventEmitter2} from "@nestjs/event-emitter";

@Injectable()
export class CampService {
    constructor(
        private eventEmitter: EventEmitter2,
    ) {
    }


    async getFormSteps(res) {
        try {
            this.eventEmitter.emit('monday-get-view-columns',{
                "boardId":1394953051,
                "viewId":13474346,
            });
        }
        catch (e) {
            throw e
        }
    }


    async registerCamp(res, body) {
        try {
            this.eventEmitter.emit('monday-create-item',{
                "boardId":1394953051,
                "groupId":"new_group17703",
                "itemName":body.lastName,
                "form": {
                    "email":{
                        "email": body.email,
                        'text': body.email,
                    },
                    "single_select3":body.graduated,
                    "short_text7": body.city,
                    "phone": `+966${body.phoneNumber}`,
                    "short_text": body.firstName,
                    "short_text77": body.university,
                    'number': body.age,
                    "single_select4": body.Q1,
                    "single_select0": body.Q2,
                    "single_select1": body.Q3,
                    "single_select7": body.Q4,
                    "single_select8": body.Q5,
                    "single_select00": body.Q6,
                    "single_select9": body.Q7,
                    "single_select5": body.Q8,
                    "single_select72": body.Q9,
                    "single_select80": body.Q10,
                    "single_select44": body.Q11,
                }
            });

            this.eventEmitter.on("monday-created-item", (data) => {

            })
            res.status(201).json({
                message: "Candidate registered successfully",

            })

        }
        catch (e) {
            throw e
        }
    }
}

