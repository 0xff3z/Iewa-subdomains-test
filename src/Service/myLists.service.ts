import {Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {BusinessOwner} from "../Models/BusinessOwner";
import {Repository} from "typeorm";
import {MyList} from "../Models/MyList.entity";
import {ShortList} from "../Models/ShortList.entity";
import {AcceptedList} from "../Models/AcceptedList.entity";
import {EventEmitter2} from "@nestjs/event-emitter";
import {RejectedList} from "../Models/RejectedList.entity";
import {Interview} from "../Models/Interview.entity";
import {Candidate} from "../Models/Candidate.entity";
import {IewaList} from "../Models/IewaList.entity";

@Injectable()
export class MyListsService {
    constructor(
        @InjectRepository(BusinessOwner) private readonly businessOwnerRepository: Repository<BusinessOwner>,
        @InjectRepository(MyList) private readonly myListRepository: Repository<MyList>,
        @InjectRepository(ShortList) private readonly shortListRepository: Repository<ShortList>,
        @InjectRepository(AcceptedList) private readonly acceptedListRepository: Repository<AcceptedList>,
        @InjectRepository(RejectedList) private readonly rejectedListRepository: Repository<RejectedList>,
        @InjectRepository(Interview) private readonly interviewRepository: Repository<Interview>,
        @InjectRepository(Candidate) private readonly candidateRepository: Repository<Candidate>,
        @InjectRepository(IewaList) private readonly iewaListRepository: Repository<IewaList>,
        private eventEmitter: EventEmitter2

    ) {
    }

    async getMyLists(res, user: BusinessOwner) {
        try {
            const businessOwner = await this.businessOwnerRepository.findOne({
                where: { id: user.id },
                relations: ["myList", "myList.candidate", "shortList", "shortList.candidate", "acceptedList", "acceptedList.candidate", "rejectedList", "rejectedList.candidate", "interview", "interview.candidate"]
            });


            return res.status(200).json({
                message: "My Lists retrieved successfully",
                data: {
                    shortList: businessOwner.shortList,
                    myList: businessOwner.myList,
                    acceptedList: businessOwner.acceptedList,
                    rejectedList: businessOwner.rejectedList,
                    interview: businessOwner.interview.filter((interview) => interview.acceptionStatus != "مقبول"),
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }


    async addToList(res, user:BusinessOwner, body: { type: string, candidateId: any,interviewId:number, presentBy:string}) {
        try {
            const businessOwner = await this.businessOwnerRepository.findOne({where: {id:user.id},relations:["myList"]})
            switch (body.type) {
                case "myList":
                    const myList = await this.myListRepository.findOne({where: {mondayId:body.candidateId}})
                    const shortListE = await this.shortListRepository.findOne({where: {mondayId:body.candidateId}})
                    const acceptedListE = await this.acceptedListRepository.findOne({where: {mondayId:body.candidateId}})
                    const rejectedListE = await this.rejectedListRepository.findOne({where: {mondayId:body.candidateId}})
                    if (myList || shortListE || acceptedListE || rejectedListE) {
                        return res.status(404).json({
                            message: "المرشح مضاف مسبقا"

                        })
                    }


                    const newMyList = await this.myListRepository.create({
                        mondayId:body.candidateId,
                        businessOwner:businessOwner,
                        candidate:body.candidateId,
                        presentBy:body.presentBy
                    })
                    setTimeout(() => {
                        this.eventEmitter.emit("addMultipleItemInList",{
                            userMondayId:user.mondayId,

                        })
                    }, 4000);

                    await this.myListRepository.save(newMyList)
                    return res.status(200).json({
                        message: "Candidate added to list successfully",

                    })
                case "shortList":
                    const shortList = await this.shortListRepository.findOne({where: {mondayId:body.candidateId}})
                    if (shortList) {
                        return res.status(404).json({
                            message: "Candidate already added to list"

                        })
                    }

                    const newShortList = await this.shortListRepository.create({
                        mondayId:body.candidateId,
                        businessOwner:businessOwner,
                        candidate:body.candidateId,
                        presentBy:body.presentBy
                    })
                    const deleteFromMyList = await this.myListRepository.delete({mondayId:body.candidateId})
                    setTimeout(() => {
                        this.eventEmitter.emit("addMultipleItemInList",{
                            userMondayId:user.mondayId,

                        })
                    }, 4000);

                    await this.shortListRepository.save(newShortList)
                    return res.status(200).json({
                        message: "Candidate added to list successfully",

                    })
                case "acceptedList":
                    const acceptedList = await this.acceptedListRepository.findOne({where: {mondayId:body.candidateId}})
                    if (acceptedList) {
                        return res.status(404).json({
                            message: "Candidate already added to list"

                        })
                    }

                    const newAcceptedList = await this.acceptedListRepository.create({
                        mondayId:body.candidateId,
                        businessOwner:businessOwner,
                        candidate:body.candidateId,
                        presentBy:body.presentBy
                    })
                    setTimeout(() => {
                        this.eventEmitter.emit("addMultipleItemInList",{
                            userMondayId:user.mondayId,

                        })
                    }, 4000);

                    await this.acceptedListRepository.save(newAcceptedList)
                    return res.status(200).json({
                        message: "Candidate added to list successfully",

                    })
                case "rejectList":
                    const returnToMyList = await this.myListRepository.create({
                        mondayId:body.candidateId,
                        businessOwner:businessOwner,
                        candidate:body.candidateId,
                        presentBy:body.presentBy
                    })
                    const deleteFromRejectedList = await this.rejectedListRepository.delete({mondayId:body.candidateId})
                    await this.myListRepository.save(returnToMyList)
                    setTimeout(() => {
                        this.eventEmitter.emit("addMultipleItemInList",{
                            userMondayId:user.mondayId,

                        })
                    }, 4000);

                    return res.status(200).json({
                        message: "Candidate added to list successfully",

                    })
                case "interview":
                    const interview = await this.interviewRepository.findOne({where: {id:body.interviewId}})
                    interview.acceptionStatus= "مقبول"
                    await this.interviewRepository.save(interview)
                    const addToAcceptedList = await this.acceptedListRepository.create({
                        mondayId:body.candidateId,
                        businessOwner:businessOwner,
                        candidate:body.candidateId,
                        presentBy:body.presentBy
                    })
                    await this.acceptedListRepository.save(addToAcceptedList)
                    setTimeout(() => {
                        this.eventEmitter.emit("addMultipleItemInList",{
                            userMondayId:user.mondayId,

                        })
                    }, 4000);
                    return res.status(200).json({
                        message: "Candidate added to list successfully",

                    })

                case "iewaList":
                    const iewaList = await this.iewaListRepository.findOne({where: {id: body.candidateId}})

                    const candidate = await this.candidateRepository.create({
                        type: "iewa",
                        ...iewaList
                    })
                    await this.candidateRepository.save(candidate)

                    const deleteFromIewaList = await this.iewaListRepository.delete({id: body.candidateId})
                    console.log(deleteFromIewaList)

                    const myLists = await this.myListRepository.create({
                        mondayId: body.candidateId,
                        businessOwner: businessOwner,
                        candidate: candidate,
                        presentBy: "مرشح بواسطة ايوا"
                    })
                    await this.myListRepository.save(myLists)

                    setTimeout(() => {
                        this.eventEmitter.emit("addMultipleItemInList", {
                            userMondayId: user.mondayId,
                        })
                    }, 4000);

                    return res.status(200).json({
                        message: "Candidate added to list successfully",
                    })

            }


        } catch (error) {
            console.log(error)

        }
    }

    async removeFromList(res, user:BusinessOwner, body: { type: string, candidateId: any, reason:string, interviewId:number}) {
        try {
            const businessOwner = await this.businessOwnerRepository.findOne({where: {id:user.id},relations:["myList","shortList","acceptedList","rejectedList"]})
            switch (body.type) {
                case "myList":
                    const myList = await this.myListRepository.findOne({where: {mondayId: body.candidateId}})
                    if (!myList) {
                        return res.status(404).json({
                            message: "Candidate not found in list"

                        })
                    }
                    this.eventEmitter.emit("createItemUpdateInMonday",{
                        itemId:body.candidateId,
                        body:`
                        السبب: ${body.reason},
                        المرحلة" :"قائمتي",
                        اسم الشركة" :${user.company_name},`

                    })
                    const deleteFromMyList = await this.myListRepository.delete({mondayId: body.candidateId})
                    const addToRejectedListT = await this.rejectedListRepository.create({
                        mondayId:body.candidateId,
                        businessOwner:businessOwner,
                        candidate:body.candidateId,
                    })
                    await this.rejectedListRepository.save(addToRejectedListT)
                    setTimeout(() => {
                        this.eventEmitter.emit("addMultipleItemInList",{
                            userMondayId:user.mondayId,

                        })
                    }, 4000);

                    return res.status(200).json({
                        message: "Candidate removed from list successfully",

                    })
                case "shortList":
                    const shortList = await this.shortListRepository.findOne({where: {mondayId: body.candidateId}})
                    if (!shortList) {
                        return res.status(404).json({
                            message: "Candidate not found in list"

                        })
                    }
                    const deleteFromShortList = await this.shortListRepository.delete({mondayId: body.candidateId})
                    const addToRejectedList = await this.rejectedListRepository.create({
                        mondayId:body.candidateId,
                        businessOwner:businessOwner,
                        candidate:body.candidateId,
                    })
                    await this.rejectedListRepository.save(addToRejectedList)
                    this.eventEmitter.emit("createItemUpdateInMonday",{
                        itemId:body.candidateId,
                        body:`
                        السبب: ${body.reason},
                        المرحلة" :"قائمتي القصيرة",
                        اسم الشركة" :${user.company_name},`

                    })
                    setTimeout(() => {
                        this.eventEmitter.emit("addMultipleItemInList",{
                            userMondayId:user.mondayId,

                        })
                    }, 4000);

                    return res.status(200).json({
                        message: "Candidate removed from list successfully",

                    })
                case "interview":
                    const addToAcceptedList = await this.acceptedListRepository.create({
                        mondayId:body.candidateId,
                        businessOwner:businessOwner,
                        candidate:body.candidateId,
                    })
                    const interview = await this.interviewRepository.findOne({where: {id:body.interviewId}})
                    await this.acceptedListRepository.save(addToAcceptedList)
                    interview.acceptionStatus = "مقبول"
                    await this.interviewRepository.save(interview)
                    const deleteFromAcceptedList = await this.acceptedListRepository.delete({mondayId: body.candidateId})
                    setTimeout(() => {
                        this.eventEmitter.emit("addMultipleItemInList",{
                            userMondayId:user.mondayId,

                        })
                    }, 4000);

                    return res.status(200).json({
                        message: "Candidate removed from list successfully",

                    })
                case "jobInterview":
                    const interviewD = await this.interviewRepository.delete({id:body.interviewId})
                    console.log(body)
                    const addToRejectedListI = await this.rejectedListRepository.create({
                        mondayId:body.candidateId,
                        businessOwner:businessOwner,
                        candidate:body.candidateId,
                    })
                    await this.rejectedListRepository.save(addToRejectedListI)

                    this.eventEmitter.emit("createItemUpdateInMonday",{
                        itemId:body.candidateId,
                        body:`
                        السبب: ${body.reason},
                        المرحلة" :"المقابلة",
                        اسم الشركة" :${user.company_name},`

                    })


                    setTimeout(() => {
                        this.eventEmitter.emit("addMultipleItemInList",{
                            userMondayId:user.mondayId,

                        })
                    }, 4000);

                    return res.status(200).json({
                        message: "Candidate removed from list successfully",

                    })
            }
        }
        catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Internal server error" });
        }

    }

    async createInterview(res, user:BusinessOwner, body: { candidateId: any, date: string, time: string }) {
        try {
            const businessOwner = await this.businessOwnerRepository.findOne({where: {id:user.id},relations:["myList","shortList","acceptedList","rejectedList"]})
            const candidate = await this.candidateRepository.findOne({where: {id:body.candidateId}})
            const interview = await this.interviewRepository.create({
                candidate:candidate,
                businessOwner:businessOwner,
                date:body.date,
                time:body.time,
                id:body.candidateId,
                candidateId:body.candidateId
            })
            await this.interviewRepository.save(interview)
            const deleteFromShortList = await this.shortListRepository.delete({mondayId:body.candidateId})
            const deleteFromMyList = await this.myListRepository.delete({mondayId:body.candidateId})

            this.eventEmitter.emit("createInterviewInMonday",{
                boardId:1392724674,
                candidateMondayId:body.candidateId,
                itemName:"مقابلة",
                userMondayId:user.mondayId,
                talentPoolConnectedBoard:"connect_boards",
                clientConnectedBoard:"connect_boards6",
                form: {
                    date_1: body.date,
                    hour: { hour: parseInt(body.time), minute: 0 }
                },
                interviewId:interview.id

            })
            return res.status(200).json({
                message: "Interview created successfully",

            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal server error" });
        }
    }


    async getIewaList(res, user:BusinessOwner) {
        try {
            this.eventEmitter.emit("getIewaList",{
                itemId:user.mondayId
            })

            const iewaList = await this.iewaListRepository.find({where: {businessOwner: user}});
            return res.status(200).json({status:200, message: 'Iewa List retrieved successfully', data: iewaList});




        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async updateInterview(res, user:BusinessOwner, body: { candidateId: any, date: string, time: string, interviewId:number}) {
        try {
            const interview = await this.interviewRepository.findOne({where: {id:body.interviewId}})
            interview.date = body.date
            interview.time = body.time
            await this.interviewRepository.save(interview)
            this.eventEmitter.emit("monday-update-item",{
                boardId:1392724674,
                itemId:interview.mondayId,
                form: {
                    date_1: body.date,
                    hour: { hour: parseInt(body.time), minute: 0 },

                }

            })
            return res.status(200).json({
                message: "Interview updated successfully",

            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal server error" });
        }
    }


}