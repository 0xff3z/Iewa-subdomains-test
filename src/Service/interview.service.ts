// import {Injectable, OnModuleInit} from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Candidate } from "src/Models/Candidate.entity";
// import { Interview } from "src/Models/Interview.entity";
// import { RejectedList } from "src/Models/RejectedList.entity";
// import { ShortList } from "src/Models/ShortList.entity";
// import { User } from "src/Models/User.entity";
// import { Repository } from "typeorm";
// import {Cron, CronExpression} from "@nestjs/schedule";
// import {MondayService} from "./monday.service";
//
// @Injectable()
// export class InterviewService{
//     constructor(
//         @InjectRepository(Interview) private readonly interviewRepository: Repository<Interview>,
//         @InjectRepository(User) private readonly userRepository: Repository<User>,
//         @InjectRepository(Candidate) private readonly candidateRepository: Repository<Candidate>,
//         @InjectRepository(ShortList) private readonly shortListRepository: Repository<ShortList>,
//         @InjectRepository(RejectedList) private readonly rejectedListRepository: Repository<RejectedList>,
//         private readonly mondayService:MondayService
//
//     ) {}
//
//
//
//
//     async createInterview(token,interviewId,candidateId,date,time) {
//         try {
//             const user = await this.userRepository.findOne({where: {token}})
//             const removeFromShortList = await this.shortListRepository.delete({mondayId:candidateId})
//             const createJobInterview = await this.interviewRepository.create({
//                 user,
//                 candidate: candidateId,
//                 id: interviewId,
//                 date: date,
//                 time:time,
//                 job: candidateId.job,
//             })
//             await this.interviewRepository.save(createJobInterview)
//             return true
//         } catch (error) {
//             console.log(error)
//             return false
//         }
//     }
//
//
//     async getJobInterview(token) {
//         try {
//             const user = await this.userRepository.findOne({where: {token},relations:["interview","interview.candidate"]})
//             const filteredInterviews = user.interview.filter(
//                 (interview) => interview.acceptionStatus === "قيد المراجعة"
//             );
//             const obj = {
//                 interview: filteredInterviews,
//             }
//             return obj
//         } catch (error) {
//             console.log(error)
//             return false
//         }
//     }
//
//
//
//     async updateInterview(token,interviewId,candidateId,date,time) {
//         try {
//             const interview = await this.interviewRepository.findOne({where: {id: interviewId}})
//             interview.date = date
//             interview.time = time
//             await this.interviewRepository.save(interview)
//             return true
//         } catch (error) {
//             console.log(error)
//             return false
//         }
//     }
//
//
//     async rejectCandidate(token,interviewId,candidateId) {
//         try {
//             const user = await this.userRepository.findOne({where: {token}})
//             const interview = await this.interviewRepository.findOne({where: {id: interviewId},relations:["user","candidate"]})
//             interview.acceptionStatus = "مرفوض"
//             const addToRejectList = await this.rejectedListRepository.create({
//                 user: user,
//                 candidate: interview.candidate,
//                 mondayId: candidateId
//             })
//             await this.interviewRepository.save(interview)
//             await this.rejectedListRepository.save(addToRejectList)
//             return true
//         } catch (error) {
//             return false
//         }
//     }
//
//
//     @Cron(CronExpression.EVERY_2_HOURS)
//     async getInterviews() {
//         const interviews = await this.interviewRepository.find({relations:["user","candidate"]})
//         const user = interviews[0].user
//         interviews.map(async (item) => {
//             const phoneWithoutPlus = user.phone.replace(/^\+/, '');
//             const myListRequest = await this.mondayService.queryByColumnValueAndGetLinkedItemsInboard(1399424616, "phone", phoneWithoutPlus);
//             const linkedItems = await this.mondayService.returnLinkedItems(myListRequest);
//             const interview = await this.mondayService.createInvterviewObject(linkedItems[7])
//             interview.map(async (item) => {
//                     const updateInterview = await this.interviewRepository.findOne({where: {id: item.id}})
//                     if (updateInterview) {
//                         updateInterview.date = item.date
//                         updateInterview.time = item.time
//                         updateInterview.status = item.status
//                         await this.interviewRepository.save(updateInterview)
//                     }
//                 }
//             )
//
//         }
//         )
//         // const phoneWithoutPlus = user.phone.replace(/^\+/, '');
//         // const myListRequest = await this.mondayService.queryByColumnValueAndGetLinkedItemsInboard(1399424616, "phone", phoneWithoutPlus);
//         // const linkedItems = await this.mondayService.returnLinkedItems(myListRequest);
//         // const interview = await this.mondayService.createInvterviewObject(linkedItems[7])
//         // interview.map(async (item) => {
//         //         const updateInterview = await this.interviewRepository.findOne({where: {id: item.id}})
//         //         if (updateInterview) {
//         //             updateInterview.date = item.date
//         //             updateInterview.time = item.time
//         //             updateInterview.status = item.status
//         //             await this.interviewRepository.save(updateInterview)
//         //         }
//         //     }
//         // )
//     }
//
// }