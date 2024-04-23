import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Candidate} from "../Models/Candidate.entity";
import {EventEmitter2} from "@nestjs/event-emitter";
import {BusinessOwner} from "../Models/BusinessOwner";
import {MondayService} from "./monday.service";
import {List} from "../Models/List.entity";


@Injectable()
export class MarketplaceService  {
    constructor(
        @InjectRepository(Candidate) private candidateRepository: Repository<Candidate>,
        @InjectRepository(BusinessOwner) private businessOwnerRepository: Repository<BusinessOwner>,
        @InjectRepository(List) private myListRepository: Repository<List>,
        private eventEmitter: EventEmitter2,
        private mondayService: MondayService
    ) { }


    async getMarketplace(res) {
       try {
           const candidates = await this.candidateRepository.find({where:{type: 'marketPlace'}});

           return res.status(200).json({status:200, message: 'Marketplace retrieved successfully', data: candidates});
       }
         catch (e) {
              console.log(e);
              res.status(500).json({message: 'Internal server error'});
         }
    }

    async createAllCandidates(object) {
        console.log(object)
        try {
            object.map(async (item) => {
                const exiest = await this.candidateRepository.findOne({ where: { id: item.id } })
                if (!exiest) {
                    const candidate = await this.candidateRepository.create(item)
                    await this.candidateRepository.save(candidate)
                } else {
                   await this.candidateRepository.update({id
                     : item.id}, item)

                }


            })
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async addMyList(res, user:BusinessOwner, body) {
        try {
            // const exist = await this.myListRepository.findOne({where: {mondayId: body.id}})
            // if (exist) {
            //     return res.status(400).json({status:400, message: 'The Candidate is Already Added'});
            // }
            const event = this.eventEmitter.emit("addToListInMonday",{
                connectedBoard: "connect_boards19",
                boardId: 1399424616,
                userMondayId: user.mondayId,
                candidateMondayId: body.id
            })
            // const myList = await this.myListRepository.create({
            //     mondayId: body.id,
            //     businessOwner: user,
            //     candidate: body.id,
            //     presentBy:body.presentBy
            //
            // })
            // await this.myListRepository.save(myList)
            return res.status(200).json({status:200, message: 'The Candidate is Added Successfully', data: event});

        } catch (e) {
            console.log(e);
            return res.status(500).json({message: 'Internal server error'});
        }
    }


    async removeMyList(res, user:BusinessOwner, id) {
        try {
            // const exist = await this.myListRepository.findOne({where: {mondayId: id.id}})
            // if (!exist) {
            //     return res.status(400).json({status:400, message: 'The Candidate is Not Added'});
            // }
            // const event = this.eventEmitter.emit("removeFromListInMonday",{
            //     connectedBoard: "connect_boards19",
            //     boardId: 1399424616,
            //     userMondayId: user.mondayId,
            //     candidateMondayId: id.id
            // })
            // await this.myListRepository.delete({mondayId: id.id})
            // return res.status(200).json({status:200, message: 'The Candidate is Removed Successfully', data: event});

        } catch (e) {
            console.log(e);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async getMyList(res, user:BusinessOwner) {
        try {
            const list = await this.businessOwnerRepository.findOne({where: {mondayId: user.mondayId}, relations: ['list', 'list.candidate']});

            return res.status(200).json({status:200, message: 'My List retrieved successfully', data: list.list});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async getCandidateExperience(res, id) {
        try {
            const monday = await this.mondayService.querySubItemInItem(id);
            console.log(monday)
            const item = await this.mondayService.createCandidateExperienceObject(monday)
            return res.status(200).json({status:200, message: 'Candidate experience retrieved successfully', data: item});
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({message: 'Internal server error'});
        }
    }






}
