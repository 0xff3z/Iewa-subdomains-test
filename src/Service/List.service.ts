import {InjectRepository} from "@nestjs/typeorm";
import {List} from "../Models/List.entity";
import {Repository} from "typeorm";
import {BusinessOwner} from "../Models/BusinessOwner";
import {Candidate} from "../Models/Candidate.entity";
import {EventEmitter2} from "@nestjs/event-emitter";
import {Interview} from "../Models/Interview.entity";

export class ListService {
    constructor(
        @InjectRepository(List) private listRepository: Repository<List>,
        @InjectRepository(BusinessOwner) private businessOwnerRepository: Repository<BusinessOwner>,
        @InjectRepository(Candidate) private candidateRepository: Repository<Candidate>,
        @InjectRepository(Interview) private interviewRepository: Repository<Interview>,
        private eventEmitter: EventEmitter2,

    ) {
    }


    async getMyLists(res, user) {
        try {
            const businessOwner = await this.businessOwnerRepository.findOne({where: {mondayId: user.mondayId}, relations: ['list', 'list.candidate',"interview","interview.candidate"]});
            const myList = businessOwner.list.filter(listItem => listItem.type === 'myList');
            const shortList = businessOwner.list.filter(listItem => listItem.type === 'shortList');
            const acceptedList = businessOwner.list.filter(listItem => listItem.type === 'acceptedList');
            const rejectedList = businessOwner.list.filter(listItem => listItem.type === 'rejectedList');
            const interview = businessOwner.interview;


            return res.status(200).json({status: 200, message: 'My Lists retrieved successfully', data: {
                    myList: myList,
                    shortList: shortList,
                    acceptedList: acceptedList,
                    rejectedList: rejectedList,
                    interview: interview.filter(interviewItem => interviewItem.acceptionStatus == "قيد المراجعة")

                }});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Internal server error'});
        }
    }

    async addList(res, user, body) {
        try {
            const businessOwner = await this.businessOwnerRepository.findOne({
                where: { mondayId: user.mondayId },
                relations: ['list', 'list.candidate']
            });

            if (!businessOwner) {
                return res.status(404).json({status: 404, message: 'Business owner not found'});
            }
            if (body.oldList == "jobInterview") {
                const candidate = await this.candidateRepository.findOne({where: {id: body.candidateId}});
                if (!candidate) {
                    return res.status(404).json({status: 404, message: 'Candidate not found'});
                }

                const newListItem = this.listRepository.create({
                    type: body.newListType,
                    candidate: candidate,
                    businessOwner: businessOwner,
                    presentBy: body.presentBy,
                    mondayId: body.candidateId,
                });

                await this.listRepository.save(newListItem);
                const interview = await this.interviewRepository.findOne({where: {id: body.interviewId}});
                interview.acceptionStatus = "مقبول";
                await this.interviewRepository.save(interview);

                setTimeout(() => {
                    this.eventEmitter.emit("addMultipleItemInList", {
                        userMondayId: user.mondayId,
                    });
                }, 4000);
                setTimeout(() => {
                    const message = `
اسم الشركة: ${businessOwner.company_name}
المرحلة: ${body.newListType}
`;
                    this.eventEmitter.emit("createItemUpdateInMonday", {
                       itemId: body.candidateId,
                        body:message
                    });
                }, 4000);

                return res.status(200).json({status: 200, message: 'List added successfully'});
            }

            if (body.type == "marketplace") {
                const candidateExistsInAnyList = businessOwner.list.some(listItem =>
                    listItem.candidate.id === body.candidateId);

                if (candidateExistsInAnyList) {
                    return res.status(400).json({status: 400, message: 'Candidate already exists in a list'});
                }

                const candidate = await this.candidateRepository.findOne({where: {id: body.candidateId}});
                if (!candidate) {
                    return res.status(404).json({status: 404, message: 'Candidate not found'});
                }

                const newListItem = this.listRepository.create({
                    type: "myList",
                    candidate: candidate,
                    businessOwner: businessOwner,
                    presentBy: body.presentBy,
                    mondayId: body.candidateId,
                });
                const message = `
اسم الشركة: ${businessOwner.company_name}
الحالة: تمت الاضافة
المرحلة: ${body.newListType}
`;

                this.eventEmitter.emit("createItemUpdateInMonday",{
                    itemId: body.candidateId,
                    body:message
                })

                await this.listRepository.save(newListItem);

                setTimeout(() => {
                    this.eventEmitter.emit("addMultipleItemInList", {
                        userMondayId: user.mondayId,
                    });
                }, 4000);

                return res.status(200).json({status: 200, message: 'List added successfully'});
            }

            const editList = await this.listRepository.findOne({where: {id: body.listId}, relations: ['candidate']});
            if (!editList) {
                return res.status(404).json({status: 404, message: 'List not found'});
            }

            editList.presentBy = body.presentBy;
            editList.type = body.newListType;
            await this.listRepository.save(editList);

            setTimeout(() => {
                this.eventEmitter.emit("addMultipleItemInList",{
                    userMondayId: user.mondayId,
                })
            }, 4000);
            const message = `
اسم الشركة: ${businessOwner.company_name}
الحالة: تم التعديل
المرحلة: ${body.newListType}
`;

            this.eventEmitter.emit("createItemUpdateInMonday",{
                itemId: body.candidateId,
               body:message
            })

            return res.status(200).json({status: 200, message: 'List edited successfully'});

        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Internal server error'});
        }
    }


    async deleteList(res, user, body) {
        try {
            const businessOwner = await this.businessOwnerRepository.findOne({
                where: {mondayId: user.mondayId}, relations: ['list', 'list.candidate']
            });
            const candidate = await this.candidateRepository.findOne({where: {id: body.candidateId}});

            if (body.type == "jobInterview") {
                const interview = await this.interviewRepository.findOne({where: {id: body.interviewId}});
                interview.acceptionStatus = "مرفوض";
                await this.interviewRepository.save(interview);
                const addToRejectedList = await this.listRepository.create({
                    type: 'rejectedList',
                    candidate: candidate,
                    businessOwner: businessOwner,
                    presentBy: body.presentBy,
                    mondayId: candidate.id,
                })
                setTimeout(() => {
                    this.eventEmitter.emit("addMultipleItemInList",{
                        userMondayId: user.mondayId,
                    })
                }, 4000);
                const message = `
اسم الشركة: ${businessOwner.company_name}
المرحلة: ${body.type}
السبب: ${body.reason}
الحالة: مرفوض
`;
                this.eventEmitter.emit("createItemUpdateInMonday",{
                    itemId: body.candidateId,
                    body:message
                })

                await this.listRepository.save(addToRejectedList);
                return res.status(200).json({status: 200, message: 'List deleted successfully'});
            }
            if (!businessOwner.list.some(listItem => listItem.candidate.id === body.candidateId && listItem.type === body.type)) {
                return res.status(400).json({status: 400, message: 'List does not exist'});
            }
            const deleteList = await this.listRepository.delete({candidate: candidate, type: body.type});
            const addToRejectedList = await this.listRepository.create({
                type: 'rejectedList',
                candidate: candidate,
                businessOwner: businessOwner,
                presentBy: body.presentBy,
                mondayId: candidate.id,
            })
            setTimeout(() => {
                this.eventEmitter.emit("addMultipleItemInList",{
                    userMondayId: user.mondayId,
                })
            }, 4000);
            const message = `
اسم الشركة: ${businessOwner.company_name}
المرحلة: ${body.type}
السبب: ${body.reason}
الحالة: مرفوض
`;

            this.eventEmitter.emit("createItemUpdateInMonday",{
                itemId: body.candidateId,
                body:message
            })

            await this.listRepository.save(addToRejectedList);
            return res.status(200).json({status: 200, message: 'List deleted successfully'});

        }
        catch (e) {
            console.log(e);
            res.status(500).json({message: 'Internal server error'});
        }
    }


    async getIewaLists(res, user) {
        try {
            const businessOwner = await this.businessOwnerRepository.find({where: {mondayId: user.mondayId}, relations: ['list', 'list.candidate']});
            this.eventEmitter.emit('getIewaList', {
                itemId: user.mondayId,
            });

            this.eventEmitter.once('iewaListFinished', (values) => {
                const iewaList = businessOwner.flatMap(owner =>
                    owner.list.filter(listItem => listItem.type === 'iewaList')
                );
                console.log(iewaList);
                return res.status(200).json({status: 200, message: 'Iewa Lists retrieved successfully', data:iewaList});
            })


        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Internal server error'});
        }

    }



}